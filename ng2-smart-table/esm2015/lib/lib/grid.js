import { Subject } from 'rxjs';
import { Deferred, getDeepFromObject, getPageForRowIndex } from './helpers';
import { DataSet } from './data-set/data-set';
export class Grid {
    constructor(source, settings) {
        this.createFormShown = false;
        this.onSelectRowSource = new Subject();
        this.onDeselectRowSource = new Subject();
        this.setSettings(settings);
        this.setSource(source);
    }
    detach() {
        if (this.sourceOnChangedSubscription) {
            this.sourceOnChangedSubscription.unsubscribe();
        }
        if (this.sourceOnUpdatedSubscription) {
            this.sourceOnUpdatedSubscription.unsubscribe();
        }
    }
    showActionColumn(position) {
        return this.isCurrentActionsPosition(position) && this.isActionsVisible();
    }
    isCurrentActionsPosition(position) {
        return position == this.getSetting('actions.position');
    }
    isActionsVisible() {
        return this.getSetting('actions.add') || this.getSetting('actions.edit') || this.getSetting('actions.delete') || this.getSetting('actions.custom').length;
    }
    isMultiSelectVisible() {
        return this.getSetting('selectMode') === 'multi';
    }
    getNewRow() {
        return this.dataSet.newRow;
    }
    setSettings(settings) {
        this.settings = settings;
        this.dataSet = new DataSet([], this.getSetting('columns'));
        if (this.source) {
            this.source.refresh();
        }
    }
    getDataSet() {
        return this.dataSet;
    }
    setSource(source) {
        this.source = this.prepareSource(source);
        this.detach();
        this.sourceOnChangedSubscription = this.source.onChanged().subscribe((changes) => this.processDataChange(changes));
        this.sourceOnUpdatedSubscription = this.source.onUpdated().subscribe((data) => {
            const changedRow = this.dataSet.findRowByData(data);
            changedRow.setData(data);
        });
    }
    getSetting(name, defaultValue) {
        return getDeepFromObject(this.settings, name, defaultValue);
    }
    getColumns() {
        return this.dataSet.getColumns();
    }
    getRows() {
        return this.dataSet.getRows();
    }
    selectRow(row) {
        this.dataSet.selectRow(row);
    }
    multipleSelectRow(row) {
        this.dataSet.multipleSelectRow(row);
    }
    onSelectRow() {
        return this.onSelectRowSource.asObservable();
    }
    onDeselectRow() {
        return this.onDeselectRowSource.asObservable();
    }
    edit(row) {
        row.isInEditing = true;
    }
    create(row, confirmEmitter) {
        const deferred = new Deferred();
        deferred.promise.then((newData) => {
            newData = newData ? newData : row.getNewData();
            if (deferred.resolve.skipAdd) {
                this.createFormShown = false;
            }
            else {
                this.source.prepend(newData).then(() => {
                    this.createFormShown = false;
                    this.dataSet.createNewRow();
                });
            }
        }).catch((err) => {
            // doing nothing
        });
        if (this.getSetting('add.confirmCreate')) {
            confirmEmitter.emit({
                newData: row.getNewData(),
                source: this.source,
                confirm: deferred,
            });
        }
        else {
            deferred.resolve();
        }
    }
    save(row, confirmEmitter) {
        const deferred = new Deferred();
        deferred.promise.then((newData) => {
            newData = newData ? newData : row.getNewData();
            if (deferred.resolve.skipEdit) {
                row.isInEditing = false;
            }
            else {
                this.source.update(row.getData(), newData).then(() => {
                    row.isInEditing = false;
                });
            }
        }).catch((err) => {
            // doing nothing
        });
        if (this.getSetting('edit.confirmSave')) {
            confirmEmitter.emit({
                data: row.getData(),
                newData: row.getNewData(),
                source: this.source,
                confirm: deferred,
            });
        }
        else {
            deferred.resolve();
        }
    }
    delete(row, confirmEmitter) {
        const deferred = new Deferred();
        deferred.promise.then(() => {
            this.source.remove(row.getData());
        }).catch((err) => {
            // doing nothing
        });
        if (this.getSetting('delete.confirmDelete')) {
            confirmEmitter.emit({
                data: row.getData(),
                source: this.source,
                confirm: deferred,
            });
        }
        else {
            deferred.resolve();
        }
    }
    processDataChange(changes) {
        if (this.shouldProcessChange(changes)) {
            this.dataSet.setData(changes['elements']);
            if (this.getSetting('selectMode') !== 'multi') {
                const row = this.determineRowToSelect(changes);
                if (row) {
                    this.onSelectRowSource.next(row);
                }
                else {
                    this.onDeselectRowSource.next(null);
                }
            }
        }
    }
    shouldProcessChange(changes) {
        if (['filter', 'sort', 'page', 'remove', 'refresh', 'load', 'paging'].indexOf(changes['action']) !== -1) {
            return true;
        }
        else if (['prepend', 'append'].indexOf(changes['action']) !== -1 && !this.getSetting('pager.display')) {
            return true;
        }
        return false;
    }
    /**
     * @breaking-change 1.8.0
     * Need to add `| null` in return type
     *
     * TODO: move to selectable? Separate directive
     */
    determineRowToSelect(changes) {
        if (['load', 'page', 'filter', 'sort', 'refresh'].indexOf(changes['action']) !== -1) {
            return this.dataSet.select(this.getRowIndexToSelect());
        }
        if (this.shouldSkipSelection()) {
            return null;
        }
        if (changes['action'] === 'remove') {
            if (changes['elements'].length === 0) {
                // we have to store which one to select as the data will be reloaded
                this.dataSet.willSelectLastRow();
            }
            else {
                return this.dataSet.selectPreviousRow();
            }
        }
        if (changes['action'] === 'append') {
            // we have to store which one to select as the data will be reloaded
            this.dataSet.willSelectLastRow();
        }
        if (changes['action'] === 'add') {
            return this.dataSet.selectFirstRow();
        }
        if (changes['action'] === 'update') {
            return this.dataSet.selectFirstRow();
        }
        if (changes['action'] === 'prepend') {
            // we have to store which one to select as the data will be reloaded
            this.dataSet.willSelectFirstRow();
        }
        return null;
    }
    prepareSource(source) {
        const initialSource = this.getInitialSort();
        if (initialSource && initialSource['field'] && initialSource['direction']) {
            source.setSort([initialSource], false);
        }
        if (this.getSetting('pager.display') === true) {
            source.setPaging(this.getPageToSelect(source), this.getSetting('pager.perPage'), false);
        }
        source.refresh();
        return source;
    }
    getInitialSort() {
        const sortConf = {};
        this.getColumns().forEach((column) => {
            if (column.isSortable && column.defaultSortDirection) {
                sortConf['field'] = column.id;
                sortConf['direction'] = column.defaultSortDirection;
                sortConf['compare'] = column.getCompareFunction();
            }
        });
        return sortConf;
    }
    getSelectedRows() {
        return this.dataSet.getRows()
            .filter(r => r.isSelected);
    }
    selectAllRows(status) {
        this.dataSet.getRows()
            .forEach(r => r.isSelected = status);
    }
    getFirstRow() {
        return this.dataSet.getFirstRow();
    }
    getLastRow() {
        return this.dataSet.getLastRow();
    }
    getSelectionInfo() {
        const switchPageToSelectedRowPage = this.getSetting('switchPageToSelectedRowPage');
        const selectedRowIndex = Number(this.getSetting('selectedRowIndex', 0)) || 0;
        const { perPage, page } = this.getSetting('pager');
        return { perPage, page, selectedRowIndex, switchPageToSelectedRowPage };
    }
    getRowIndexToSelect() {
        const { switchPageToSelectedRowPage, selectedRowIndex, perPage } = this.getSelectionInfo();
        const dataAmount = this.source.count();
        /**
         * source - contains all table data
         * dataSet - contains data for current page
         * selectedRowIndex - contains index for data in all data
         *
         * because of that, we need to count index for a specific row in page
         * if
         * `switchPageToSelectedRowPage` - we need to change page automatically
         * `selectedRowIndex < dataAmount && selectedRowIndex >= 0` - index points to existing data
         * (if index points to non-existing data and we calculate index for current page - we will get wrong selected row.
         *  if we return index witch not points to existing data - no line will be highlighted)
         */
        return (switchPageToSelectedRowPage &&
            selectedRowIndex < dataAmount &&
            selectedRowIndex >= 0) ?
            selectedRowIndex % perPage :
            selectedRowIndex;
    }
    getPageToSelect(source) {
        const { switchPageToSelectedRowPage, selectedRowIndex, perPage, page } = this.getSelectionInfo();
        let pageToSelect = Math.max(1, page);
        if (switchPageToSelectedRowPage && selectedRowIndex >= 0) {
            pageToSelect = getPageForRowIndex(selectedRowIndex, perPage);
        }
        const maxPageAmount = Math.ceil(source.count() / perPage);
        return maxPageAmount ? Math.min(pageToSelect, maxPageAmount) : pageToSelect;
    }
    shouldSkipSelection() {
        /**
         * For backward compatibility when using `selectedRowIndex` with non-number values - ignored.
         *
         * Therefore, in order to select a row after some changes,
         * the `selectedRowIndex` value must be invalid or >= 0 (< 0 means that no row is selected).
         *
         * `Number(value)` returns `NaN` on all invalid cases, and comparisons with `NaN` always return `false`.
         *
         * !!! We should skip a row only in cases when `selectedRowIndex` < 0
         * because when < 0 all lines must be deselected
         */
        const selectedRowIndex = Number(this.getSetting('selectedRowIndex'));
        return selectedRowIndex < 0;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JpZC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvbXV1c21hbi9Xb3JrL25nMi1zbWFydC10YWJsZS9wcm9qZWN0cy9uZzItc21hcnQtdGFibGUvc3JjLyIsInNvdXJjZXMiOlsibGliL2xpYi9ncmlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBSTdDLE9BQU8sRUFBRSxRQUFRLEVBQUUsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFHNUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBRzlDLE1BQU0sT0FBTyxJQUFJO0lBY2YsWUFBWSxNQUFrQixFQUFFLFFBQWE7UUFaN0Msb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFNakMsc0JBQWlCLEdBQUcsSUFBSSxPQUFPLEVBQU8sQ0FBQztRQUN2Qyx3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBTyxDQUFDO1FBTXZDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN6QixDQUFDO0lBRUQsTUFBTTtRQUNKLElBQUksSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQ3BDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoRDtRQUNELElBQUksSUFBSSxDQUFDLDJCQUEyQixFQUFFO1lBQ3BDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoRDtJQUNILENBQUM7SUFFRCxnQkFBZ0IsQ0FBQyxRQUFnQjtRQUMvQixPQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxRQUFRLENBQUMsSUFBSSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztJQUM1RSxDQUFDO0lBRUQsd0JBQXdCLENBQUMsUUFBZ0I7UUFDdkMsT0FBTyxRQUFRLElBQUksSUFBSSxDQUFD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O0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEV2ZW50RW1pdHRlciB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEZWZlcnJlZCwgZ2V0RGVlcEZyb21PYmplY3QsIGdldFBhZ2VGb3JSb3dJbmRleCB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgeyBDb2x1bW4gfSBmcm9tICcuL2RhdGEtc2V0L2NvbHVtbic7XG5pbXBvcnQgeyBSb3cgfSBmcm9tICcuL2RhdGEtc2V0L3Jvdyc7XG5pbXBvcnQgeyBEYXRhU2V0IH0gZnJvbSAnLi9kYXRhLXNldC9kYXRhLXNldCc7XG5pbXBvcnQgeyBEYXRhU291cmNlIH0gZnJvbSAnLi9kYXRhLXNvdXJjZS9kYXRhLXNvdXJjZSc7XG5cbmV4cG9ydCBjbGFzcyBHcmlkIHtcblxuICBjcmVhdGVGb3JtU2hvd246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBzb3VyY2U6IERhdGFTb3VyY2U7XG4gIHNldHRpbmdzOiBhbnk7XG4gIGRhdGFTZXQ6IERhdGFTZXQ7XG5cbiAgb25TZWxlY3RSb3dTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG4gIG9uRGVzZWxlY3RSb3dTb3VyY2UgPSBuZXcgU3ViamVjdDxhbnk+KCk7XG5cbiAgcHJpdmF0ZSBzb3VyY2VPbkNoYW5nZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBzb3VyY2VPblVwZGF0ZWRTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3Rvcihzb3VyY2U6IERhdGFTb3VyY2UsIHNldHRpbmdzOiBhbnkpIHtcbiAgICB0aGlzLnNldFNldHRpbmdzKHNldHRpbmdzKTtcbiAgICB0aGlzLnNldFNvdXJjZShzb3VyY2UpO1xuICB9XG5cbiAgZGV0YWNoKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNvdXJjZU9uQ2hhbmdlZFN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5zb3VyY2VPbkNoYW5nZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuc291cmNlT25VcGRhdGVkU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnNvdXJjZU9uVXBkYXRlZFN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHNob3dBY3Rpb25Db2x1bW4ocG9zaXRpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmlzQ3VycmVudEFjdGlvbnNQb3NpdGlvbihwb3NpdGlvbikgJiYgdGhpcy5pc0FjdGlvbnNWaXNpYmxlKCk7XG4gIH1cblxuICBpc0N1cnJlbnRBY3Rpb25zUG9zaXRpb24ocG9zaXRpb246IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBwb3NpdGlvbiA9PSB0aGlzLmdldFNldHRpbmcoJ2FjdGlvbnMucG9zaXRpb24nKTtcbiAgfVxuXG4gIGlzQWN0aW9uc1Zpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2V0dGluZygnYWN0aW9ucy5hZGQnKSB8fCB0aGlzLmdldFNldHRpbmcoJ2FjdGlvbnMuZWRpdCcpIHx8IHRoaXMuZ2V0U2V0dGluZygnYWN0aW9ucy5kZWxldGUnKSB8fCB0aGlzLmdldFNldHRpbmcoJ2FjdGlvbnMuY3VzdG9tJykubGVuZ3RoO1xuICB9XG5cbiAgaXNNdWx0aVNlbGVjdFZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U2V0dGluZygnc2VsZWN0TW9kZScpID09PSAnbXVsdGknO1xuICB9XG5cbiAgZ2V0TmV3Um93KCk6IFJvdyB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNldC5uZXdSb3c7XG4gIH1cblxuICBzZXRTZXR0aW5ncyhzZXR0aW5nczogT2JqZWN0KSB7XG4gICAgdGhpcy5zZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgIHRoaXMuZGF0YVNldCA9IG5ldyBEYXRhU2V0KFtdLCB0aGlzLmdldFNldHRpbmcoJ2NvbHVtbnMnKSk7XG5cbiAgICBpZiAodGhpcy5zb3VyY2UpIHtcbiAgICAgIHRoaXMuc291cmNlLnJlZnJlc2goKTtcbiAgICB9XG4gIH1cblxuICBnZXREYXRhU2V0KCk6IERhdGFTZXQge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXQ7XG4gIH1cblxuICBzZXRTb3VyY2Uoc291cmNlOiBEYXRhU291cmNlKSB7XG4gICAgdGhpcy5zb3VyY2UgPSB0aGlzLnByZXBhcmVTb3VyY2Uoc291cmNlKTtcbiAgICB0aGlzLmRldGFjaCgpO1xuXG4gICAgdGhpcy5zb3VyY2VPbkNoYW5nZWRTdWJzY3JpcHRpb24gPSB0aGlzLnNvdXJjZS5vbkNoYW5nZWQoKS5zdWJzY3JpYmUoKGNoYW5nZXM6IGFueSkgPT4gdGhpcy5wcm9jZXNzRGF0YUNoYW5nZShjaGFuZ2VzKSk7XG5cbiAgICB0aGlzLnNvdXJjZU9uVXBkYXRlZFN1YnNjcmlwdGlvbiA9IHRoaXMuc291cmNlLm9uVXBkYXRlZCgpLnN1YnNjcmliZSgoZGF0YTogYW55KSA9PiB7XG4gICAgICBjb25zdCBjaGFuZ2VkUm93ID0gdGhpcy5kYXRhU2V0LmZpbmRSb3dCeURhdGEoZGF0YSk7XG4gICAgICBjaGFuZ2VkUm93LnNldERhdGEoZGF0YSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRTZXR0aW5nKG5hbWU6IHN0cmluZywgZGVmYXVsdFZhbHVlPzogYW55KTogYW55IHtcbiAgICByZXR1cm4gZ2V0RGVlcEZyb21PYmplY3QodGhpcy5zZXR0aW5ncywgbmFtZSwgZGVmYXVsdFZhbHVlKTtcbiAgfVxuXG4gIGdldENvbHVtbnMoKTogQXJyYXk8Q29sdW1uPiB7XG4gICAgcmV0dXJuIHRoaXMuZGF0YVNldC5nZXRDb2x1bW5zKCk7XG4gIH1cblxuICBnZXRSb3dzKCk6IEFycmF5PFJvdz4ge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXQuZ2V0Um93cygpO1xuICB9XG5cbiAgc2VsZWN0Um93KHJvdzogUm93KSB7XG4gICAgdGhpcy5kYXRhU2V0LnNlbGVjdFJvdyhyb3cpO1xuICB9XG5cbiAgbXVsdGlwbGVTZWxlY3RSb3cocm93OiBSb3cpIHtcbiAgICB0aGlzLmRhdGFTZXQubXVsdGlwbGVTZWxlY3RSb3cocm93KTtcbiAgfVxuXG4gIG9uU2VsZWN0Um93KCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub25TZWxlY3RSb3dTb3VyY2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBvbkRlc2VsZWN0Um93KCk6IE9ic2VydmFibGU8YW55PiB7XG4gICAgcmV0dXJuIHRoaXMub25EZXNlbGVjdFJvd1NvdXJjZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGVkaXQocm93OiBSb3cpIHtcbiAgICByb3cuaXNJbkVkaXRpbmcgPSB0cnVlO1xuICB9XG5cbiAgY3JlYXRlKHJvdzogUm93LCBjb25maXJtRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4pIHtcblxuICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XG4gICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKChuZXdEYXRhKSA9PiB7XG4gICAgICBuZXdEYXRhID0gbmV3RGF0YSA/IG5ld0RhdGEgOiByb3cuZ2V0TmV3RGF0YSgpO1xuICAgICAgaWYgKGRlZmVycmVkLnJlc29sdmUuc2tpcEFkZCkge1xuICAgICAgICB0aGlzLmNyZWF0ZUZvcm1TaG93biA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zb3VyY2UucHJlcGVuZChuZXdEYXRhKS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNyZWF0ZUZvcm1TaG93biA9IGZhbHNlO1xuICAgICAgICAgIHRoaXMuZGF0YVNldC5jcmVhdGVOZXdSb3coKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goKGVycikgPT4ge1xuICAgICAgLy8gZG9pbmcgbm90aGluZ1xuICAgIH0pO1xuXG4gICAgaWYgKHRoaXMuZ2V0U2V0dGluZygnYWRkLmNvbmZpcm1DcmVhdGUnKSkge1xuICAgICAgY29uZmlybUVtaXR0ZXIuZW1pdCh7XG4gICAgICAgIG5ld0RhdGE6IHJvdy5nZXROZXdEYXRhKCksXG4gICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgIGNvbmZpcm06IGRlZmVycmVkLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9XG4gIH1cblxuICBzYXZlKHJvdzogUm93LCBjb25maXJtRW1pdHRlcjogRXZlbnRFbWl0dGVyPGFueT4pIHtcblxuICAgIGNvbnN0IGRlZmVycmVkID0gbmV3IERlZmVycmVkKCk7XG4gICAgZGVmZXJyZWQucHJvbWlzZS50aGVuKChuZXdEYXRhKSA9PiB7XG4gICAgICBuZXdEYXRhID0gbmV3RGF0YSA/IG5ld0RhdGEgOiByb3cuZ2V0TmV3RGF0YSgpO1xuICAgICAgaWYgKGRlZmVycmVkLnJlc29sdmUuc2tpcEVkaXQpIHtcbiAgICAgICAgcm93LmlzSW5FZGl0aW5nID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNvdXJjZS51cGRhdGUocm93LmdldERhdGEoKSwgbmV3RGF0YSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgcm93LmlzSW5FZGl0aW5nID0gZmFsc2U7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIC8vIGRvaW5nIG5vdGhpbmdcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmdldFNldHRpbmcoJ2VkaXQuY29uZmlybVNhdmUnKSkge1xuICAgICAgY29uZmlybUVtaXR0ZXIuZW1pdCh7XG4gICAgICAgIGRhdGE6IHJvdy5nZXREYXRhKCksXG4gICAgICAgIG5ld0RhdGE6IHJvdy5nZXROZXdEYXRhKCksXG4gICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2UsXG4gICAgICAgIGNvbmZpcm06IGRlZmVycmVkLFxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlZmVycmVkLnJlc29sdmUoKTtcbiAgICB9XG4gIH1cblxuICBkZWxldGUocm93OiBSb3csIGNvbmZpcm1FbWl0dGVyOiBFdmVudEVtaXR0ZXI8YW55Pikge1xuXG4gICAgY29uc3QgZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcbiAgICBkZWZlcnJlZC5wcm9taXNlLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5zb3VyY2UucmVtb3ZlKHJvdy5nZXREYXRhKCkpO1xuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgIC8vIGRvaW5nIG5vdGhpbmdcbiAgICB9KTtcblxuICAgIGlmICh0aGlzLmdldFNldHRpbmcoJ2RlbGV0ZS5jb25maXJtRGVsZXRlJykpIHtcbiAgICAgIGNvbmZpcm1FbWl0dGVyLmVtaXQoe1xuICAgICAgICBkYXRhOiByb3cuZ2V0RGF0YSgpLFxuICAgICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgICBjb25maXJtOiBkZWZlcnJlZCxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWZlcnJlZC5yZXNvbHZlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0RhdGFDaGFuZ2UoY2hhbmdlczogYW55KSB7XG4gICAgaWYgKHRoaXMuc2hvdWxkUHJvY2Vzc0NoYW5nZShjaGFuZ2VzKSkge1xuICAgICAgdGhpcy5kYXRhU2V0LnNldERhdGEoY2hhbmdlc1snZWxlbWVudHMnXSk7XG4gICAgICBpZiAodGhpcy5nZXRTZXR0aW5nKCdzZWxlY3RNb2RlJykgIT09ICdtdWx0aScpIHtcbiAgICAgICAgY29uc3Qgcm93ID0gdGhpcy5kZXRlcm1pbmVSb3dUb1NlbGVjdChjaGFuZ2VzKTtcblxuICAgICAgICBpZiAocm93KSB7XG4gICAgICAgICAgdGhpcy5vblNlbGVjdFJvd1NvdXJjZS5uZXh0KHJvdyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkRlc2VsZWN0Um93U291cmNlLm5leHQobnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzaG91bGRQcm9jZXNzQ2hhbmdlKGNoYW5nZXM6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmIChbJ2ZpbHRlcicsICdzb3J0JywgJ3BhZ2UnLCAncmVtb3ZlJywgJ3JlZnJlc2gnLCAnbG9hZCcsICdwYWdpbmcnXS5pbmRleE9mKGNoYW5nZXNbJ2FjdGlvbiddKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSBpZiAoWydwcmVwZW5kJywgJ2FwcGVuZCddLmluZGV4T2YoY2hhbmdlc1snYWN0aW9uJ10pICE9PSAtMSAmJiAhdGhpcy5nZXRTZXR0aW5nKCdwYWdlci5kaXNwbGF5JykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAYnJlYWtpbmctY2hhbmdlIDEuOC4wXG4gICAqIE5lZWQgdG8gYWRkIGB8IG51bGxgIGluIHJldHVybiB0eXBlXG4gICAqXG4gICAqIFRPRE86IG1vdmUgdG8gc2VsZWN0YWJsZT8gU2VwYXJhdGUgZGlyZWN0aXZlXG4gICAqL1xuICBkZXRlcm1pbmVSb3dUb1NlbGVjdChjaGFuZ2VzOiBhbnkpOiBSb3cge1xuXG4gICAgaWYgKFsnbG9hZCcsICdwYWdlJywgJ2ZpbHRlcicsICdzb3J0JywgJ3JlZnJlc2gnXS5pbmRleE9mKGNoYW5nZXNbJ2FjdGlvbiddKSAhPT0gLTEpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFTZXQuc2VsZWN0KHRoaXMuZ2V0Um93SW5kZXhUb1NlbGVjdCgpKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5zaG91bGRTa2lwU2VsZWN0aW9uKCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzWydhY3Rpb24nXSA9PT0gJ3JlbW92ZScpIHtcbiAgICAgIGlmIChjaGFuZ2VzWydlbGVtZW50cyddLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAvLyB3ZSBoYXZlIHRvIHN0b3JlIHdoaWNoIG9uZSB0byBzZWxlY3QgYXMgdGhlIGRhdGEgd2lsbCBiZSByZWxvYWRlZFxuICAgICAgICB0aGlzLmRhdGFTZXQud2lsbFNlbGVjdExhc3RSb3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFTZXQuc2VsZWN0UHJldmlvdXNSb3coKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2FjdGlvbiddID09PSAnYXBwZW5kJykge1xuICAgICAgLy8gd2UgaGF2ZSB0byBzdG9yZSB3aGljaCBvbmUgdG8gc2VsZWN0IGFzIHRoZSBkYXRhIHdpbGwgYmUgcmVsb2FkZWRcbiAgICAgIHRoaXMuZGF0YVNldC53aWxsU2VsZWN0TGFzdFJvdygpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlc1snYWN0aW9uJ10gPT09ICdhZGQnKSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRhU2V0LnNlbGVjdEZpcnN0Um93KCk7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzWydhY3Rpb24nXSA9PT0gJ3VwZGF0ZScpIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGFTZXQuc2VsZWN0Rmlyc3RSb3coKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXNbJ2FjdGlvbiddID09PSAncHJlcGVuZCcpIHtcbiAgICAgIC8vIHdlIGhhdmUgdG8gc3RvcmUgd2hpY2ggb25lIHRvIHNlbGVjdCBhcyB0aGUgZGF0YSB3aWxsIGJlIHJlbG9hZGVkXG4gICAgICB0aGlzLmRhdGFTZXQud2lsbFNlbGVjdEZpcnN0Um93KCk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcHJlcGFyZVNvdXJjZShzb3VyY2U6IGFueSk6IERhdGFTb3VyY2Uge1xuICAgIGNvbnN0IGluaXRpYWxTb3VyY2U6IGFueSA9IHRoaXMuZ2V0SW5pdGlhbFNvcnQoKTtcbiAgICBpZiAoaW5pdGlhbFNvdXJjZSAmJiBpbml0aWFsU291cmNlWydmaWVsZCddICYmIGluaXRpYWxTb3VyY2VbJ2RpcmVjdGlvbiddKSB7XG4gICAgICBzb3VyY2Uuc2V0U29ydChbaW5pdGlhbFNvdXJjZV0sIGZhbHNlKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuZ2V0U2V0dGluZygncGFnZXIuZGlzcGxheScpID09PSB0cnVlKSB7XG4gICAgICBzb3VyY2Uuc2V0UGFnaW5nKHRoaXMuZ2V0UGFnZVRvU2VsZWN0KHNvdXJjZSksIHRoaXMuZ2V0U2V0dGluZygncGFnZXIucGVyUGFnZScpLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgc291cmNlLnJlZnJlc2goKTtcbiAgICByZXR1cm4gc291cmNlO1xuICB9XG5cbiAgZ2V0SW5pdGlhbFNvcnQoKSB7XG4gICAgY29uc3Qgc29ydENvbmY6IGFueSA9IHt9O1xuICAgIHRoaXMuZ2V0Q29sdW1ucygpLmZvckVhY2goKGNvbHVtbjogQ29sdW1uKSA9PiB7XG4gICAgICBpZiAoY29sdW1uLmlzU29ydGFibGUgJiYgY29sdW1uLmRlZmF1bHRTb3J0RGlyZWN0aW9uKSB7XG4gICAgICAgIHNvcnRDb25mWydmaWVsZCddID0gY29sdW1uLmlkO1xuICAgICAgICBzb3J0Q29uZlsnZGlyZWN0aW9uJ10gPSBjb2x1bW4uZGVmYXVsdFNvcnREaXJlY3Rpb247XG4gICAgICAgIHNvcnRDb25mWydjb21wYXJlJ10gPSBjb2x1bW4uZ2V0Q29tcGFyZUZ1bmN0aW9uKCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHNvcnRDb25mO1xuICB9XG5cbiAgZ2V0U2VsZWN0ZWRSb3dzKCk6IEFycmF5PGFueT4ge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXQuZ2V0Um93cygpXG4gICAgICAuZmlsdGVyKHIgPT4gci5pc1NlbGVjdGVkKTtcbiAgfVxuXG4gIHNlbGVjdEFsbFJvd3Moc3RhdHVzOiBhbnkpIHtcbiAgICB0aGlzLmRhdGFTZXQuZ2V0Um93cygpXG4gICAgICAuZm9yRWFjaChyID0+IHIuaXNTZWxlY3RlZCA9IHN0YXR1cyk7XG4gIH1cblxuICBnZXRGaXJzdFJvdygpOiBSb3cge1xuICAgIHJldHVybiB0aGlzLmRhdGFTZXQuZ2V0Rmlyc3RSb3coKTtcbiAgfVxuXG4gIGdldExhc3RSb3coKTogUm93IHtcbiAgICByZXR1cm4gdGhpcy5kYXRhU2V0LmdldExhc3RSb3coKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U2VsZWN0aW9uSW5mbygpOiB7IHBlclBhZ2U6IG51bWJlciwgcGFnZTogbnVtYmVyLCBzZWxlY3RlZFJvd0luZGV4OiBudW1iZXIsIHN3aXRjaFBhZ2VUb1NlbGVjdGVkUm93UGFnZTogYm9vbGVhbiB9IHtcbiAgICBjb25zdCBzd2l0Y2hQYWdlVG9TZWxlY3RlZFJvd1BhZ2U6IGJvb2xlYW4gPSB0aGlzLmdldFNldHRpbmcoJ3N3aXRjaFBhZ2VUb1NlbGVjdGVkUm93UGFnZScpO1xuICAgIGNvbnN0IHNlbGVjdGVkUm93SW5kZXg6IG51bWJlciA9IE51bWJlcih0aGlzLmdldFNldHRpbmcoJ3NlbGVjdGVkUm93SW5kZXgnLCAwKSkgfHwgMDtcbiAgICBjb25zdCB7IHBlclBhZ2UsIHBhZ2UgfTogeyBwZXJQYWdlOiBudW1iZXIsIHBhZ2U6IG51bWJlciB9ID0gdGhpcy5nZXRTZXR0aW5nKCdwYWdlcicpO1xuICAgIHJldHVybiB7IHBlclBhZ2UsIHBhZ2UsIHNlbGVjdGVkUm93SW5kZXgsIHN3aXRjaFBhZ2VUb1NlbGVjdGVkUm93UGFnZSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRSb3dJbmRleFRvU2VsZWN0KCk6IG51bWJlciB7XG4gICAgY29uc3QgeyBzd2l0Y2hQYWdlVG9TZWxlY3RlZFJvd1BhZ2UsIHNlbGVjdGVkUm93SW5kZXgsIHBlclBhZ2UgfSA9IHRoaXMuZ2V0U2VsZWN0aW9uSW5mbygpO1xuICAgIGNvbnN0IGRhdGFBbW91bnQ6IG51bWJlciA9IHRoaXMuc291cmNlLmNvdW50KCk7XG4gICAgLyoqXG4gICAgICogc291cmNlIC0gY29udGFpbnMgYWxsIHRhYmxlIGRhdGFcbiAgICAgKiBkYXRhU2V0IC0gY29udGFpbnMgZGF0YSBmb3IgY3VycmVudCBwYWdlXG4gICAgICogc2VsZWN0ZWRSb3dJbmRleCAtIGNvbnRhaW5zIGluZGV4IGZvciBkYXRhIGluIGFsbCBkYXRhXG4gICAgICpcbiAgICAgKiBiZWNhdXNlIG9mIHRoYXQsIHdlIG5lZWQgdG8gY291bnQgaW5kZXggZm9yIGEgc3BlY2lmaWMgcm93IGluIHBhZ2VcbiAgICAgKiBpZlxuICAgICAqIGBzd2l0Y2hQYWdlVG9TZWxlY3RlZFJvd1BhZ2VgIC0gd2UgbmVlZCB0byBjaGFuZ2UgcGFnZSBhdXRvbWF0aWNhbGx5XG4gICAgICogYHNlbGVjdGVkUm93SW5kZXggPCBkYXRhQW1vdW50ICYmIHNlbGVjdGVkUm93SW5kZXggPj0gMGAgLSBpbmRleCBwb2ludHMgdG8gZXhpc3RpbmcgZGF0YVxuICAgICAqIChpZiBpbmRleCBwb2ludHMgdG8gbm9uLWV4aXN0aW5nIGRhdGEgYW5kIHdlIGNhbGN1bGF0ZSBpbmRleCBmb3IgY3VycmVudCBwYWdlIC0gd2Ugd2lsbCBnZXQgd3Jvbmcgc2VsZWN0ZWQgcm93LlxuICAgICAqICBpZiB3ZSByZXR1cm4gaW5kZXggd2l0Y2ggbm90IHBvaW50cyB0byBleGlzdGluZyBkYXRhIC0gbm8gbGluZSB3aWxsIGJlIGhpZ2hsaWdodGVkKVxuICAgICAqL1xuICAgIHJldHVybiAoXG4gICAgICBzd2l0Y2hQYWdlVG9TZWxlY3RlZFJvd1BhZ2UgJiZcbiAgICAgIHNlbGVjdGVkUm93SW5kZXggPCBkYXRhQW1vdW50ICYmXG4gICAgICBzZWxlY3RlZFJvd0luZGV4ID49IDBcbiAgICApID9cbiAgICAgIHNlbGVjdGVkUm93SW5kZXggJSBwZXJQYWdlIDpcbiAgICAgIHNlbGVjdGVkUm93SW5kZXg7XG4gIH1cblxuICBwcml2YXRlIGdldFBhZ2VUb1NlbGVjdChzb3VyY2U6IERhdGFTb3VyY2UpOiBudW1iZXIge1xuICAgIGNvbnN0IHsgc3dpdGNoUGFnZVRvU2VsZWN0ZWRSb3dQYWdlLCBzZWxlY3RlZFJvd0luZGV4LCBwZXJQYWdlLCBwYWdlIH0gPSB0aGlzLmdldFNlbGVjdGlvbkluZm8oKTtcbiAgICBsZXQgcGFnZVRvU2VsZWN0OiBudW1iZXIgPSBNYXRoLm1heCgxLCBwYWdlKTtcbiAgICBpZiAoc3dpdGNoUGFnZVRvU2VsZWN0ZWRSb3dQYWdlICYmIHNlbGVjdGVkUm93SW5kZXggPj0gMCkge1xuICAgICAgcGFnZVRvU2VsZWN0ID0gZ2V0UGFnZUZvclJvd0luZGV4KHNlbGVjdGVkUm93SW5kZXgsIHBlclBhZ2UpO1xuICAgIH1cbiAgICBjb25zdCBtYXhQYWdlQW1vdW50OiBudW1iZXIgPSBNYXRoLmNlaWwoc291cmNlLmNvdW50KCkgLyBwZXJQYWdlKTtcbiAgICByZXR1cm4gbWF4UGFnZUFtb3VudCA/IE1hdGgubWluKHBhZ2VUb1NlbGVjdCwgbWF4UGFnZUFtb3VudCkgOiBwYWdlVG9TZWxlY3Q7XG4gIH1cblxuICBwcml2YXRlIHNob3VsZFNraXBTZWxlY3Rpb24oKTogYm9vbGVhbiB7XG4gICAgLyoqXG4gICAgICogRm9yIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgd2hlbiB1c2luZyBgc2VsZWN0ZWRSb3dJbmRleGAgd2l0aCBub24tbnVtYmVyIHZhbHVlcyAtIGlnbm9yZWQuXG4gICAgICpcbiAgICAgKiBUaGVyZWZvcmUsIGluIG9yZGVyIHRvIHNlbGVjdCBhIHJvdyBhZnRlciBzb21lIGNoYW5nZXMsXG4gICAgICogdGhlIGBzZWxlY3RlZFJvd0luZGV4YCB2YWx1ZSBtdXN0IGJlIGludmFsaWQgb3IgPj0gMCAoPCAwIG1lYW5zIHRoYXQgbm8gcm93IGlzIHNlbGVjdGVkKS5cbiAgICAgKlxuICAgICAqIGBOdW1iZXIodmFsdWUpYCByZXR1cm5zIGBOYU5gIG9uIGFsbCBpbnZhbGlkIGNhc2VzLCBhbmQgY29tcGFyaXNvbnMgd2l0aCBgTmFOYCBhbHdheXMgcmV0dXJuIGBmYWxzZWAuXG4gICAgICpcbiAgICAgKiAhISEgV2Ugc2hvdWxkIHNraXAgYSByb3cgb25seSBpbiBjYXNlcyB3aGVuIGBzZWxlY3RlZFJvd0luZGV4YCA8IDBcbiAgICAgKiBiZWNhdXNlIHdoZW4gPCAwIGFsbCBsaW5lcyBtdXN0IGJlIGRlc2VsZWN0ZWRcbiAgICAgKi9cbiAgICBjb25zdCBzZWxlY3RlZFJvd0luZGV4ID0gTnVtYmVyKHRoaXMuZ2V0U2V0dGluZygnc2VsZWN0ZWRSb3dJbmRleCcpKTtcbiAgICByZXR1cm4gc2VsZWN0ZWRSb3dJbmRleCA8IDA7XG4gIH1cbn1cbiJdfQ==
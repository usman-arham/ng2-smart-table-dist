import { Cell } from './cell';
export class Row {
    constructor(index, data, _dataSet) {
        this.index = index;
        this.data = data;
        this._dataSet = _dataSet;
        this.isSelected = false;
        this.isInEditing = false;
        this.cells = [];
        this.process();
    }
    getCell(column) {
        return this.cells.find(el => el.getColumn() === column);
    }
    getCells() {
        return this.cells;
    }
    getData() {
        return this.data;
    }
    getIsSelected() {
        return this.isSelected;
    }
    getNewData() {
        const values = Object.assign({}, this.data);
        this.getCells().forEach((cell) => values[cell.getColumn().id] = cell.newValue);
        return values;
    }
    setData(data) {
        this.data = data;
        this.process();
    }
    process() {
        this.cells = [];
        this._dataSet.getColumns().forEach((column) => {
            const cell = this.createCell(column);
            this.cells.push(cell);
        });
    }
    createCell(column) {
        const defValue = column.settings.defaultValue ? column.settings.defaultValue : '';
        const value = typeof this.data[column.id] === 'undefined' ? defValue : this.data[column.id];
        return new Cell(value, this, column, this._dataSet);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9tdXVzbWFuL1dvcmsvbmcyLXNtYXJ0LXRhYmxlL3Byb2plY3RzL25nMi1zbWFydC10YWJsZS9zcmMvIiwic291cmNlcyI6WyJsaWIvbGliL2RhdGEtc2V0L3Jvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBSTlCLE1BQU0sT0FBTyxHQUFHO0lBT2QsWUFBbUIsS0FBYSxFQUFZLElBQVMsRUFBWSxRQUFpQjtRQUEvRCxVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQVksU0FBSSxHQUFKLElBQUksQ0FBSztRQUFZLGFBQVEsR0FBUixRQUFRLENBQVM7UUFMbEYsZUFBVSxHQUFZLEtBQUssQ0FBQztRQUM1QixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUM3QixVQUFLLEdBQWdCLEVBQUUsQ0FBQztRQUl0QixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakIsQ0FBQztJQUVELE9BQU8sQ0FBQyxNQUFjO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLEtBQUssTUFBTSxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDcEIsQ0FBQztJQUVELE9BQU87UUFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVELGFBQWE7UUFDWCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELFVBQVU7UUFDUixNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDNUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0UsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUVELE9BQU8sQ0FBQyxJQUFTO1FBQ2YsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQ2pCLENBQUM7SUFFRCxPQUFPO1FBQ0wsSUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFjLEVBQUUsRUFBRTtZQUNwRCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3JDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUFjO1FBQ3ZCLE1BQU0sUUFBUSxHQUFJLE1BQWMsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBRSxNQUFjLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO1FBQ3BHLE1BQU0sS0FBSyxHQUFHLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssV0FBVyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVGLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENlbGwgfSBmcm9tICcuL2NlbGwnO1xuaW1wb3J0IHsgQ29sdW1uIH0gZnJvbSAnLi9jb2x1bW4nO1xuaW1wb3J0IHsgRGF0YVNldCB9IGZyb20gJy4vZGF0YS1zZXQnO1xuXG5leHBvcnQgY2xhc3MgUm93IHtcblxuICBpc1NlbGVjdGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGlzSW5FZGl0aW5nOiBib29sZWFuID0gZmFsc2U7XG4gIGNlbGxzOiBBcnJheTxDZWxsPiA9IFtdO1xuXG5cbiAgY29uc3RydWN0b3IocHVibGljIGluZGV4OiBudW1iZXIsIHByb3RlY3RlZCBkYXRhOiBhbnksIHByb3RlY3RlZCBfZGF0YVNldDogRGF0YVNldCkge1xuICAgIHRoaXMucHJvY2VzcygpO1xuICB9XG5cbiAgZ2V0Q2VsbChjb2x1bW46IENvbHVtbik6IENlbGwge1xuICAgIHJldHVybiB0aGlzLmNlbGxzLmZpbmQoZWwgPT4gZWwuZ2V0Q29sdW1uKCkgPT09IGNvbHVtbik7XG4gIH1cblxuICBnZXRDZWxscygpIHtcbiAgICByZXR1cm4gdGhpcy5jZWxscztcbiAgfVxuXG4gIGdldERhdGEoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5kYXRhO1xuICB9XG5cbiAgZ2V0SXNTZWxlY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pc1NlbGVjdGVkO1xuICB9XG5cbiAgZ2V0TmV3RGF0YSgpOiBhbnkge1xuICAgIGNvbnN0IHZhbHVlcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGF0YSk7XG4gICAgdGhpcy5nZXRDZWxscygpLmZvckVhY2goKGNlbGwpID0+IHZhbHVlc1tjZWxsLmdldENvbHVtbigpLmlkXSA9IGNlbGwubmV3VmFsdWUpO1xuICAgIHJldHVybiB2YWx1ZXM7XG4gIH1cblxuICBzZXREYXRhKGRhdGE6IGFueSk6IGFueSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLnByb2Nlc3MoKTtcbiAgfVxuXG4gIHByb2Nlc3MoKSB7XG4gICAgdGhpcy5jZWxscyA9IFtdO1xuICAgIHRoaXMuX2RhdGFTZXQuZ2V0Q29sdW1ucygpLmZvckVhY2goKGNvbHVtbjogQ29sdW1uKSA9PiB7XG4gICAgICBjb25zdCBjZWxsID0gdGhpcy5jcmVhdGVDZWxsKGNvbHVtbik7XG4gICAgICB0aGlzLmNlbGxzLnB1c2goY2VsbCk7XG4gICAgfSk7XG4gIH1cblxuICBjcmVhdGVDZWxsKGNvbHVtbjogQ29sdW1uKTogQ2VsbCB7XG4gICAgY29uc3QgZGVmVmFsdWUgPSAoY29sdW1uIGFzIGFueSkuc2V0dGluZ3MuZGVmYXVsdFZhbHVlID8gKGNvbHVtbiBhcyBhbnkpLnNldHRpbmdzLmRlZmF1bHRWYWx1ZSA6ICcnO1xuICAgIGNvbnN0IHZhbHVlID0gdHlwZW9mIHRoaXMuZGF0YVtjb2x1bW4uaWRdID09PSAndW5kZWZpbmVkJyA/IGRlZlZhbHVlIDogdGhpcy5kYXRhW2NvbHVtbi5pZF07XG4gICAgcmV0dXJuIG5ldyBDZWxsKHZhbHVlLCB0aGlzLCBjb2x1bW4sIHRoaXMuX2RhdGFTZXQpO1xuICB9XG59XG4iXX0=
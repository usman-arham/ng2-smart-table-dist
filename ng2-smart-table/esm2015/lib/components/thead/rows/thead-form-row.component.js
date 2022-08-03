import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Grid } from '../../../lib/grid';
import { Row } from '../../../lib/data-set/row';
export class TheadFormRowComponent {
    constructor() {
        this.create = new EventEmitter();
    }
    onCreate(event) {
        event.stopPropagation();
        this.grid.create(this.grid.getNewRow(), this.createConfirm);
    }
    ngOnChanges() {
        this.isMultiSelectVisible = this.grid.isMultiSelectVisible();
        this.showActionColumnLeft = this.grid.showActionColumn('left');
        this.showActionColumnRight = this.grid.showActionColumn('right');
        this.addInputClass = this.grid.getSetting('add.inputClass');
    }
    getVisibleCells(cells) {
        return (cells || []).filter((cell) => !cell.getColumn().hide);
    }
}
TheadFormRowComponent.decorators = [
    { type: Component, args: [{
                selector: '[ng2-st-thead-form-row]',
                template: `
      <td *ngIf="isMultiSelectVisible"></td>
      <td  *ngIf="showActionColumnLeft"  class="ng2-smart-actions">
        <ng2-st-actions [grid]="grid" (create)="onCreate($event)"></ng2-st-actions>
      </td>
      <td *ngFor="let cell of getVisibleCells(grid.getNewRow().getCells())">
        <ng2-smart-table-cell [cell]="cell"
                              [grid]="grid"
                              [isNew]="true"
                              [createConfirm]="createConfirm"
                              [inputClass]="addInputClass"
                              [isInEditing]="grid.getNewRow().isInEditing"
                              (edited)="onCreate($event)">
        </ng2-smart-table-cell>
      </td>
      <td  *ngIf="showActionColumnRight"  class="ng2-smart-actions">
        <ng2-st-actions [grid]="grid" (create)="onCreate($event)"></ng2-st-actions>
      </td>
  `
            },] }
];
TheadFormRowComponent.propDecorators = {
    grid: [{ type: Input }],
    row: [{ type: Input }],
    createConfirm: [{ type: Input }],
    create: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhlYWQtZm9ybS1yb3cuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii9Vc2Vycy9tdXVzbWFuL1dvcmsvbmcyLXNtYXJ0LXRhYmxlL3Byb2plY3RzL25nMi1zbWFydC10YWJsZS9zcmMvIiwic291cmNlcyI6WyJsaWIvY29tcG9uZW50cy90aGVhZC9yb3dzL3RoZWFkLWZvcm0tcm93LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBRWxGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN6QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUF5QmhELE1BQU0sT0FBTyxxQkFBcUI7SUF0QmxDO1FBNEJZLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBdUI3QyxDQUFDO0lBaEJDLFFBQVEsQ0FBQyxLQUFVO1FBQ2pCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7UUFDN0QsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0QsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFFRCxlQUFlLENBQUMsS0FBa0I7UUFDaEMsT0FBTyxDQUFDLEtBQUssSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFVLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RFLENBQUM7OztZQWxERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQlQ7YUFDRjs7O21CQUdFLEtBQUs7a0JBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUVMLE1BQU0iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIElucHV0LCBPdXRwdXQsIEV2ZW50RW1pdHRlciwgT25DaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IEdyaWQgfSBmcm9tICcuLi8uLi8uLi9saWIvZ3JpZCc7XG5pbXBvcnQgeyBSb3cgfSBmcm9tICcuLi8uLi8uLi9saWIvZGF0YS1zZXQvcm93JztcbmltcG9ydCB7IENlbGwgfSBmcm9tICcuLi8uLi8uLi9saWIvZGF0YS1zZXQvY2VsbCc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ1tuZzItc3QtdGhlYWQtZm9ybS1yb3ddJyxcbiAgdGVtcGxhdGU6IGBcbiAgICAgIDx0ZCAqbmdJZj1cImlzTXVsdGlTZWxlY3RWaXNpYmxlXCI+PC90ZD5cbiAgICAgIDx0ZCAgKm5nSWY9XCJzaG93QWN0aW9uQ29sdW1uTGVmdFwiICBjbGFzcz1cIm5nMi1zbWFydC1hY3Rpb25zXCI+XG4gICAgICAgIDxuZzItc3QtYWN0aW9ucyBbZ3JpZF09XCJncmlkXCIgKGNyZWF0ZSk9XCJvbkNyZWF0ZSgkZXZlbnQpXCI+PC9uZzItc3QtYWN0aW9ucz5cbiAgICAgIDwvdGQ+XG4gICAgICA8dGQgKm5nRm9yPVwibGV0IGNlbGwgb2YgZ2V0VmlzaWJsZUNlbGxzKGdyaWQuZ2V0TmV3Um93KCkuZ2V0Q2VsbHMoKSlcIj5cbiAgICAgICAgPG5nMi1zbWFydC10YWJsZS1jZWxsIFtjZWxsXT1cImNlbGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2dyaWRdPVwiZ3JpZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbaXNOZXddPVwidHJ1ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBbY3JlYXRlQ29uZmlybV09XCJjcmVhdGVDb25maXJtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtpbnB1dENsYXNzXT1cImFkZElucHV0Q2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2lzSW5FZGl0aW5nXT1cImdyaWQuZ2V0TmV3Um93KCkuaXNJbkVkaXRpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKGVkaXRlZCk9XCJvbkNyZWF0ZSgkZXZlbnQpXCI+XG4gICAgICAgIDwvbmcyLXNtYXJ0LXRhYmxlLWNlbGw+XG4gICAgICA8L3RkPlxuICAgICAgPHRkICAqbmdJZj1cInNob3dBY3Rpb25Db2x1bW5SaWdodFwiICBjbGFzcz1cIm5nMi1zbWFydC1hY3Rpb25zXCI+XG4gICAgICAgIDxuZzItc3QtYWN0aW9ucyBbZ3JpZF09XCJncmlkXCIgKGNyZWF0ZSk9XCJvbkNyZWF0ZSgkZXZlbnQpXCI+PC9uZzItc3QtYWN0aW9ucz5cbiAgICAgIDwvdGQ+XG4gIGAsXG59KVxuZXhwb3J0IGNsYXNzIFRoZWFkRm9ybVJvd0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG5cbiAgQElucHV0KCkgZ3JpZDogR3JpZDtcbiAgQElucHV0KCkgcm93OiBSb3c7XG4gIEBJbnB1dCgpIGNyZWF0ZUNvbmZpcm06IEV2ZW50RW1pdHRlcjxhbnk+O1xuXG4gIEBPdXRwdXQoKSBjcmVhdGUgPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICBpc011bHRpU2VsZWN0VmlzaWJsZTogYm9vbGVhbjtcbiAgc2hvd0FjdGlvbkNvbHVtbkxlZnQ6IGJvb2xlYW47XG4gIHNob3dBY3Rpb25Db2x1bW5SaWdodDogYm9vbGVhbjtcbiAgYWRkSW5wdXRDbGFzczogc3RyaW5nO1xuXG4gIG9uQ3JlYXRlKGV2ZW50OiBhbnkpIHtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMuZ3JpZC5jcmVhdGUodGhpcy5ncmlkLmdldE5ld1JvdygpLCB0aGlzLmNyZWF0ZUNvbmZpcm0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoKXtcbiAgICB0aGlzLmlzTXVsdGlTZWxlY3RWaXNpYmxlID0gdGhpcy5ncmlkLmlzTXVsdGlTZWxlY3RWaXNpYmxlKCk7XG4gICAgdGhpcy5zaG93QWN0aW9uQ29sdW1uTGVmdCA9IHRoaXMuZ3JpZC5zaG93QWN0aW9uQ29sdW1uKCdsZWZ0Jyk7XG4gICAgdGhpcy5zaG93QWN0aW9uQ29sdW1uUmlnaHQgPSB0aGlzLmdyaWQuc2hvd0FjdGlvbkNvbHVtbigncmlnaHQnKTtcbiAgICB0aGlzLmFkZElucHV0Q2xhc3MgPSB0aGlzLmdyaWQuZ2V0U2V0dGluZygnYWRkLmlucHV0Q2xhc3MnKTtcbiAgfVxuXG4gIGdldFZpc2libGVDZWxscyhjZWxsczogQXJyYXk8Q2VsbD4pOiBBcnJheTxDZWxsPiB7XG4gICAgcmV0dXJuIChjZWxscyB8fCBbXSkuZmlsdGVyKChjZWxsOiBDZWxsKSA9PiAhY2VsbC5nZXRDb2x1bW4oKS5oaWRlKTtcbiAgfVxufVxuIl19
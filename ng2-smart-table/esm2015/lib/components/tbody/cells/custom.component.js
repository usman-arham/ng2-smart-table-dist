import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Row } from '../../../lib/data-set/row';
import { Grid } from '../../../lib/grid';
export class TbodyCustomComponent {
    constructor() {
        this.custom = new EventEmitter();
    }
    onCustom(action, event) {
        event.preventDefault();
        event.stopPropagation();
        this.custom.emit({
            action: action.name,
            data: this.row.getData(),
            source: this.source
        });
    }
}
TbodyCustomComponent.decorators = [
    { type: Component, args: [{
                selector: 'ng2-st-tbody-custom',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
      <a *ngFor="let action of grid.getSetting('actions.custom')" href="#"
         class="ng2-smart-action ng2-smart-action-custom-custom" 
         [innerHTML]="action.title"
         (click)="onCustom(action, $event)"></a>
        `
            },] }
];
TbodyCustomComponent.propDecorators = {
    grid: [{ type: Input }],
    row: [{ type: Input }],
    source: [{ type: Input }],
    custom: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3VzdG9tLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIvVXNlcnMvbXV1c21hbi9Xb3JrL25nMi1zbWFydC10YWJsZS9wcm9qZWN0cy9uZzItc21hcnQtdGFibGUvc3JjLyIsInNvdXJjZXMiOlsibGliL2NvbXBvbmVudHMvdGJvZHkvY2VsbHMvY3VzdG9tLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ2hHLE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUVoRCxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFZekMsTUFBTSxPQUFPLG9CQUFvQjtJQVZqQztRQWVjLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBTyxDQUFDO0lBYS9DLENBQUM7SUFYRyxRQUFRLENBQUMsTUFBVyxFQUFFLEtBQVU7UUFDNUIsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3ZCLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUV4QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztZQUNiLE1BQU0sRUFBRSxNQUFNLENBQUMsSUFBSTtZQUNuQixJQUFJLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLEVBQUU7WUFDeEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1NBQ3RCLENBQUMsQ0FBQztJQUNQLENBQUM7OztZQTFCSixTQUFTLFNBQUM7Z0JBQ1AsUUFBUSxFQUFFLHFCQUFxQjtnQkFDL0IsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRTs7Ozs7U0FLTDthQUNSOzs7bUJBR0ksS0FBSztrQkFDTCxLQUFLO3FCQUNMLEtBQUs7cUJBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE91dHB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm93IH0gZnJvbSAnLi4vLi4vLi4vbGliL2RhdGEtc2V0L3Jvdyc7XG5cbmltcG9ydCB7IEdyaWQgfSBmcm9tICcuLi8uLi8uLi9saWIvZ3JpZCc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAnbmcyLXN0LXRib2R5LWN1c3RvbScsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgIDxhICpuZ0Zvcj1cImxldCBhY3Rpb24gb2YgZ3JpZC5nZXRTZXR0aW5nKCdhY3Rpb25zLmN1c3RvbScpXCIgaHJlZj1cIiNcIlxuICAgICAgICAgY2xhc3M9XCJuZzItc21hcnQtYWN0aW9uIG5nMi1zbWFydC1hY3Rpb24tY3VzdG9tLWN1c3RvbVwiIFxuICAgICAgICAgW2lubmVySFRNTF09XCJhY3Rpb24udGl0bGVcIlxuICAgICAgICAgKGNsaWNrKT1cIm9uQ3VzdG9tKGFjdGlvbiwgJGV2ZW50KVwiPjwvYT5cbiAgICAgICAgYFxufSlcbmV4cG9ydCBjbGFzcyBUYm9keUN1c3RvbUNvbXBvbmVudCB7XG5cbiAgICBASW5wdXQoKSBncmlkOiBHcmlkO1xuICAgIEBJbnB1dCgpIHJvdzogUm93O1xuICAgIEBJbnB1dCgpIHNvdXJjZTogYW55O1xuICAgIEBPdXRwdXQoKSBjdXN0b20gPSBuZXcgRXZlbnRFbWl0dGVyPGFueT4oKTtcblxuICAgIG9uQ3VzdG9tKGFjdGlvbjogYW55LCBldmVudDogYW55KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICAgIHRoaXMuY3VzdG9tLmVtaXQoe1xuICAgICAgICAgICAgYWN0aW9uOiBhY3Rpb24ubmFtZSxcbiAgICAgICAgICAgIGRhdGE6IHRoaXMucm93LmdldERhdGEoKSxcbiAgICAgICAgICAgIHNvdXJjZTogdGhpcy5zb3VyY2VcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG4iXX0=
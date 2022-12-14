import { EventEmitter, OnChanges } from '@angular/core';
import { Grid } from '../../../lib/grid';
import { DataSource } from '../../../lib/data-source/data-source';
import { Column } from "../../../lib/data-set/column";
export declare class TheadTitlesRowComponent implements OnChanges {
    grid: Grid;
    isAllSelected: boolean;
    source: DataSource;
    sort: EventEmitter<any>;
    selectAllRows: EventEmitter<any>;
    isMultiSelectVisible: boolean;
    showActionColumnLeft: boolean;
    showActionColumnRight: boolean;
    ngOnChanges(): void;
    getVisibleColumns(columns: Array<Column>): Array<Column>;
}

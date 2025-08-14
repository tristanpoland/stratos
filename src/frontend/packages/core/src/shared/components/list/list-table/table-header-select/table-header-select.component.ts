import { Component } from '@angular/core';

import { TableCellCustom } from '../../list.types';

@Component({
selector: 'app-table-header-select',
  templateUrl: './table-header-select.component.html',
  styleUrls: ['./table-header-select.component.scss'],
  standalone: false
})
export class TableHeaderSelectComponent<T> extends TableCellCustom<T> { }

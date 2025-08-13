import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { TableCellCustom } from '../../list.types';
import { TableRowExpandedService } from '../table-row/table-row-expanded-service';
import { CellConfigFunction } from '../table.types';

export interface TableCellExpanderConfig {
  rowId: string;
}

@Component({
selector: 'app-table-cell-expander',
  templateUrl: './table-cell-expander.component.html',
  styleUrls: ['./table-cell-expander.component.scss'],
  standalone: false,
  animations: [
    trigger('indicatorRotate', [
      state('collapsed, void', style({ transform: 'rotate(0deg)' })),
      state('expanded', style({ transform: 'rotate(180deg)' })),
      transition('expanded <=> collapsed, void => collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ]),
  ]
})
export class TableCellExpanderComponent<T = any> extends TableCellCustom<T, CellConfigFunction<T>> implements OnInit {

  expanded = false;
  constructor(public expandedService: TableRowExpandedService) {
    super();
  }

  @Input() set config(config: CellConfigFunction<T>) {
    super.config = config;
    this.updateRowId();
  }
  get config(): CellConfigFunction<T> {
    return super.config;
  }

  @Input() set row(row: T) {
    super.row = row;
    this.updateRowId();
  }
  get row(): T {
    return super.row;
  }

  public rowId = TableRowExpandedService.allExpanderState;
  private updateRowId() {
    if (this.config) {
      const config: TableCellExpanderConfig = this.config(this.row);
      this.rowId = config.rowId;
      this.expanded = this.expandedService.expanded[this.rowId];
    }
  }

  ngOnInit() {
    this.expanded = this.expandedService.expanded[this.rowId];
  }

  toggle() {
    if (this.rowId === TableRowExpandedService.allExpanderState) {
      this.expandedService.toggleHeader();
    } else {
      // Toggle of non-header row is handled natively by header
    }
  }
}

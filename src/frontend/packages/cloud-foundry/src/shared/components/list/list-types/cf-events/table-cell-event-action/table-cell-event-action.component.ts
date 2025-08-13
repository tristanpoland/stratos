import { Component } from '@angular/core';

import { TableCellCustom } from '../../../../../../../../core/src/shared/components/list/list.types';
import { APIResource } from '../../../../../../../../store/src/types/api.types';

@Component({
selector: 'app-table-cell-event-action',
  templateUrl: './table-cell-event-action.component.html',
  styleUrls: ['./table-cell-event-action.component.scss'],
  standalone: false
})
export class TableCellEventActionComponent extends TableCellCustom<APIResource> { }

import { Component } from '@angular/core';

import { TableCellCustom } from '../../../../../../../../core/src/shared/components/list/list.types';
import { IFeatureFlag } from '../../../../../../cf-api.types';

@Component({
selector: 'app-table-cell-feature-flag-state',
  templateUrl: './table-cell-feature-flag-state.component.html',
  styleUrls: ['./table-cell-feature-flag-state.component.scss'],
  standalone: false
})
export class TableCellFeatureFlagStateComponent extends TableCellCustom<IFeatureFlag> { }

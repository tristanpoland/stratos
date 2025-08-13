import { Component, Input } from '@angular/core';
import { EndpointModel, getFullEndpointApiUrl, stratosEntityCatalog } from '@stratosui/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { TableCellCustom } from '../../../list.types';
import { RowWithEndpointId } from '../table-cell-endpoint-name/table-cell-endpoint-name.component';

@Component({
selector: 'app-table-cell-endpoint-address',
  templateUrl: './table-cell-endpoint-address.component.html',
  styleUrls: ['./table-cell-endpoint-address.component.scss'],
  standalone: false
})
export class TableCellEndpointAddressComponent extends TableCellCustom<EndpointModel | RowWithEndpointId>  {
  public endpointAddress$: Observable<any>;

  @Input('row')
  set row(row: EndpointModel | RowWithEndpointId) {
    super.row = row;
    /* tslint:disable-next-line:no-string-literal */
    const id = row['endpointId'] || row['guid'];
    this.endpointAddress$ = stratosEntityCatalog.endpoint.store.getEntityService(id).waitForEntity$.pipe(
      map(data => data.entity),
      map((data: any) => getFullEndpointApiUrl(data))
    );
  }
}

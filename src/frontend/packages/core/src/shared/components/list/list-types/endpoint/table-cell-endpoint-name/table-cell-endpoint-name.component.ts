import { Component, Input } from '@angular/core';
import { entityCatalog, EndpointModel, stratosEntityCatalog } from '@stratosui/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { EndpointsService } from '../../../../../../core/endpoints.service';
import { TableCellCustom } from '../../../list.types';

export interface RowWithEndpointId {
  endpointId: string;
}

@Component({
selector: 'app-table-cell-endpoint-name',
  templateUrl: './table-cell-endpoint-name.component.html',
  styleUrls: ['./table-cell-endpoint-name.component.scss'],
  standalone: false
})
export class TableCellEndpointNameComponent extends TableCellCustom<EndpointModel | RowWithEndpointId>  {

  public endpoint$: Observable<any>;

  @Input('row')
  set row(row: EndpointModel | RowWithEndpointId) {
    super.row = row;
    /* tslint:disable-next-line:no-string-literal */
    const id = row['endpointId'] || row['guid'];
    this.endpoint$ = stratosEntityCatalog.endpoint.store.getEntityMonitor(id).entity$.pipe(
      filter(data => !!data),
      map(data => {
        const ep = entityCatalog.getEndpoint(data.cnsi_type, data.sub_type).definition;
        return {
          ...data,
          canShowLink: data.connectionStatus === 'connected' || ep.unConnectable,
          link: EndpointsService.getLinkForEndpoint(data)
        };
      })
    );
  }
}

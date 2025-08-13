import {
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { entityCatalog, EndpointModel } from '@stratosui/store';

import { TableCellCustom } from '../../../list.types';
import { EndpointListDetailsComponent, EndpointListHelper } from '../endpoint-list.helpers';

@Component({
selector: 'app-table-cell-endpoint-details',
  templateUrl: './table-cell-endpoint-details.component.html',
  styleUrls: ['./table-cell-endpoint-details.component.scss'],
  standalone: false
})
export class TableCellEndpointDetailsComponent extends TableCellCustom<EndpointModel> implements OnDestroy {

  private componentRef: ComponentRef<EndpointListDetailsComponent>;
  @Input() component: Type<EndpointListDetailsComponent>;

  private endpointDetails: ViewContainerRef;
  @ViewChild('target', { read: ViewContainerRef, static: true }) set target(content: ViewContainerRef) {
    this.endpointDetails = content;
  }

  cell: EndpointListDetailsComponent;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private endpointListHelper: EndpointListHelper,

  ) {
    super();
  }

  @Input('row')
  set row(row: EndpointModel) {
    super.row = row;
    const e = entityCatalog.getEndpoint(row.cnsi_type, row.sub_type).definition;
    if (!e || !e.listDetailsComponent) {
      return;
    }
    if (!this.cell) {
      const res =
        this.endpointListHelper.createEndpointDetails(e.listDetailsComponent, this.endpointDetails, this.componentFactoryResolver);
      this.componentRef = res.componentRef;
      this.cell = res.component;
    }

    if (this.cell) {
      this.cell.row = this.row;
      this.cell.isTable = true;
    }
  }
  get row(): EndpointModel {
    return super.row;
  }

  ngOnDestroy(): void {
    this.endpointListHelper.destroyEndpointDetails({
      componentRef: this.componentRef,
      component: this.cell,
      endpointDetails: this.endpointDetails
    });
  }
}

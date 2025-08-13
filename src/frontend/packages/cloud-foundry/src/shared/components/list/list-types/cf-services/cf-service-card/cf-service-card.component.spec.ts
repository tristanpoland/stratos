import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {
  BooleanIndicatorComponent,
} from '../../../../../../../../core/src/shared/components/boolean-indicator/boolean-indicator.component';
import { AppChipsComponent } from '../../../../../../../../core/src/shared/components/chips/chips.component';
import { MetadataCardTestComponents } from '../../../../../../../../core/test-framework/core-test.helper';
import { EntityMonitorFactory } from '../../../../../../../../store/src/monitors/entity-monitor.factory.service';
import {
  generateCfBaseTestModulesNoShared,
} from '../../../../../../../test-framework/cloud-foundry-endpoint-service.helper';
import { CfOrgSpaceLinksComponent } from '../../../../cf-org-space-links/cf-org-space-links.component';
import { ServiceIconComponent } from '../../../../service-icon/service-icon.component';
import { TableCellServiceActiveComponent } from '../table-cell-service-active/table-cell-service-active.component';
import { TableCellServiceBindableComponent } from '../table-cell-service-bindable/table-cell-service-bindable.component';
import {
  TableCellServiceCfBreadcrumbsComponent,
} from '../table-cell-service-cf-breadcrumbs/table-cell-service-cf-breadcrumbs.component';
import {
  TableCellServiceReferencesComponent,
} from '../table-cell-service-references/table-cell-service-references.component';
import { TableCellServiceTagsComponent } from '../table-cell-service-tags/table-cell-service-tags.component';
import { CfServiceCardComponent } from './cf-service-card.component';

describe('CfServiceCardComponent', () => {
  let component: CfServiceCardComponent;
  let fixture: ComponentFixture<CfServiceCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CfServiceCardComponent,
        CfOrgSpaceLinksComponent,
        MetadataCardTestComponents,
        BooleanIndicatorComponent,
        AppChipsComponent,
        ServiceIconComponent,
        TableCellServiceActiveComponent,
        TableCellServiceBindableComponent,
        TableCellServiceReferencesComponent,
        TableCellServiceCfBreadcrumbsComponent,
        TableCellServiceTagsComponent
      ],
      imports: generateCfBaseTestModulesNoShared(),
      providers: [
        EntityMonitorFactory
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CfServiceCardComponent);
    component = fixture.componentInstance;
    component.row = {
      entity: {
        label: '',
        description: '',
        active: 1,
        bindable: 1,
        unique_id: '',
        extra: '',
        tags: [''],
        requires: [''],
        service_broker_guid: 'service_broker_guid',
        plan_updateable: 1,
        service_plans_url: '',
        service_plans: [],
      },
      metadata: null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('active field should be true/YES', () => {
    const activeStatus = fixture.nativeElement.querySelector('app-table-cell-service-active').textContent;

    expect(activeStatus).toContain('Yes');
  });

  it('active field should be false/NO', () => {
    component.serviceEntity.entity.active = 0;
    fixture.detectChanges();

    const activeStatus = fixture.nativeElement.querySelector('app-table-cell-service-active').textContent;

    expect(activeStatus).toContain('No');
  });

  it('bindable field should be true/YES', () => {
    const bindableStatus = fixture.nativeElement.querySelector('app-table-cell-service-bindable').textContent;

    expect(bindableStatus).toContain('Yes');
  });

  it('bindable field should be false/NO', () => {
    component.serviceEntity.entity.bindable = 0;
    fixture.detectChanges();

    const bindableStatus = fixture.nativeElement.querySelector('app-table-cell-service-bindable').textContent;

    expect(bindableStatus).toContain('No');
  });
});

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest as observableCombineLatest, Observable, of } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';

import {
  CurrentUserPermissionsService,
} from '../../../../../../../../core/src/core/permissions/current-user-permissions.service';
import { AppChip } from '../../../../../../../../core/src/shared/components/chips/chips.component';
import { CardCell, IListRowCell } from '../../../../../../../../core/src/shared/components/list/list.types';
import { APIResource, EntityInfo } from '../../../../../../../../store/src/types/api.types';
import { MenuItem } from '../../../../../../../../store/src/types/menu-item.types';
import { ComponentEntityMonitorConfig } from '../../../../../../../../store/src/types/shared.types';
import {
  IService,
  IServiceBinding,
  IServiceInstance,
  IUserProvidedServiceInstance,
} from '../../../../../../cf-api-svc.types';
import { cfEntityCatalog } from '../../../../../../cf-entity-catalog';
import { cfEntityFactory } from '../../../../../../cf-entity-factory';
import { serviceBindingEntityType } from '../../../../../../cf-entity-types';
import { ApplicationService } from '../../../../../../features/applications/application.service';
import { isUserProvidedServiceInstance } from '../../../../../../features/cf/cf.helpers';
import {
  getServiceName,
  getServicePlanName,
  getServiceSummaryUrl,
} from '../../../../../../features/service-catalog/services-helper';
import { AppEnvVarsState } from '../../../../../../store/types/app-metadata.types';
import { CfCurrentUserPermissions } from '../../../../../../user-permissions/cf-user-permissions-checkers';
import { ServiceActionHelperService } from '../../../../../data-services/service-action-helper.service';
import { CSI_CANCEL_URL } from '../../../../add-service-instance/csi-mode.service';
import { EnvVarViewComponent } from '../../../../env-var-view/env-var-view.component';
import {
  TableCellServiceBrokerComponentConfig,
  TableCellServiceBrokerComponentMode,
} from '../../cf-services/table-cell-service-broker/table-cell-service-broker.component';


interface EnvVarData {
  key: string;
  value: string;
}
@Component({
selector: 'app-app-service-binding-card',
  templateUrl: './app-service-binding-card.component.html',
  styleUrls: ['./app-service-binding-card.component.scss'],
  standalone: false
})
export class AppServiceBindingCardComponent extends CardCell<APIResource<IServiceBinding>> implements OnInit, IListRowCell {

  envVarsAvailable$: Observable<EnvVarData>;
  listData: {
    label: string;
    data$: Observable<string>;
    customStyle?: string;
  }[];
  cardMenu: MenuItem[];
  service$: Observable<APIResource<IService> | null>;
  serviceInstance$: Observable<EntityInfo<APIResource<IServiceInstance | IUserProvidedServiceInstance>>>;
  tags$: Observable<AppChip<IServiceInstance | IUserProvidedServiceInstance>[]>;
  entityConfig: ComponentEntityMonitorConfig;
  private envVarServicesSection$: Observable<string>;
  isUserProvidedServiceInstance: boolean;
  serviceDescription$: Observable<string>;
  serviceUrl$: Observable<string>;
  serviceName$: Observable<string>;

  brokerNameConfig: TableCellServiceBrokerComponentConfig = {
    mode: TableCellServiceBrokerComponentMode.NAME
  };
  brokerScopeConfig: TableCellServiceBrokerComponentConfig = {
    mode: TableCellServiceBrokerComponentMode.SCOPE,
  };

  constructor(
    private dialog: MatDialog,
    private appService: ApplicationService,
    private serviceActionHelperService: ServiceActionHelperService,
    private currentUserPermissionsService: CurrentUserPermissionsService,
  ) {
    super();
    this.cardMenu = [
      {
        label: 'Edit',
        action: this.edit,
        can: this.appService.waitForAppEntity$.pipe(
          switchMap(app => this.currentUserPermissionsService.can(
            CfCurrentUserPermissions.SERVICE_BINDING_EDIT,
            this.appService.cfGuid,
            app.entity.entity.space_guid
          )))
      },
      {
        label: 'Unbind',
        action: this.detach,
        can: this.appService.waitForAppEntity$.pipe(
          switchMap(app => this.currentUserPermissionsService.can(
            CfCurrentUserPermissions.SERVICE_BINDING_EDIT,
            this.appService.cfGuid,
            app.entity.entity.space_guid
          )))
      }];
  }

  ngOnInit() {
    this.entityConfig = new ComponentEntityMonitorConfig(this.row.metadata.guid, cfEntityFactory(serviceBindingEntityType));

    this.isUserProvidedServiceInstance = !!isUserProvidedServiceInstance(this.row.entity.service_instance.entity);
    if (this.isUserProvidedServiceInstance) {
      this.setupAsUserProvidedServiceInstance();
    } else {
      this.setupAsServiceInstance();
    }

    this.tags$ = this.serviceInstance$.pipe(
      filter(o => !!o.entity.entity.tags),
      map(o => o.entity.entity.tags.map(t => ({ value: t })))
    );

    this.setupEnvVars();
  }

  private setupAsServiceInstance() {
    const serviceInstance$ = cfEntityCatalog.serviceInstance.store.getEntityService(
      this.row.entity.service_instance_guid, this.appService.cfGuid
    ).waitForEntity$;
    this.serviceInstance$ = serviceInstance$;
    this.service$ = serviceInstance$.pipe(
      switchMap(o => cfEntityCatalog.service.store.getEntityService(o.entity.entity.service_guid, this.appService.cfGuid, {})
        .waitForEntity$),
      filter(service => !!service),
      map(e => e.entity)
    );
    this.listData = [{
      label: 'Service Plan',
      data$: this.serviceInstance$.pipe(
        map(si => {
          if (this.isUserProvidedServiceInstance) {
            return null;
          }
          const serviceInstance: IServiceInstance = si.entity.entity as IServiceInstance;
          return getServicePlanName(serviceInstance.service_plan.entity);
        })
      )
    }];
    this.envVarServicesSection$ = this.service$.pipe(map(s => s.entity.label));

    this.serviceDescription$ = this.service$.pipe(
      map(service => service.entity.description)
    );

    this.serviceUrl$ = this.service$.pipe(
      map(service => getServiceSummaryUrl(service.entity.cfGuid, service.metadata.guid))
    );

    this.serviceName$ = this.service$.pipe(
      map(service => getServiceName(service))
    );

  }

  private setupAsUserProvidedServiceInstance() {
    const userProvidedServiceInstance$ = cfEntityCatalog.userProvidedService.store.getEntityService(
      this.row.entity.service_instance_guid, this.appService.cfGuid
    ).waitForEntity$;
    this.serviceInstance$ = userProvidedServiceInstance$;
    this.service$ = of(null);
    this.listData = [{
      label: 'Route Service URL',
      data$: userProvidedServiceInstance$.pipe(
        map(service => service.entity.entity.route_service_url)
      )
    }, {
      label: 'Syslog Drain URL',
      data$: userProvidedServiceInstance$.pipe(
        map(service => service.entity.entity.syslog_drain_url)
      )
    }];
    this.envVarServicesSection$ = of('user-provided');
  }

  private setupEnvVars() {
    this.envVarsAvailable$ = observableCombineLatest(
      this.envVarServicesSection$,
      this.serviceInstance$,
      this.appService.appEnvVars.entities$)
      .pipe(
        first(),
        map(([serviceLabel, serviceInstance, allEnvVars]) => {
          const systemEnvJson = (allEnvVars as APIResource<AppEnvVarsState>[])[0].entity.system_env_json;
          const serviceInstanceName = serviceInstance.entity.entity.name;

          return systemEnvJson.VCAP_SERVICES[serviceLabel] ? {
            key: serviceInstanceName,
            value: systemEnvJson.VCAP_SERVICES[serviceLabel].find(s => s.name === serviceInstanceName)
          } : null;
        }),
        filter(p => !!p),
      );
  }

  showEnvVars = (envVarData: EnvVarData) => {
    this.dialog.open(EnvVarViewComponent, {
      data: envVarData,
      disableClose: false
    });
  };

  private detach = () => {
    this.serviceActionHelperService.detachServiceBinding(
      [this.row],
      this.row.entity.service_instance_guid,
      this.appService.cfGuid,
      false,
      this.isUserProvidedServiceInstance
    );
  };

  private edit = () => this.serviceActionHelperService.startEditServiceBindingStepper(
    this.row.entity.service_instance_guid,
    this.appService.cfGuid,
    {
      appId: this.appService.appGuid,
      [CSI_CANCEL_URL]: `/applications/${this.appService.cfGuid}/${this.appService.appGuid}/services`
    },
    this.isUserProvidedServiceInstance
  );
}

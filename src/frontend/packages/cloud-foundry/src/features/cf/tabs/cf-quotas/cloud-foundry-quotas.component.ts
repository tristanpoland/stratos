import { Component } from '@angular/core';
import { Observable } from 'rxjs';

import { CurrentUserPermissionsService } from '../../../../../../core/src/core/permissions/current-user-permissions.service';
import { ListConfig } from '../../../../../../core/src/shared/components/list/list.component.types';
import {
  CfQuotasListConfigService,
} from '../../../../shared/components/list/list-types/cf-quotas/cf-quotas-list-config.service';
import { CfCurrentUserPermissions } from '../../../../user-permissions/cf-user-permissions-checkers';
import { CloudFoundryEndpointService } from '../../services/cloud-foundry-endpoint.service';

@Component({
selector: 'app-cloud-foundry-quotas',
  templateUrl: './cloud-foundry-quotas.component.html',
  styleUrls: ['./cloud-foundry-quotas.component.scss'],
  providers: [
    {
      provide: ListConfig,
      useClass: CfQuotasListConfigService
    }
  ],
  standalone: false
})
export class CloudFoundryQuotasComponent {
  public canAddQuota$: Observable<boolean>;

  constructor(
    public cfEndpointService: CloudFoundryEndpointService,
    currentUserPermissionsService: CurrentUserPermissionsService
  ) {
    this.canAddQuota$ = currentUserPermissionsService.can(CfCurrentUserPermissions.QUOTA_CREATE, this.cfEndpointService.cfGuid);
  }
}

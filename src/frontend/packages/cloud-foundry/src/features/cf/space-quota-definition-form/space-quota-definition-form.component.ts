import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { safeUnsubscribe } from '../../../../../core/src/core/utils.service';
import { endpointEntityType } from '../../../../../store/src/helpers/stratos-entity-factory';
import { IQuotaDefinition } from '../../../cf-api.types';
import { cfEntityCatalog } from '../../../cf-entity-catalog';
import { createEntityRelationPaginationKey } from '../../../entity-relations/entity-relations.types';
import { ActiveRouteCfOrgSpace } from '../cf-page.types';
import { getActiveRouteCfOrgSpaceProvider } from '../cf.helpers';


@Component({
selector: 'app-space-quota-definition-form',
  templateUrl: './space-quota-definition-form.component.html',
  styleUrls: ['./space-quota-definition-form.component.scss'],
  providers: [
    getActiveRouteCfOrgSpaceProvider
  ],
  standalone: false
})
export class SpaceQuotaDefinitionFormComponent implements OnInit, OnDestroy {
  quotasSubscription: Subscription;
  cfGuid: string;
  orgGuid: string;
  allQuotas: string[];
  spaceQuotaDefinitions$: Observable<string[]>;
  formGroup: UntypedFormGroup;

  @Input() quota: IQuotaDefinition;

  constructor(
    activeRouteCfOrgSpace: ActiveRouteCfOrgSpace,
    private activatedRoute: ActivatedRoute,
  ) {
    this.cfGuid = activeRouteCfOrgSpace.cfGuid;
    this.orgGuid = this.activatedRoute.snapshot.params.orgId;
  }

  ngOnInit() {
    this.setupForm();
    this.fetchQuotasDefinitions();
  }

  setupForm() {
    const quota: any = this.quota || {};

    this.formGroup = new UntypedFormGroup({
      name: new UntypedFormControl(quota.name || '', [Validators.required, this.nameTakenValidator()]),
      totalServices: new UntypedFormControl(quota.total_services),
      totalRoutes: new UntypedFormControl(quota.total_routes),
      memoryLimit: new UntypedFormControl(quota.memory_limit),
      instanceMemoryLimit: new UntypedFormControl(quota.instance_memory_limit),
      nonBasicServicesAllowed: new UntypedFormControl(quota.non_basic_services_allowed || false),
      totalReservedRoutePorts: new UntypedFormControl(quota.total_reserved_route_ports),
      appInstanceLimit: new UntypedFormControl(quota.app_instance_limit),
      totalServiceKeys: new UntypedFormControl(quota.total_service_keys),
      appTasksLimit: new UntypedFormControl(quota.app_task_limit),
    });
  }

  fetchQuotasDefinitions() {
    this.spaceQuotaDefinitions$ = cfEntityCatalog.spaceQuota.store.getAllInOrganization.getPaginationService(
      this.orgGuid,
      this.cfGuid,
      createEntityRelationPaginationKey(endpointEntityType, this.cfGuid)
    ).entities$
      .pipe(
        filter(o => !!o),
        map(o => o.map(org => org.entity.name)),
        tap((o) => this.allQuotas = o)
      );

    this.quotasSubscription = this.spaceQuotaDefinitions$.subscribe();
  }

  nameTakenValidator = (): ValidatorFn => {
    return (formField: AbstractControl): { [key: string]: any } => {
      if (!this.validateNameTaken(formField.value)) {
        return { nameTaken: { value: formField.value } };
      }

      return null;
    };
  }

  validateNameTaken = (value: string = null) => {
    if (this.quota && value === this.quota.name) {
      return true;
    }

    if (this.allQuotas) {
      return this.allQuotas.indexOf(value || this.formGroup.value.name) === -1;
    }

    return true;
  }

  valid = () => !!this.formGroup && this.formGroup.valid;

  ngOnDestroy() {
    safeUnsubscribe(this.quotasSubscription);
  }
}

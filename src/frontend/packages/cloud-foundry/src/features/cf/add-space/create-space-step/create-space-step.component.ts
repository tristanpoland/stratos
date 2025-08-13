import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map, pairwise } from 'rxjs/operators';

import { StepOnNextFunction } from '../../../../../../core/src/shared/components/stepper/step/step.component';
import { RequestInfoState } from '../../../../../../store/src/reducers/api-request-reducer/types';
import { CFAppState } from '../../../../cf-app-state';
import { cfEntityCatalog } from '../../../../cf-entity-catalog';
import { AddEditSpaceStepBase } from '../../add-edit-space-step-base';
import { ActiveRouteCfOrgSpace } from '../../cf-page.types';


@Component({
selector: 'app-create-space-step',
  templateUrl: './create-space-step.component.html',
  styleUrls: ['./create-space-step.component.scss'],
  standalone: false
})
export class CreateSpaceStepComponent extends AddEditSpaceStepBase implements OnInit, OnDestroy {

  cfUrl: string;
  createSpaceForm: UntypedFormGroup;
  quotaSubscription: Subscription;

  get spaceName(): any { return this.createSpaceForm ? this.createSpaceForm.get('spaceName') : { value: '' }; }

  get quotaDefinition(): any {
    const control = this.createSpaceForm.get('quotaDefinition');
    const nil = { value: null };

    if (this.createSpaceForm) {
      return (control.value === 0) ? nil : control;
    } else {
      return nil;
    }
  }

  constructor(
    store: Store<CFAppState>,
    activatedRoute: ActivatedRoute,
    activeRouteCfOrgSpace: ActiveRouteCfOrgSpace,
  ) {
    super(store, activatedRoute, activeRouteCfOrgSpace);
  }

  ngOnInit() {
    this.createSpaceForm = new UntypedFormGroup({
      spaceName: new UntypedFormControl('', [Validators.required as any, this.spaceNameTakenValidator()]),
      quotaDefinition: new UntypedFormControl(),
    });

    this.quotaSubscription = this.quotaDefinitions$.subscribe((quotas => {
      if (quotas.length > 0) {
        this.createSpaceForm.patchValue({
          quotaDefinition: 0
        });
      }
    }));
  }

  validateNameTaken = (spaceName: string = null) => {
    return this.allSpacesInOrg ? this.allSpacesInOrg.indexOf(spaceName || this.spaceName.value) === -1 : true;
  };

  validate = () => !!this.createSpaceForm && this.createSpaceForm.valid;

  spaceNameTakenValidator = (): ValidatorFn => {
    return (formField: AbstractControl): { [key: string]: any, } =>
      !this.validateNameTaken(formField.value) ? { spaceNameTaken: { value: formField.value } } : null;
  };

  submit: StepOnNextFunction = () => {
    const id = `${this.orgGuid}-${this.spaceName.value}`;
    return cfEntityCatalog.space.api.create<RequestInfoState>(id, this.cfGuid, {
      createSpace: {
        name: this.spaceName.value,
        organization_guid: this.orgGuid,
        space_quota_definition_guid: this.quotaDefinition.value
      },
      orgGuid: this.orgGuid
    }).pipe(
      pairwise(),
      filter(([oldS, newS]) => oldS.creating && !newS.creating),
      map(([, newS]) => newS),
      this.map('Failed to create space: ')
    );
  };

  ngOnDestroy() {
    this.quotaSubscription.unsubscribe();
    this.destroy();
  }
}

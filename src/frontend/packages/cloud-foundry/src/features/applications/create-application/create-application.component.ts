import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';

import { CFAppState } from '../../../../../cloud-foundry/src/cf-app-state';
import { applicationEntityType } from '../../../cf-entity-types';
import { CfAppsDataSource } from '../../../shared/components/list/list-types/app/cf-apps-data-source';
import { CfOrgSpaceDataService } from '../../../shared/data-services/cf-org-space-service.service';
import { selectCfPaginationState } from '../../../store/selectors/pagination.selectors';

@Component({
selector: 'app-create-application',
  templateUrl: './create-application.component.html',
  styleUrls: ['./create-application.component.scss'],
  providers: [CfOrgSpaceDataService],
  standalone: false
})
export class CreateApplicationComponent implements OnInit, OnDestroy {

  paginationStateSub: Subscription;
  constructor(private store: Store<CFAppState>, public cfOrgSpaceService: CfOrgSpaceDataService) { }

  ngOnInit() {
    // We will auto select endpoint/org/space that have been selected on the app wall.
    this.cfOrgSpaceService.enableAutoSelectors();
    // FIXME: This has been broken for a while (setting cf will clear org + space after org and space has been set)
    // With new tools (set initial/enable auto) this should be easier to fix
    const appWallPaginationState = this.store.select(selectCfPaginationState(applicationEntityType, CfAppsDataSource.paginationKey));
    this.paginationStateSub = appWallPaginationState.pipe(filter(pag => !!pag), first(), tap(pag => {
      const { cf, org, space } = pag.clientPagination.filter.items;
      if (cf) {
        this.cfOrgSpaceService.cf.select.next(cf);
      }
      if (cf && org) {
        this.cfOrgSpaceService.org.select.next(org);
      }
      if (cf && org && space) {
        this.cfOrgSpaceService.space.select.next(space);
      }
    })).subscribe();
  }
  ngOnDestroy(): void {
    this.paginationStateSub.unsubscribe();
  }

}

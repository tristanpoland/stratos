import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'frontend/packages/store/src/app-state';
import { endpointOfTypeSelector } from 'frontend/packages/store/src/selectors/endpoint.selectors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { HELM_ENDPOINT_TYPE } from '../helm-entity-factory';

@Component({
selector: 'app-monocular-tab-base',
  templateUrl: './monocular-tab-base.component.html',
  styleUrls: ['./monocular-tab-base.component.scss'],
  standalone: false
})
export class MonocularTabBaseComponent implements OnInit {

  public endpointIds$: Observable<string[]>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.endpointIds$ = this.store.select(endpointOfTypeSelector(HELM_ENDPOINT_TYPE)).pipe(
      map(endpoints => Object.keys(endpoints))
    );
  }
}

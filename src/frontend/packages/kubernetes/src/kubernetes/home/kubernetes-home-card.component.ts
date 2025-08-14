import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'frontend/packages/store/src/app-state';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { HomePageCardLayout } from '../../../../core/src/features/home/home.types';
import { HomeCardShortcut } from '../../../../store/src/entity-catalog/entity-catalog.types';
import { EndpointModel } from '../../../../store/src/public-api';
import { kubeEntityCatalog } from '../kubernetes-entity-generator';
import { KubernetesEndpointService } from '../services/kubernetes-endpoint.service';

@Component({
selector: 'app-k8s-home-card',
  templateUrl: './kubernetes-home-card.component.html',
  styleUrls: ['./kubernetes-home-card.component.scss'],
  standalone: false
})
export class KubernetesHomeCardComponent implements OnInit {

  @Input() endpoint: EndpointModel;

  pLayout: HomePageCardLayout;

  get layout(): HomePageCardLayout {
    return this.pLayout;
  }

  @Input() set layout(value: HomePageCardLayout) {
    if (value) {
      this.pLayout = value;
    }
  }

  public shortcuts: HomeCardShortcut[];

  public podCount$: Observable<number>;
  public nodeCount$: Observable<number>;
  public namespaceCount$: Observable<number>;

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    const guid = this.endpoint.guid;
    this.shortcuts = [
      {
        title: 'View Nodes',
        link: ['/kubernetes', guid, 'nodes'],
        icon: 'node',
        iconFont: 'stratos-icons'
      },
      {
        title: 'View Namespaces',
        link: ['/kubernetes', guid, 'resource', 'namespace'],
        icon: 'namespace',
        iconFont: 'stratos-icons'
      }
    ];
  }

  // Card is instructed to load its view by the container, whn it is visible
  load(): Observable<boolean> {
    const guid = this.endpoint.guid;
    const podsObs = kubeEntityCatalog.pod.store.getPaginationService(guid);
    const pods$ = podsObs.entities$;
    const nodesObs = kubeEntityCatalog.node.store.getPaginationService(guid);
    const nodes$ = nodesObs.entities$;
    const namespacesObs = kubeEntityCatalog.namespace.store.getPaginationService(guid);
    const namespaces$ = namespacesObs.entities$;

    this.podCount$ = pods$.pipe(map(entities => entities.length));
    this.nodeCount$ = nodes$.pipe(map(entities => entities.length));
    this.namespaceCount$ = namespaces$.pipe(map(entities => entities.length));

    KubernetesEndpointService.hasKubeTerminalEnabled(this.store).pipe(first()).subscribe(hasKubeTerminal => {
      if (hasKubeTerminal) {
        this.shortcuts.push(
          {
            title: 'Open Terminal',
            link: ['/kubernetes', guid, 'terminal'],
            icon: 'terminal',
            iconFont: 'stratos-icons'
          }
        );
      }
    });

    KubernetesEndpointService.kubeDashboardConfigured(this.store, guid).pipe(first()).subscribe(hasKubeDashboard => {
      if (hasKubeDashboard) {
        this.shortcuts.push(
          {
            title: 'View Dashboard',
            link: ['/kubernetes', guid, 'dashboard'],
            icon: 'dashboard'
          }
        );
      }
    });

    return combineLatest([this.podCount$, this.nodeCount$, this.namespaceCount$]).pipe(
      map(() => true)
    );
  }
}

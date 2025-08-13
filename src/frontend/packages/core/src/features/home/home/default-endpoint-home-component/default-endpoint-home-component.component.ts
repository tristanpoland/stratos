import { Component, Input, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { getFullEndpointApiUrl } from '../../../../../../store/src/endpoint-utils';
import { EndpointModel } from '../../../../../../store/src/public-api';
import { HomePageCardLayout, HomePageEndpointCard } from '../../home.types';

@Component({
selector: 'app-default-endpoint-home-component',
  templateUrl: './default-endpoint-home-component.component.html',
  styleUrls: ['./default-endpoint-home-component.component.scss'],
  standalone: false
})
export class DefaultEndpointHomeComponent implements OnInit, HomePageEndpointCard {

  url: string;

  pLayout: HomePageCardLayout;

  get layout(): HomePageCardLayout {
    return this.pLayout;
  }

  @Input() set layout(value: HomePageCardLayout) {
    if (value) {
      this.pLayout = value;
    }
  }

  @Input() endpoint: EndpointModel;

  ngOnInit(): void {
    this.url = getFullEndpointApiUrl(this.endpoint);
  }

  load(): Observable<boolean> {
    return of(true);
  }
}

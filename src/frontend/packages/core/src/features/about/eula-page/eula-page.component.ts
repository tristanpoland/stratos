import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
selector: 'app-eula-page',
  templateUrl: './eula-page.component.html',
  styleUrls: ['./eula-page.component.scss'],
  standalone: false
})
export class EulaPageComponent {

  public breadcrumbs = [
    {
      breadcrumbs: [{ value: 'About', routerLink: '/about' }]
    }
  ];

  public eulaHtml = '';

  // Load the EULA
  constructor(http: HttpClient) {
    http.get('/core/assets/eula.html', {responseType: 'text'}).subscribe(
      html => this.eulaHtml = html,
      () => this.eulaHtml = 'An error occurred retrieving the EULA'
    );
  }

}

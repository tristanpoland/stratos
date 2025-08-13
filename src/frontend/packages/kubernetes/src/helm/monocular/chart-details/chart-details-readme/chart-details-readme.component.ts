import { Component, Input } from '@angular/core';
import { marked } from 'marked';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ChartVersion } from '../../shared/models/chart-version';
import { ChartsService } from '../../shared/services/charts.service';

@Component({
selector: 'app-chart-details-readme',
  templateUrl: './chart-details-readme.component.html',
  styleUrls: ['./chart-details-readme.component.scss'],
  standalone: false
})
export class ChartDetailsReadmeComponent {

  @Input() set currentVersion(currentVersion: ChartVersion) {
    if (currentVersion) {
      this.readmeContent$ = this.getReadme(currentVersion);
    }
  }

  public loading = false;
  public readmeContent$: Observable<string>;
  private renderer = new marked.Renderer();
  private loadingDelay: any;

  constructor(private chartsService: ChartsService) {
    this.renderer.link = ({ href, title, text }) => `<a target="_blank" title="${title}" href="${href}">${text}</a>`;
    this.renderer.code = ({ text, lang, escaped }: { text: string; lang?: string; escaped?: boolean }) => `<code>${text}</code>`;
    this.loadingDelay = setTimeout(() => this.loading = true, 100);
  }

  // TODO: See #150 - This should not require loading the specific version and then the readme
  private getReadme(currentVersion: ChartVersion): Observable<string> {
    return this.chartsService.getChartReadme(currentVersion).pipe(
      map(resp => {
        clearTimeout(this.loadingDelay);
        this.loading = false;
        const result = marked(resp, {
          renderer: this.renderer
        });
        return typeof result === 'string' ? result : '';
      }),
      catchError((error) => {
        this.loading = false;
        if (error.status === 404) {
          return observableOf('<h1>No Readme available for this chart</h1>');
        } else {
          return observableOf('<h1>An error occurred retrieving Readme</h1>');
        }
      }));
  }
}

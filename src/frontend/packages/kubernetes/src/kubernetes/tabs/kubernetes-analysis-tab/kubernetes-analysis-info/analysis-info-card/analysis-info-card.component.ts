import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { marked } from 'marked';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
selector: 'app-analysis-info-card',
  templateUrl: './analysis-info-card.component.html',
  styleUrls: ['./analysis-info-card.component.scss'],
  standalone: false
})
export class AnalysisInfoCardComponent {

  public loading = true;
  public content$: Observable<string>;
  private renderer = new marked.Renderer();
  private parser = new marked.Parser();

  public mAanalyzer = {};

  @Input() set analyzer(analyzer: any) {
    if (analyzer && analyzer.descriptionUrl) {
      this.content$ = this.getDescription(analyzer.descriptionUrl);
    }
    this.mAanalyzer = analyzer;
  }

  get analyzer() {
    return this.mAanalyzer;
  }

  constructor(private http: HttpClient) {
    this.renderer.link = ({ href, title, tokens }) => `<a target="_blank" title="${title || ''}" href="${href}">${this.parser.parseInline(tokens)}</a>`;
    this.renderer.code = ({ text }) => `<code>${text}</code>`;
  }

  private getDescription(url): Observable<any> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(resp => {
        this.loading = false;
        return marked(resp, {
          renderer: this.renderer
        });
      }),
      catchError((error) => {
        this.loading = false;
        if (error.status === 404) {
          return of('<h1>Unable to load description for this Analyzer</h1>');
        } else {
          return of('<h1>An error occurred retrieving description for this Analyzer</h1>');
        }
      }
      ));
  }

}

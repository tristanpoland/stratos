import { Component, Input, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { catchError, first } from 'rxjs/operators';

import { Chart } from '../../shared/models/chart';
import { ChartVersion } from '../../shared/models/chart-version';
import { Maintainer } from '../../shared/models/maintainer';
import { ChartsService } from '../../shared/services/charts.service';

@Component({
selector: 'app-chart-details-info',
  templateUrl: './chart-details-info.component.html',
  styleUrls: ['./chart-details-info.component.scss'],
  standalone: false
})
export class ChartDetailsInfoComponent implements OnInit {
  @Input() chart: Chart;
  versions: ChartVersion[];
  schema: any = null;

  private pCurrentVersion: ChartVersion;

  get currentVersion(): ChartVersion {
    return this.pCurrentVersion;
  }

  @Input() set currentVersion(version: ChartVersion) {
    this.pCurrentVersion = version;
    if (version) {
      this.getSchema(this.pCurrentVersion, this.chart);
    }
  }

  constructor(private chartsService: ChartsService) { }

  ngOnInit() {
    this.loadVersions(this.chart);
  }

  get sources() {
    return this.chart.attributes.sources || [];
  }

  get maintainers(): Maintainer[] {
    return this.chart.attributes.maintainers || [];
  }

  loadVersions(chart: Chart): void {
    this.chartsService
      .getVersions(chart.attributes.repo.name, chart.attributes.name)
      .subscribe(versions => {
        this.versions = versions;
      });
  }

  maintainerUrl(maintainer: Maintainer): string {
    // Use GitHub URL with maintainer name if this is an upstream Helm repo from
    // github.com/helm/charts (i.e. stable or incubator)
    if (this.isUpstreamHelmRepo(this.chart.attributes.repo.url)) {
      return `https://github.com/${maintainer.name}`;
    } else {
      return `mailto:${maintainer.email}`;
    }
  }

  private isUpstreamHelmRepo(repoURL: string): boolean {
    return (
      repoURL === 'https://kubernetes-charts.storage.googleapis.com' ||
      repoURL === 'https://kubernetes-charts-incubator.storage.googleapis.com'
    );
  }

  private getSchema(currentVersion: ChartVersion, chart: Chart) {
    this.chartsService.getChartSchema(currentVersion, chart).pipe(
      first(),
      catchError(() => of(null))
    ).subscribe(schema => {
      this.schema = schema;
    });
  }

}

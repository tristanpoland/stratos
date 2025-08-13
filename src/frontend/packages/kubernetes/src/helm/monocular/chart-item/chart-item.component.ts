import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Chart } from '../shared/models/chart';
import { ChartsService } from '../shared/services/charts.service';

@Component({
selector: 'app-chart-item',
  templateUrl: './chart-item.component.html',
  styleUrls: ['./chart-item.component.scss'],
  /* tslint:disable-next-line:no-inputs-metadata-property */
  inputs: ['chart', 'showVersion', 'showDescription', 'artifactHubAndHelmRepoTypes$'],
  standalone: false
})
export class ChartItemComponent implements OnInit {
  public iconUrl: string;
  // Chart to represent
  public chart: Chart;
  // Show version form by default
  public showVersion = true;
  // Truncate the description
  public showDescription = true;

  public artifactHubAndHelmRepoTypes$: Observable<boolean>;

  constructor(private chartsService: ChartsService) {
  }

  ngOnInit() {
    this.iconUrl = this.chartsService.getChartIconURL(this.chart);
  }

  goToDetailUrl(): string {
    return this.chartsService.getChartSummaryRoute(this.chart.attributes.repo.name, this.chart.attributes.name, null, null, this.chart);
  }

}

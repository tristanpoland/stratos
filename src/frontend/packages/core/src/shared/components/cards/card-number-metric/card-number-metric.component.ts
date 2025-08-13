import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject } from 'rxjs';

import { RouterNav } from '../../../../../../store/src/actions/router.actions';
import { AppState } from '../../../../../../store/src/app-state';
import { StratosStatus } from '../../../../../../store/src/types/shared.types';
import { UtilsService } from '../../../../core/utils.service';
import { determineCardStatus } from '../card-status/card-status.component';

enum AlertLevel {
  OK = 0,
  Info,
  Warning,
  Error,
  Unknown,
}

@Component({
selector: 'app-card-number-metric',
  templateUrl: './card-number-metric.component.html',
  styleUrls: ['./card-number-metric.component.scss'],
  standalone: false
})
export class CardNumberMetricComponent implements OnInit, OnChanges {

  @Input() icon: string;
  @Input() iconFont: string;
  @Input() label: string;
  @Input() labelSingular: string;
  @Input() limit: string;
  @Input() units: string;
  @Input() value: string;
  @Input() showUsage = false;
  @Input() textOnly = false;
  @Input() labelAtTop = false;
  @Input() link: () => void | string;
  @Output() showAlerts = new EventEmitter<any>();
  @Input() mode: string;

  @Input('alerts')
  set alerts(alerts) {
    if (alerts) {
      this.processAlerts(alerts);
    }
  }

  alertInfo: any;

  formattedValue: string;
  formattedLimit: string;
  usage: string;

  status$ = new BehaviorSubject<StratosStatus>(StratosStatus.NONE);
  isUnlimited: boolean;

  constructor(private utils: UtilsService, private store: Store<AppState>) { }

  ngOnInit() {
    this.format();
  }

  ngOnChanges() {
    this.format();
  }

  format() {
    if (this.value === '') {
      this.handleNoValue();
    } else {
      this.handleValue();
    }
  }

  handleNoValue() {
    this.formattedValue = '-';
    this.formattedLimit = undefined;
  }

  handleValue() {
    const value = parseInt(this.value, 10);
    this.isUnlimited = false;
    if (value === -1) {
      this.formattedValue = 'Unlimited';
      this.isUnlimited = true;
    } else {
      this.formattedValue = this.formatForUnits(this.value);
    }

    if (!this.limit) {
      return;
    }

    const status = determineCardStatus(parseInt(this.value, 10), parseInt(this.limit, 10));
    this.status$.next(status);

    const limit = parseInt(this.limit, 10);
    if (limit === -1) {
      this.formattedLimit = '∞';
      this.usage = '';
    } else {
      this.formattedLimit = this.formatForUnits(this.limit);
      this.usage = this.showUsage ? (100 * value / limit).toFixed(2) : '';
    }
  }

  formatForUnits(v: string): string {
    if (!this.units) {
      return v;
    }
    const n = parseInt(v, 10);
    switch (this.units) {
      default:
        return this.utils.mbToHumanSize(n);
    }
  }

  goToLink() {
    if (typeof (this.link) === 'string') {
      this.store.dispatch(new RouterNav({ path: [this.link] }));
    } else {
      this.link();
    }
  }

  processAlerts(alerts) {
    this.alertInfo = {
      info: 0,
      warning: 0,
      error: 0
    };

    alerts.forEach((alert) => {
      switch (alert.level as AlertLevel) {
        case AlertLevel.Warning:
          this.alertInfo.warning++;
          break;
        case AlertLevel.Error:
          this.alertInfo.error++;
          break;
        case AlertLevel.Info:
          this.alertInfo.info++;
          break;
      }
    });
  }

  public alertsClicked() {
    this.showAlerts.emit(this.alertInfo);
  }

}

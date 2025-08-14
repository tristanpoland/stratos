import { Component, Input } from '@angular/core';

import { TableCellCustom } from '../../../../../../core/src/shared/components/list/list.types';
import { KubernetesPodExpandedStatusTypes } from '../../../services/kubernetes-expanded-state';
import { KubernetesPod } from '../../../store/kube.types';

@Component({
selector: 'app-kubernetes-pod-status',
  templateUrl: './kubernetes-pod-status.component.html',
  styleUrls: ['./kubernetes-pod-status.component.scss'],
  standalone: false
})
export class KubernetesPodStatusComponent extends TableCellCustom<KubernetesPod> {

  public style = 'border-success';

  @Input('row')
  set row(row: KubernetesPod) {
    super.row = row;
    if (row) {
      this.updateStatus();
    }
  }
  get row(): KubernetesPod { return super.row; }

  private updateStatus() {
    const status = this.convertStatus(this.row.expandedStatus.status);
    this.style = `border-${status} text-${status}`;
  }

  private convertStatus(status: string): string {
    if (!status) {
      return 'tentative';
    }
    // Everything is fine
    if (
      status === KubernetesPodExpandedStatusTypes.RUNNING ||
      status === KubernetesPodExpandedStatusTypes.COMPLETED) {
      return 'success';
    }
    // Everything else... probably some kind of issue (still coming up or failed)
    // Includes pods with init containers in anything other than terminated with exit code = 0
    return 'warning';
  }
}

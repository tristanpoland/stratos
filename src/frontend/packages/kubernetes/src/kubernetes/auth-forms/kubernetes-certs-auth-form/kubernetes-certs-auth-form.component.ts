import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

import { EndpointAuthValues, IEndpointAuthComponent } from '../../../../../store/src/extension-types';


@Component({
selector: 'app-kubernetes-certs-auth-form',
  templateUrl: './kubernetes-certs-auth-form.component.html',
  styleUrls: ['./kubernetes-certs-auth-form.component.scss'],
  standalone: false
})
export class KubernetesCertsAuthFormComponent implements IEndpointAuthComponent {
  @Input() formGroup: UntypedFormGroup;


  public getValues(values: EndpointAuthValues): EndpointAuthValues {
    return {};
  }

  public getBody(): string {
    /** Body content is in the following encoding:
     * base64encoded:base64encoded
     */

    let certBase64 = this.formGroup.value.authValues.cert;
    let certKeyBase64 = this.formGroup.value.authValues.certKey;

    // May already be base64 encoded
    if (certBase64.indexOf('-----BEGIN') === 0) {
      certBase64 = btoa(this.formGroup.value.authValues.cert);
    }

    if (certKeyBase64.indexOf('-----BEGIN') === 0) {
      certKeyBase64 = btoa(this.formGroup.value.authValues.certKey);
    }
    return `${certBase64}:${certKeyBase64}`;
  }
}

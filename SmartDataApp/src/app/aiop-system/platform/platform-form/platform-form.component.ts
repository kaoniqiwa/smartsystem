import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Platform } from '../../../data-core/model/aiop/platform';
import { PlatformFormService, FormField } from "./business/platform-form";
import { FormStateEnum } from '../../../common/tool/table-form-helper';
import { domClick } from '../../../common/tool/jquery-help/jquery-help';
@Component({
  selector: 'platform-form',
  templateUrl: './platform-form.component.html',
  styleUrls: ['./platform-form.component.styl'],
  providers: [PlatformFormService]
})
export class PlatformFormComponent implements OnInit {

  @Input() saveFn: (success: boolean, item: Platform, formState: FormStateEnum) => void;
  @Input() cancelFn: () => void;
  @Input() editItem: Platform;
  @ViewChild('resetBtn')
  resetBtn: ElementRef;
  constructor(private formService: PlatformFormService) {

  }

  async ngOnInit() {
    await this.formService.getProtocols();
    this.formService.defaultForm(this.editItem);
  }
  onSubmit() {
    const formField = this.formService.form.value as FormField;
    formField.EventCodes = new Array();
    this.formService.eventCodesForm.map(x => {
      if (x.value.EventCode1)
        formField.EventCodes.push(x.value.EventCode1);
       if (x.value.EventCode2)
        formField.EventCodes.push(x.value.EventCode2);
       if (x.value.EventCode3)
        formField.EventCodes.push(x.value.EventCode3);
       if (x.value.EventCode4)
        formField.EventCodes.push(x.value.EventCode4);
       if (x.value.EventCode5)
        formField.EventCodes.push(x.value.EventCode5);
       if (x.value.EventCode6)
        formField.EventCodes.push(x.value.EventCode6);
       if (x.value.EventCode7)
        formField.EventCodes.push(x.value.EventCode7);
       if (x.value.EventCode8)
        formField.EventCodes.push(x.value.EventCode8);
    });
    this.formService.saveFrom(formField, (success: boolean, item: Platform, formState: FormStateEnum) => {
      if (success && this.saveFn) this.saveFn(success, item, formState);
    });
  }

  onCancel() {
    if (this.cancelFn) this.cancelFn();
    domClick(this.resetBtn.nativeElement);
  }

}

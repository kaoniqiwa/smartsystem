import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { SRServiceService, ServerAddress } from "./business/srserver-form";
import { SRServer, SRServerAddress } from "../../../data-core/model/aiop/sr-server";
import { FormStateEnum } from '../../../common/tool/table-form-helper';
import { domClick } from '../../../common/tool/jquery-help/jquery-help';
import { FormField, BaseFiled } from "./business/srserver-form";
@Component({
  selector: 'srserver-form',
  templateUrl: './srserver-form.component.html',
  styleUrls: ['./srserver-form.component.styl'],
  providers: [SRServiceService]
})
export class SRServerFormComponent implements OnInit {
  links = ['First', 'Second', 'Third'];
  activeLink = this.links[0];
  @Input() saveFn: (success: boolean, item: SRServer, formState: FormStateEnum) => void;
  @Input() cancelFn: () => void;
  @Input() editItem: SRServer;
  @ViewChild('resetBtn')
  resetBtn: ElementRef;
  constructor(private formService: SRServiceService) {

  }

  async ngOnInit() {
    this.formService.defaultForm(this.editItem);

  }
  onSubmit() {
    const formField = this.formService.baseForm.value as FormField;
    formField.Address=new Array();
    this.formService.addressForm.map(x => { 
      formField.Address.push(x.value as ServerAddress);
    }); 

    this.formService.saveFrom(formField,(success:boolean,item:SRServer,formState: FormStateEnum)=>{
         if(success&&this.saveFn)this.saveFn(success,item,formState);
    });
  }

  onCancel() {
    if (this.cancelFn) this.cancelFn();
    domClick(this.resetBtn.nativeElement);
  }
}

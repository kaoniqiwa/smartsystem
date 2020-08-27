import { Component, OnInit, Input ,ViewChild,ElementRef} from '@angular/core'; 
import { EncodeDevice } from "../../../../data-core/model/encode-device";
import {  EncodeDeviceFormService ,FormField} from "./business/encode-device-form";
import { domClick } from "../../../../common/tool/jquery-help/jquery-help";
import { FormStateEnum } from "../../../../common/tool/table-form-helper"; 
@Component({
  selector: 'encode-device-form',
  templateUrl: './encode-device-form.component.html',
  styleUrls: ['./encode-device-form.component.styl'],
  providers:[EncodeDeviceFormService]
})
export class EncodeDeviceFormComponent implements OnInit {

  @Input() saveFn:(success:boolean,item:EncodeDevice,formState:FormStateEnum)=>void;
  @Input() cancelFn:()=>void;
  @Input() editItem:EncodeDevice;
  @ViewChild('resetBtn')
  resetBtn:ElementRef;
  constructor(private formService:EncodeDeviceFormService) { 

  }

  ngOnInit() {
    this.formService.defaultForm(this.editItem);
    this.formService.requestResourceLabels();
  }
  onSubmit() {
    const formField = this.formService.form.value as FormField;
    this.formService.saveFrom(formField,(success:boolean,item:EncodeDevice,formState: FormStateEnum)=>{
         if(success&&this.saveFn)this.saveFn(success,item,formState);
    });
  }

  onCancel(){
    if(this.cancelFn)this.cancelFn(); 
    domClick(this.resetBtn.nativeElement); 
  }
}

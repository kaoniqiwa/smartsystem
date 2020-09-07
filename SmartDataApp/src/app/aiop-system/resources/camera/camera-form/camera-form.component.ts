import { Component, OnInit, Input ,ViewChild,ElementRef} from '@angular/core'; 
import { Camera } from "../../../../data-core/model/aiop/camera";
import {  CameraFormService ,FormField} from "./business/camera-form";
import { domClick } from "../../../../common/tool/jquery-help/jquery-help";
import { FormStateEnum } from "../../../../common/tool/table-form-helper"; 
@Component({
  selector: 'camera-form',
  templateUrl: './camera-form.component.html',
  styleUrls: ['./camera-form.component.styl'],
  providers:[CameraFormService]
})
export class CameraFormComponent implements OnInit {

  @Input() saveFn:(success:boolean,item:Camera,formState:FormStateEnum)=>void;
  @Input() cancelFn:()=>void;
  @Input() editItem:Camera;
  @Input() regionId ='';
  @ViewChild('resetBtn')
  resetBtn:ElementRef;
  constructor(private formService:CameraFormService) { 

  }

  ngOnInit() {
    this.formService.defaultForm(this.editItem);  
    this.formService.requestResourceLabels()
  }
  onSubmit() {
    const formField = this.formService.form.value as FormField;
    this.formService.saveFrom(formField,(success:boolean,item:Camera,formState: FormStateEnum)=>{
         if(success&&this.saveFn)this.saveFn(success,item,formState);
    },this.regionId);
  }

  onCancel(){
    if(this.cancelFn)this.cancelFn(); 
    domClick(this.resetBtn.nativeElement); 
  }

}

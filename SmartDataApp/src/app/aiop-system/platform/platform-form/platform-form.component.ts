import { Component, OnInit ,Input,ViewChild, ElementRef} from '@angular/core';
import { Platform } from '../../../data-core/model/platform';
import {  PlatformFormService,FormField} from "./business/platform-form";
import { FormStateEnum } from '../../../common/tool/table-form-helper';
import { domClick } from '../../../common/tool/jquery-help/jquery-help';
@Component({
  selector: 'platform-form',
  templateUrl: './platform-form.component.html',
  styleUrls: ['./platform-form.component.styl'],
  providers:[PlatformFormService]
})
export class PlatformFormComponent implements OnInit {

  @Input() saveFn:(success:boolean,item:Platform,formState:FormStateEnum)=>void;
  @Input() cancelFn:()=>void;
  @Input() editItem:Platform;
  @ViewChild('resetBtn')
  resetBtn:ElementRef;
  constructor(private formService:PlatformFormService) { 

  }

 async ngOnInit() {
   await this.formService.getProtocols(); 
    this.formService.defaultForm(this.editItem);
  }
  onSubmit() {
    const formField = this.formService.form.value as FormField;
    this.formService.saveFrom(formField,(success:boolean,item:Platform,formState: FormStateEnum)=>{
         if(success&&this.saveFn)this.saveFn(success,item,formState);
    });
  }

  onCancel(){
    if(this.cancelFn)this.cancelFn(); 
    domClick(this.resetBtn.nativeElement); 
  }

}

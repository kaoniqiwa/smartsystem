import { Component, OnInit, ViewChild, Input, ElementRef,OnChanges } from '@angular/core';
import { RegionFormService } from "./business/region-form";
import { Region } from '../../../data-core/model/aiop/region'; 
import { FormStateEnum } from "../../../common/tool/table-form-helper"; 
import {    FormField} from "./business/region-form"; 
@Component({
  selector: 'region-form',
  templateUrl: './region-form.component.html',
  styleUrls: ['./region-form.component.styl'],
  providers:[RegionFormService]
})
export class RegionFormComponent implements OnInit,OnChanges {
 
  @Input() parentId ='';
  @Input() saveFn:(success:boolean,item:Region,formState:FormStateEnum)=>void;
  @Input() cancelFn:()=>void;
  @Input() editItem:Region;
  @Input() title:string = '';
  @ViewChild('resetBtn')
  resetBtn:ElementRef;
  constructor(private formService:RegionFormService) { 
    
  }
ngOnChanges(){ 
  this.formService.defaultForm(this.editItem); 
  if(this.editItem==null)this.formService.resetForm();
}
  ngOnInit() {
    this.formService.defaultForm(this.editItem); 
  }
  onSubmit() {
    const formField = this.formService.form.value as FormField;
   if(this.parentId)
    formField.ParentId = this.parentId; 
    
    this.formService.saveFrom(formField,(success:boolean,item:Region,formState: FormStateEnum)=>{
         if(success&&this.saveFn)this.saveFn(success,item,formState);
     
    });
  }

  onCancel(){
    if(this.cancelFn)this.cancelFn(); 
    this.formService.resetForm();
  }
}

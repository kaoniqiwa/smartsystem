import { Component, OnInit,ViewChild,ElementRef,Input } from '@angular/core';
import { AIModelFormService,FormField } from "./business/aimodel-form";
import { domClick, inputFileRead,downloadFile } from '../../../common/tool/jquery-help/jquery-help';
import {Base64 } from "../../../common/tool/base64";
 import { CameraAIModel } from "../.././../data-core/model/aiop/camera-ai-model";
import { FormStateEnum } from '../../../common/tool/table-form-helper';
import { CustomTreeComponent } from "../../../shared-module/custom-tree/custom-tree.component";
@Component({
  selector: 'aimodel-form',
  templateUrl: './aimodel-form.component.html',
  styleUrls: ['./aimodel-form.component.styl'],
  providers: [AIModelFormService]
})
export class AIModelFormComponent implements OnInit {
  @Input() saveFn:(success:boolean,item:CameraAIModel,formState:FormStateEnum)=>void;
  @Input() cancelFn:()=>void;
  @Input() editItem:CameraAIModel;
  @ViewChild('resetBtn')
  resetBtn:ElementRef;
  @ViewChild('tree')
  tree:CustomTreeComponent;

  constructor(private formService: AIModelFormService) { }

 async ngOnInit() {
    await this.formService.modelIconsData();
    this.formService.defaultForm(this.editItem); 
    this.tree.dataSource.data = this.formService.dtoDataSource;   
    this.tree.   treeControl.expandAll();
  }

  selectFileClick() {
    domClick('#fileInput');
  }

  changeFile(event: any) {
    this.formService.form.patchValue({
      FileModelName: event.target.value
    });

    inputFileRead('#fileInput', (result) => {     
      this.formService.form.patchValue({
        ModelJSON: result.replace('data:application/json;base64,', '')
      });       
    });
  }

  parseFileClick(){
    const formField = this.formService.form.value as FormField;
    this.formService.parseJsonModel(formField.ModelJSON,()=>{
      this.tree.dataSource.data = this.formService.dtoDataSource;   
      this.tree.   treeControl.expandAll();
    });
  }

  onSubmit() {
    const formField = this.formService.form.value as FormField;
    this.formService.saveFrom(formField,(success:boolean,item:CameraAIModel,formState: FormStateEnum)=>{
        if(success&&this.saveFn)this.saveFn(success,item,formState);
    });
  }

  downLoadModel(){
    const formField = this.formService.form.value as FormField
    ,base64=new Base64(),modelJson = base64.decode(formField.ModelJSON);
    downloadFile(formField.ModelName,modelJson);
  }

  onCancel(){
    if(this.cancelFn)this.cancelFn(); 
    domClick(this.resetBtn.nativeElement); 
  }
}

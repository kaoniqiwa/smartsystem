import { Component, OnInit,ViewChild,ElementRef,Input } from '@angular/core';
import { AIModelFormService,FormField } from "./business/aimodel-form";
import { domClick, inputFileRead } from '../../../common/tool/jquery-help/jquery-help';
 import { CameraAIModel } from "../.././../data-core/model/camera-ai-model";
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

  onSubmit() {
    const formField = this.formService.form.value as FormField;
    this.formService.saveFrom(formField,(success:boolean,item:CameraAIModel,formState: FormStateEnum)=>{
        if(success&&this.saveFn)this.saveFn(success,item,formState);
    });
  }

  onCancel(){
    if(this.cancelFn)this.cancelFn(); 
    domClick(this.resetBtn.nativeElement); 
  }
}

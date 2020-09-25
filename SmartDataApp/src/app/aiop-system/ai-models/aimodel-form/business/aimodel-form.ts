import { Injectable } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MessageBar } from "../../../../common/tool/message-bar";
import { FormStateEnum } from "../../../../common/tool/table-form-helper";
import { CameraAIModel, CameraAIModelDTOLabel } from "../../../../data-core/model/aiop/camera-ai-model";
import { AIModelRequestService } from "../../../../data-core/repuest/ai-model.service";
import { ConfigRequestService } from "../../../../data-core/repuest/config.service";
import { PicturesDropList } from "../../../../shared-module/pictures-drop-list/pictures-drop-list";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { TreeListMode, TreeNode, InputTreeNode, FlatNode } from "../../../../shared-module/custom-tree/custom-tree";
@Injectable()
export class AIModelFormService extends ListAttribute {
    form: FormGroup;
    editItem: CameraAIModel;
    messageBar = new MessageBar();
    formState: FormStateEnum;
    treeListMode = TreeListMode.rightInput;
    modelIcons = new Array<PicturesDropList>();
    dtoDataSource = new Array<InputTreeNode>();
    parseItem:CameraAIModel;
    changeModelLabelFn = (item: FlatNode, inputVal?: string) => {
        const change = (items: CameraAIModelDTOLabel[], id_index: string[]) => { 
            items.map(x => {
                if (x.LabelId == id_index[0]) {
                    if (id_index.length == 2)
                        x.EnumValues[id_index[1]].ModelValue = inputVal;

                    else if (id_index.length == 1)
                        x.LabelModelValue = inputVal;

                }
            });
        }
        if (inputVal && item) {
            const id_index = item.id.split('_EnumValues_');
           if(this.editItem) this.editItem.ModelDTO.Labels.map(m1 => {
                if (m1.LabelId == id_index[0])
                    m1.LabelModelValue = inputVal;
                change(m1.Labels, id_index);
            });
            else  if(this.parseItem)this.parseItem.ModelDTO.Labels.map(m1 => {
                if (m1.LabelId == id_index[0])
                    m1.LabelModelValue = inputVal;
                change(m1.Labels, id_index);
            });

        }

    }
    constructor(private requestService: AIModelRequestService
        , private configService: ConfigRequestService) {

        super();
        this.form = new FormGroup({
            Label: new FormControl('1'),
            FileModelName: new FormControl(''),
            ModelName: new FormControl(''),
            Version:new FormControl(''),
            TransformType:new FormControl(''),
            ModelJSON: new FormControl(''),
            ModelType: new FormControl('AIOP')
        });
    }
    checkForm(item: FormField) {
        if (item.ModelName == '') {
            this.messageBar.response_warning('名称不能为空');
            return false;
        }
        else if (item.ModelJSON == ''&&this.editItem==null) {
            this.messageBar.response_warning('请上传模型文件');
            return false;
        }
        else if (this.modelIcons.find(x => x.checked) == null) {
            this.messageBar.response_warning('请选择模型图标');
            return false;
        }
        return true;
    }

    async parseJsonModel(base64JSONData: string,callBack:()=>void) {
        if (base64JSONData) {
            const response = await this.requestService.parse(base64JSONData).toPromise();
            if(response&&response.Data){
                this.form.patchValue({
                    Version:response.Data.Version,
                    TransformType:response.Data.TransformType,
                });
                this.parseItem = response.Data;
                this.loadAIModelDTOTree(this.parseItem);
                callBack();
            }
        }
    }

    loadAIModelDTOTree(item: CameraAIModel) {
    
        const addItems = (node: TreeNode, items: CameraAIModelDTOLabel[]) => {
            if(items)
            for (const i of items) {
                const node_ = new InputTreeNode();
                node_.name = i.LabelName;
                node_.checked = false;
                node_.id = i.LabelId;
                node_.label = i.LabelValue;
                node_.inputVal = i.LabelModelValue;
                node_.children = new Array<InputTreeNode>();
                node.children = node.children || new Array<InputTreeNode>();
                node.children.push(node_);
                if (i.EnumValues) {
                    for (let x = 0; x < i.EnumValues.length; x++) {
                        const val = i.EnumValues[x];
                        const _ = new InputTreeNode();
                        _.id = i.LabelId + '_EnumValues_' + x;
                        _.name = val.Description;
                        _.iconClass='howell-icon-file';
                        _.checked = false;
                        _.label = val.Value + '';
                        _.inputVal = val.ModelValue + '';

                        node_.children.push(_);
                    }
                }
                addItems(node_, i.Labels);
            }
        }
        if (item.ModelDTO && item.ModelDTO.Labels) {
            for (const i of item.ModelDTO.Labels) {
                const node = new InputTreeNode();
                node.name = i.LabelName;
                node.checked = false;
                node.id = i.LabelId;
                node.label = i.LabelValue;
                node.iconClass='howell-icon-folder';
                node.inputVal = i.LabelModelValue;
                this.dtoDataSource.push(node);
                addItems(node, i.Labels);
            }
        }


    }

    async modelIconsData() {
        const response = await this.configService.getAIIcons().toPromise(); 

        if (response) {
            for (const key in response) {
                this.modelIcons.push(new PicturesDropList(key, this.imgUrlRoot+this.aiModelIcon + response[key]));
            }
        }
    }

    set modelIcon(index:number){
        if (this.modelIcons.length)
        this.modelIcons[index].checked = true;
    }

    defaultForm(editItem: CameraAIModel) {

        if (editItem) {
            this.editItem = editItem;
            this.form.patchValue({
                Label: editItem.Label,
                ModelName: editItem.ModelName,
                ModelJSON: editItem.ModelJSON,
                Version:editItem.Version,
                TransformType:editItem.TransformType,
            });
            this.formState = FormStateEnum.edit;
            this.loadAIModelDTOTree(editItem);
            this.modelIcon=editItem.Label;
        }
        else {            
            this.modelIcon=0;
            this.formState = FormStateEnum.create;
        }
    }

    async saveFrom(item: FormField, successFn: (success: boolean, item: CameraAIModel, formState: FormStateEnum) => void) {
        const check = this.checkForm(item),save=async (model:CameraAIModel)=>{ 
        
            const response = await this.requestService.create(model).toPromise();
            if (response.FaultCode ==0) {
                this.messageBar.response_success();
                successFn(true, response.Data, this.formState);
            }
        };
        var model: CameraAIModel;
        model = (this.editItem && this.formState == FormStateEnum.edit) ? this.editItem : new CameraAIModel();
        if (check) {
           model.ModelName = item.ModelName;
           model.ModelJSON = item.ModelJSON;
           model.Label = Number.parseInt(this.modelIcons.find(x => x.checked).id);
           model.UpdateTime = new Date().toISOString();
            if (this.formState == FormStateEnum.create) {
                model.Id = '';
                model.CreateTime = new Date().toISOString();
                if(this.parseItem){
                    this.parseItem.ModelName = item.ModelName;
                    this.parseItem.Label = Number.parseInt(this.modelIcons.find(x => x.checked).id); 
                    save(this.parseItem);
                }
                else{
                    save(model);
                }
              
            }
            else if (this.formState == FormStateEnum.edit) {
                //后台要求
                model.ModelJSON='';
                const response = await this.requestService.set(model).toPromise();
                if (response.FaultCode ==0) {
                    this.messageBar.response_success();
                    successFn(true, response.Data, this.formState);
                }
            }
        }
    }

}

export interface FormField {
    Label: number,
    ModelName: string,
    ModelJSON: string
}
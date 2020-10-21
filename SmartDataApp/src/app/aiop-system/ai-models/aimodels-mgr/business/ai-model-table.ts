import { IBusinessData } from "../../../../common/interface/IBusiness";
import { CameraAIModel } from "../../../../data-core/model/aiop/camera-ai-model"; 
import { ITableField } from "../../../common/ITableField";
import { IPageTable } from "../../../../common/interface/IPageTable";
import { CustomTableArgs, TableAttr, TableOperationBtn } from "../../../../shared-module/custom-table/custom-table-model";
import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../common/interface/IConverter";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../shared-module/custom-table/custom-table-event";
import { ListAttribute, TableFormControl } from "../../../../common/tool/table-form-helper";
import { ConfirmDialog } from "../../../../shared-module/confirm-dialog/confirm-dialog.component";
import { MessageBar } from "../../../../common/tool/message-bar";
import { ResourcesTable } from '../../../common/resources-table';
export class AIModelsTable  extends ResourcesTable implements IConverter, IPageTable<CameraAIModel> {
    form = new TableFormControl<CameraAIModel>(this);
    updateItemFn: (item: CameraAIModel) => void;
    addItemFn: (item: CameraAIModel) => void;
    scrollPageFn: (event: CustomTableEvent) => void;
    findItemFn: (id: string) => CameraAIModel;
    delItemFn:(id:string)=>void; 
    confirmDialog_:ConfirmDialog;
    msg = new MessageBar();
    ai_icon:any;
    dataSource = new CustomTableArgs<TableField>({
        hasTableOperationTd: true,
        hasHead: true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.ScrollDown)
            this.scrollPageFn(event);
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "图标",
            tdWidth: "10%",
            tdInnerAttrName: "labelIcon",
            isImg:true,
            isSmallImg:true,
            isHoverBig:true
        }), new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "25%",
            tdInnerAttrName: "modelName"
        }), new TableAttr({
            HeadTitleName: "协议类型",
            tdWidth: "10%",
            tdInnerAttrName: "modelType"
        }), new TableAttr({
            HeadTitleName: "应用类型",
            tdWidth: "15%",
            tdInnerAttrName: "transformType"
        }), new TableAttr({
            HeadTitleName: "版本",
            tdWidth: "10%",
            tdInnerAttrName: "version"
        }), new TableAttr({
            HeadTitleName: "更新时间",
            tdWidth: "20%",
            tdInnerAttrName: "updateTime"
        })]
        , tableOperationBtns: [
           
            new TableOperationBtn({
                css: 'howell-icon-modification td-icon',
                title: '编辑',
                callback: (item: TableField) => {
                    this.form.show = true;
                    this.form.editItem = this.findItemFn(item.id);
                }
            }),
            new TableOperationBtn({
                css: 'howell-icon-delete-bin td-icon',
                title: '删除',
                callback: (item: TableField) => { 
                    if(this.delItemFn)this.delItemFn(item.id);
                }
            }) 
        ]
    });
    constructor(private datePipe:DatePipe){
        super();
    } 

  
    Convert<CameraAIModels, CustomTableArgs>(input: CameraAIModels, output: CustomTableArgs) {
        const items = new Array<TableField>();       
        if (input instanceof CameraAIModels) 
            for (const item of input.items) {
                items.push(this.toTableModel(item));            
        }
        if (output instanceof CustomTableArgs) 
            output.values =items;         
        return output;
    }

    toTableModel(item: CameraAIModel) {
        const tableField = new TableField(),l = new ListAttribute();
        tableField.id = item.Id;
        tableField.modelType = item.ModelType;
        tableField.modelName = item.ModelName; 
        tableField.version = item.Version;
        tableField.updateTime = this.datePipe.transform(item.UpdateTime,'yyyy-MM-dd hh:mm');
        tableField.labelIcon =this.ai_icon ? l.imgUrlRoot+l.aiModelIcon+ this.ai_icon[item.Label]: ''; 
        tableField.transformType=item.TransformType;   console.log(tableField);
        
        return tableField;
    }

    

    addItem(item: CameraAIModel) {
        this.dataSource.values.push(this.toTableModel(item));
        this.addItemFn(item);
        this.dataSource.footArgs.totalRecordCount += 1;
    }
  

    editItem(item: CameraAIModel) {
        const findVal = this.dataSource.values.find(x => x.id == item.Id),l = new ListAttribute();
        findVal.modelName = item.ModelName;
        findVal.version = item.Version;
        findVal.transformType = item.TransformType;
        findVal.updateTime = this.datePipe.transform(item.UpdateTime,'yyyy-MM-dd hh:mm');
        findVal.modelType = item.ModelType; 
        findVal.labelIcon = this.ai_icon ? l.imgUrlRoot+l.aiModelIcon+ this.ai_icon[item.Label]: '';
    }

}
export class TableField implements ITableField{
   /**平台ID */
   id: string;    
   /**更新时间 */
   updateTime:  string;    
    /**模型标签图标0-n */
    labelIcon: string;  
    /**版本(可选) */
    version: string;
    /**应用类型，一般是设备型号(可选) */
    transformType: string;
    /**模型类型(可选)：AIOP */
    modelType: string;
    /**模型名称(可选) */
    modelName: string; 
}
export class CameraAIModels implements IBusinessData {
    items: CameraAIModel[];
}
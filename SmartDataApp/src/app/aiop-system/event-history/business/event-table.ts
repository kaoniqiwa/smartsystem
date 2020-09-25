import { DatePipe } from "@angular/common";
import { IConverter } from "../../../common/interface/IConverter"; 
import { CameraAIEventRecord } from "../../../data-core/model/aiop/camera-ai-event-record";
import { CustomTableEvent, CustomTableEventEnum } from "../../../shared-module/custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, TableAttr } from "../../../shared-module/custom-table/custom-table-model";
import { ITableField } from "../../common/ITableField";
import { EnumHelper ,ResourceTypeEnum} from "../../../common/tool/enum-helper";
import {  MediumPicture} from "../../../data-core/url/aiop/resources";
import { IBusinessData } from "../../../common/interface/IBusiness";
import { BusinessTable } from "../../common/business-table";
export class EventTable    extends BusinessTable implements IConverter {
    enlargeImage = '';
    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: true,
        hasHead: true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg:true,
        eventDelegate: (event: CustomTableEvent) => { 
            if (event.eventType == CustomTableEventEnum.ScrollDown)
                this.scrollPageFn(event);
            else if(event.eventType == CustomTableEventEnum.Img){
                this.enlargeImage = event.data+''; 
            }
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "图片",
            tdWidth: "15%",
            tdInnerAttrName: "imageUrl",
            isImg:true
        }), new TableAttr({
            HeadTitleName: "事件类型",
            tdWidth: "10%",
            tdInnerAttrName: "eventType"
        }), new TableAttr({
            HeadTitleName: "模型名称",
            tdWidth: "15%",
            tdInnerAttrName: "modelName"
        }), new TableAttr({
            HeadTitleName: "设备类型",
            tdWidth: "10%",
            tdInnerAttrName: "resourceType"
        }), new TableAttr({
            HeadTitleName: "设备名称",
            tdWidth: "20%",
            tdInnerAttrName: "resourceName"
        }), new TableAttr({
            HeadTitleName: "上报时间",
            tdWidth: "20%",
            tdInnerAttrName: "eventTime"
        })],
        footArgs:new FootArgs({
            hasSelectBtn:false,
            hasSelectCount:false
        })
    });  
   
    
    constructor(private datePipe:DatePipe) {
        super();
    }
    scrollPageFn: (event: CustomTableEvent) => void;
    Convert<CameraAIEventsRecord, CustomTableArgs>(input: CameraAIEventsRecord, output: CustomTableArgs) {
        const items = new Array<TableField>();
      
        if (input instanceof CameraAIEventsRecord) 
            for (const item of input.items) {
                items.push(this.toTableModel(item)); 
            }        
        if (output instanceof CustomTableArgs) 
            output.values =items;         
        return output;
    } 

    toTableModel(item: CameraAIEventRecord) {
        let tableField = new TableField();
        tableField.id = item.EventId;
        tableField.eventTime = this.datePipe.transform(item.EventTime,'yyyy-MM-dd HH:mm:ss');       
        tableField.eventType = new EnumHelper().eventType.get(item.EventType);
        tableField.imageUrl =  new MediumPicture().getJPG(item.ImageUrl);
        tableField.modelName = item.Data.ModelName;
        tableField.resourceName = item.ResourceName;
        tableField.resourceType = ResourceTypeEnum[item.ResourceType];
      
        return tableField;
    }
}

export class CameraAIEventsRecord implements IBusinessData {
    items: CameraAIEventRecord[];
}

export class TableField implements ITableField {
    id:string;
    eventTime:string;
    eventType:string;
    resourceType:string;
    resourceName:string;
    imageUrl:string;
    modelName:string;
}

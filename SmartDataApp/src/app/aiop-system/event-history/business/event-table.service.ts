import { Injectable } from "@angular/core";
import { CameraAIEventRecord } from "../../../data-core/model/aiop/camera-ai-event-record";
import { GetCameraAIEventRecordsParams} from "../../../data-core/model/aiop/camera-ai-event-records-params";
import { CustomTableEvent } from "../../../shared-module/custom-table/custom-table-event";
import {EventTable,CameraAIEventsRecord  } from "./event-table";
import { SearchControl } from "./search";
import "../../../common/string/hw-string";
import { TheDayTime } from "../../../common/tool/tool.service";
import { EventRequestService } from "../../../data-core/repuest/event-record.service";
import { Page } from "../../../data-core/model/page";
import { TableAttribute,ListAttribute } from "../../../common/tool/table-form-helper";
import { AIModelRequestService } from "../../../data-core/repuest/ai-model.service";
import { GetAIModelsParams } from "../../../data-core/model/aiop/ai-models-params";
import { CameraAIModel } from "../../../data-core/model/aiop/camera-ai-model";
import { DatePipe } from "@angular/common";
@Injectable()
export class EventTableService{
    dataSource_ = new Array<CameraAIEventRecord>();

    set dataSource(items: CameraAIEventRecord[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    search = new SearchControl(this.datePipe);
    eventTable = new EventTable(this.datePipe);
    camerasAIModel:CameraAIModel[] = new Array();
    constructor(private eventRequestService: EventRequestService
        ,private aiModelRequestService:AIModelRequestService
        ,private datePipe:DatePipe) { 
       
        this.eventTable.scrollPageFn = (event: CustomTableEvent) => {
            this.requestData(event.data as any);
            this.searchData(event.data as any);
        } 
        this.eventTable.findEventFn = (id)=>{
            return this.dataSource.find(x=>x.EventId == id);
        }
    }

  async  getAIModels(){
        const param = new GetAIModelsParams();
        param.PageIndex=1;
        param.PageSize=new ListAttribute().maxSize;
        const response= await this.aiModelRequestService.list(param).toPromise();
        this.camerasAIModel=response.Data.Data;
    }

    async requestData(pageIndex: number,callBack?:(page:Page)=>void) {
        if (this.search.state == false) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
            let data = new CameraAIEventsRecord();
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.EventTime, b.EventTime);
            });

            this.eventTable.clearItems();
            this.dataSource = [];
            this.eventTable.Convert(data, this.eventTable.dataSource); 
            this.eventTable.totalCount = response.Data.Page.RecordCount;         
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
        }

    }

    async searchData(pageIndex: number,callBack?:(page:Page)=>void) {
        if (this.search.state) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
            
            let data = new CameraAIEventsRecord();
            data.items = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.EventTime, b.EventTime);
            });

            this.eventTable.clearItems();
            this.dataSource = [];
            this.eventTable.Convert(data, this.eventTable.dataSource); 
            this.eventTable.totalCount = response.Data.Page.RecordCount;         
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
        }

    }


    getRequsetParam(pageIndex: number, search: SearchControl) {

        const  param = new GetCameraAIEventRecordsParams(),day = TheDayTime(new Date());
        param.PageIndex = pageIndex;
        param.PageSize = new TableAttribute().pageSize;
        param.BeginTime = day.begin.toISOString();
        param.EndTime=day.end.toISOString();  
        const s = search.toSearchParam();
        if (s.SearchText && search.other == false) {
            param.ResourceName = s.SearchText;  
        }
        else {
            if (s.BeginTime) param.BeginTime = s.BeginTime;
            if (s.EndTime) param.EndTime = s.EndTime;
            if (s.EventType) param.EventTypes = [s.EventType];
            if (s.ModelId) param.ModelIds = [s.ModelId];
            if (s.ResourceType) param.ResourceTypes = [s.ResourceType]; 
        }
        return param;
    }
}

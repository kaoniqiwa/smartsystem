import { Injectable } from "@angular/core"; 
import { CustomTableEvent } from "../../../shared-module/custom-table/custom-table-event";
import {EventTable,IllegalDropEventsRecord  } from "./event-table";
import { SearchControl } from "./search";
import "../../../common/string/hw-string";
import { TheDayTime } from "../../../common/tool/tool.service"; 
import { Page } from "../../../data-core/model/page";
import { TableAttribute,ListAttribute } from "../../../common/tool/table-form-helper";   
import { DatePipe } from "@angular/common";
import {  DivisionRequestService } from "../../../data-core/repuest/division.service";
import { EventRequestService } from "../../../data-core/repuest/Illegal-drop-event-record";
import { GetDivisionsParams,Division } from "../../../data-core/model/waste-regulation/division";
import { GarbageStationRequestService } from "../../../data-core/repuest/garbage-station.service";
import {  GetGarbageStationsParams,GarbageStation} from "../../../data-core/model/waste-regulation/garbage-station";
import { GetEventRecordsParams, IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
@Injectable()
export class EventTableService extends ListAttribute{
    dataSource_ = new Array<IllegalDropEventRecord>();

    set dataSource(items: IllegalDropEventRecord[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    search = new SearchControl(this.datePipe);
    eventTable = new EventTable(this.datePipe); 
    divisions = new Array<Division>();
    garbageStations = new Array<GarbageStation>();
    constructor(private eventRequestService: EventRequestService
        ,private divisionService:DivisionRequestService
        ,private garbageStationService:GarbageStationRequestService
        ,private datePipe:DatePipe) { 
       super();
        this.eventTable.scrollPageFn = (event: CustomTableEvent) => {
            this.requestData(event.data as any);
            this.searchData(event.data as any);
        } 
        this.eventTable.findEventFn = (id)=>{
            return this.dataSource.find(x=>x.EventId == id);
        }
    }

    async requestDivisions(){
        const param = new GetDivisionsParams();
        param.PageIndex=1;
        param.PageSize =this.maxSize;
        const result=await this.divisionService.list(param).toPromise();
        return result.Data.Data;
    }

    async requestGarbageStations(){
        const param = new GetGarbageStationsParams();
        param.PageIndex=1;
        param.PageSize=this.maxSize;
        const result=await this.garbageStationService.list(param).toPromise();
        return result.Data.Data;
    }

    async requestData(pageIndex: number,callBack?:(page:Page)=>void) {
        if (this.search.state == false) {
            const response = await this.eventRequestService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
            let data = new IllegalDropEventsRecord();
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
            
            let data = new IllegalDropEventsRecord();
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

        const  param = new GetEventRecordsParams(),day = TheDayTime(new Date());
        param.PageIndex = pageIndex;
        param.PageSize = new TableAttribute().pageSize;
        param.BeginTime = day.begin.toISOString();
        param.EndTime=day.end.toISOString();  
        const s = search.toSearchParam();
        if (s.SearchText && search.other == false) {
            param.StationName = s.SearchText;  
        }
        else {
            if (s.BeginTime) param.BeginTime = s.BeginTime;
            if (s.EndTime) param.EndTime = s.EndTime;
            if (s.DivisionId) param.DivisionIds = [s.DivisionId];
            if (s.StationId) param.StationIds = [s.StationId];
        }
        return param;
    }
}

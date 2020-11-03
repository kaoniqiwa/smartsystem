import { Injectable } from "@angular/core";
import { CustomTableEvent } from "../../../custom-table/custom-table-event";
import {CameraTable  ,BusinessData} from "./camera-table";
import { SearchControl } from "./search";
import "../../../../common/string/hw-string";
import { Page } from "../../../../data-core/model/page";
import { TableAttribute } from "../../../../common/tool/table-form-helper";
import { DatePipe } from "@angular/common";
import { Camera, GetGarbageStationCamerasParams } from "../../../../data-core/model/waste-regulation/camera";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import { GarbageStationRequestService ,CameraRequestService} from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
@Injectable()
export class CameraTableService{
    dataSource_ = new Array<Camera>();

    set dataSource(items: Camera[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    search = new SearchControl();
    table = new CameraTable(this.datePipe);
    garbageStationDao:GarbageStationDao;
    garbageStations = new Array<GarbageStation>(); 
    cameraStateTable:CameraStateTableEnum;
    constructor(garbageStationService: GarbageStationRequestService
       ,private cameraService:CameraRequestService
        ,private datePipe:DatePipe) { 
       
        this.table.scrollPageFn = (event: CustomTableEvent) => {
            this.requestData(event.data as any); 
        } 
        this.garbageStationDao = new GarbageStationDao(garbageStationService);

    }

    async  getGarbageStations(){
      const result=await this.garbageStationDao.allGarbageStations();
      this.garbageStations=result.Data;
    }

    async requestData(pageIndex: number,callBack?:(page:Page)=>void) {
        const response = await this.cameraService.postList(this.getRequsetParam(pageIndex, this.search)).toPromise();
        const data = new BusinessData();
        data.statioins=this.garbageStations; 
        data.cameras = response.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.Name, b.Name);
        });

        this.table.clearItems();
        this.dataSource = [];
        if(this.cameraStateTable == CameraStateTableEnum.offline){
            data.cameras = data.cameras.filter(x=>x.OnlineStatus !=0);
            this.table.Convert(data, this.table.dataSource); 
            this.table.totalCount = data.cameras.length;    
            this.dataSource = data.cameras;
            if(callBack)callBack({ PageCount:1} as any);   
        }
        else{
            this.table.Convert(data, this.table.dataSource); 
            this.table.totalCount = response.Data.Page.TotalRecordCount;         
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
        }
      

    } 

    getRequsetParam(pageIndex: number, search: SearchControl) {
        const  param = new GetGarbageStationCamerasParams();
        param.PageIndex = pageIndex;
        param.PageSize =this.cameraStateTable == CameraStateTableEnum.offline? new TableAttribute().pageSize:10;   
        if (search.state) 
            param.Name =search.searchText   
        if(this.cameraStateTable == CameraStateTableEnum.online)
            param.OnlineStatus=this.cameraStateTable;
        
        return param;
    }
}


export enum CameraStateTableEnum{
  online,
  offline,
  none,
}

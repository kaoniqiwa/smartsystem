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
            this.searchData(event.data as any);
        } 
        this.garbageStationDao = new GarbageStationDao(garbageStationService);

    }

    async  getGarbageStations(){
      const result=await this.garbageStationDao.allGarbageStations();
      this.garbageStations=result.Data;
    }

    async requestData(pageIndex: number,callBack?:(page:Page)=>void) {
        if (this.search.state == false) {
            const response = await this.cameraService.postList(this.getRequsetParam(pageIndex, this.search)).toPromise();
            const data = new BusinessData();
            data.statioins=this.garbageStations; 
            data.cameras = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });

            this.table.clearItems();
            this.dataSource = [];
            this.table.Convert(data, this.table.dataSource); 
            this.table.totalCount = response.Data.Page.TotalRecordCount;         
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
        }

    }

    async searchData(pageIndex: number,callBack?:(page:Page)=>void) {
        if (this.search.state) {
            const response = await this.cameraService.postList(this.getRequsetParam(pageIndex, this.search)).toPromise();
            
            const data = new BusinessData();
            data.statioins=this.garbageStations; 
            data.cameras = response.Data.Data.sort((a, b) => {
                return ''.naturalCompare(a.Name, b.Name);
            });

            this.table.clearItems();
            this.dataSource = [];
            this.table.Convert(data, this.table.dataSource); 
            this.table.totalCount = response.Data.Page.TotalRecordCount;         
            this.dataSource = response.Data.Data;
            if(callBack)callBack(response.Data.Page);
        }

    }


    getRequsetParam(pageIndex: number, search: SearchControl) {
        const  param = new GetGarbageStationCamerasParams();
        param.PageIndex = pageIndex;
        param.PageSize = new TableAttribute().pageSize;   
        if (search.state) 
            param.Name =search.searchText   
        if(this.cameraStateTable != CameraStateTableEnum.none)
            param.OnlineStatus=this.cameraStateTable;
        return param;
    }
}


export enum CameraStateTableEnum{
  none,
  online,
  offline
}

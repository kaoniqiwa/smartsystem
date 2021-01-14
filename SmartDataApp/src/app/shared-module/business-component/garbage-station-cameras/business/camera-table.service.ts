import { Injectable } from "@angular/core";
import { CustomTableEvent } from "../../../custom-table/custom-table-event";
import {CameraTable  ,BusinessData} from "./camera-table";
import { SearchControl } from "./search";
import "../../../../common/string/hw-string";
import { Page } from "../../../../data-core/model/page";
import { ListAttribute} from "../../../../common/tool/table-form-helper";
import { DatePipe } from "@angular/common";
import { CameraRequestService as  ResourceRequestService } from "../../../../data-core/repuest/resources.service"; 
import { Camera, GetGarbageStationCamerasParams } from "../../../../data-core/model/waste-regulation/camera";
import { Camera as ResourceCamera } from "../../../../data-core/model/aiop/camera";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
import {  ResourceCameraDao} from "../../../../data-core/dao/resources-camera-dao";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationRequestService ,CameraRequestService} from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../../../data-core/model/waste-regulation/division";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { MediumPicture } from "../../../../data-core/url/aiop/resources";
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
    resourceCameraDao:ResourceCameraDao;
    divisionDao:DivisionDao;
    garbageStations = new Array<GarbageStation>(); 
    resourceCamera=new Array<ResourceCamera>();
    divisions=new Array<Division>();
    cameraStateTable:CameraStateTableEnum;
    findImgSrc = '';
    divisionsId='';
    constructor(garbageStationService: GarbageStationRequestService
       ,private cameraService:CameraRequestService
       , resourceRequestService:ResourceRequestService
        ,divisionRequestService:DivisionRequestService
        ,private datePipe:DatePipe) { 
       
        this.table.scrollPageFn = (event: CustomTableEvent) => {
            this.requestData(event.data as any); 
        } 
        this.garbageStationDao = new GarbageStationDao(garbageStationService);
        this.resourceCameraDao=new ResourceCameraDao(resourceRequestService);
        this.divisionDao=new DivisionDao(divisionRequestService);

        this.table.showImgFn = (id:string)=>{
            const find = this.resourceCamera.find(x=>x.Id==id);
            this.findImgSrc= new MediumPicture().getJPG(find.ImageUrl);
        }
    }

    async  getGarbageStations(){
      const result=await this.garbageStationDao.allGarbageStations();
      this.garbageStations=result;
    }

   async getResourceCameras(){
      const result = await this.resourceCameraDao.allResourceCameras();
      this.resourceCamera=result;
    }

    async getDivisions(){
        const result = await this.divisionDao.allDivisions();
        this.divisions=result;
    }

    async requestData(pageIndex: number,callBack?:(page:Page)=>void) {
        const response = await this.cameraService.postList(this.getRequsetParam(pageIndex, this.search)).toPromise();
        const data = new BusinessData();
        data.statioins=this.garbageStations; 
        data.resourceCameras=this.resourceCamera;
        data.divisions=this.divisions;        
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

    getRequsetParam(pageIndex: number, search: SearchControl) {
        const  param = new GetGarbageStationCamerasParams();
        param.PageIndex = pageIndex;
        param.PageSize =10;   
        if (search.state) 
            param.Name =search.searchText   
        if(this.cameraStateTable == CameraStateTableEnum.online||this.cameraStateTable == CameraStateTableEnum.offline)
            param.OnlineStatus=this.cameraStateTable;
        param.DivisionIds=[this.divisionsId]; 
        return param;
    }
}


export enum CameraStateTableEnum{
  online,
  offline,
  none,
}

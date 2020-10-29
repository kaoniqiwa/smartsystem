import { GetGarbageStationCamerasParams } from "../model/waste-regulation/camera";
import { CameraRequestService } from "../repuest/garbage-station.service";
import { ListAttribute } from "../../common/tool/table-form-helper";
export class GarbageStationCameraDao extends ListAttribute{
    constructor(private requestService:CameraRequestService){
        super();
    }

   async garbageStationCameras(pageIndex:number,pageSize:number){
      const param = new  GetGarbageStationCamerasParams();
      param.PageIndex=pageIndex;
      param.PageSize=pageSize;
      const  result= await this.requestService.postList(param).toPromise();
      return result.Data;
    }
}
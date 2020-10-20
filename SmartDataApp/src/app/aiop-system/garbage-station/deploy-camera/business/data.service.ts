import { Injectable } from "@angular/core";
import { CameraRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { Camera, GetGarbageStationCamerasParams } from "../../../../data-core/model/waste-regulation/camera";
@Injectable()
export class DataService {

    cameras = new Array<Camera>();
    constructor(private cameraRequestService: CameraRequestService) {

    }

    async getStationCameras(stationId: string) {
        const result = await this.cameraRequestService.list(stationId).toPromise();
        return result.Data;
    }

    async addStationCamera(item: Camera) {
        const result = await this.cameraRequestService.create(item).toPromise();
        return result.FaultCode == 0;
    }

    async getCamera(stationId: string, cameraId: string) {
        const param = new GetGarbageStationCamerasParams();
       
        param.PageIndex =1;
        param.PageSize=new ListAttribute().maxSize;
        if (stationId)
            param.GarbageStationIds = [stationId];
        if(cameraId)
            param.Ids = [cameraId];
        
        const result = await this.cameraRequestService.postList(param).toPromise(); 
        return result.Data.Data;
    }
    async editStationCamera(item: Camera) {
        const result = await this.cameraRequestService.set(item).toPromise();
        return result.FaultCode == 0;
    }


    async delStationCamera(stationId: string, cameraId: string) {
        const result = await this.cameraRequestService.del(stationId, cameraId).toPromise();
        return result.FaultCode == 0;
    }
}
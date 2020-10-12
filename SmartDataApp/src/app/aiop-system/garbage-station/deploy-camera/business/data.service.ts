import { Injectable } from "@angular/core";
import { CameraRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { Camera } from "../../../../data-core/model/waste-regulation/camera";
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

    async delStationCamera(stationId: string, cameraId: string) {
        const result = await this.cameraRequestService.del(stationId, cameraId).toPromise();
        return result.FaultCode == 0;
    }
}
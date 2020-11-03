import { CameraRequestService } from "../../data-core/repuest/resources.service"; 
import { ListAttribute } from "../../common/tool/table-form-helper";
import { AppCaChe } from "../../common/tool/app-cache/app-cache";
import { GetCamerasParams } from "../model/aiop/encode-devices-params";
import { Camera } from "../model/aiop/camera";
export class ResourceCameraDao extends ListAttribute {
    cache = new AppCaChe(60*10 * 1000);
    readonly resourceCameras = 'ResourceCameras';
    constructor(private requestService: CameraRequestService) {
        super();
    }

    async allResourceCameras() {
        var result = this.cache.get<Camera[]>(this.resourceCameras);
        if (!result) {
            const param = new GetCamerasParams();
            param.PageIndex = 1;
            param.PageSize = this.maxSize;
            const response = await this.requestService.list(param).toPromise();
            this.cache.set(this.resourceCameras, response.Data.Data);
            result= response.Data.Data;
        }
        return result;
    }
}
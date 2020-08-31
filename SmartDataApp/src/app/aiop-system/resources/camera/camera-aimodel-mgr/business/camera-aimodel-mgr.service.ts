import { Injectable } from "@angular/core";
import { CameraRequestService, AIModelRequestService as CameraAIModelRequestService, LabelRequestService }
    from "../../../../../data-core/repuest/resources.service";
import { AIModelRequestService } from "../../../../../data-core/repuest/ai-model.service";
import { RegionRequestService } from "../../../../../data-core/repuest/region.service";
import { Camera } from "../../../../../data-core/model/camera";
import { GetCamerasParams } from "../../../../../data-core/model/encode-devices-params";
import { TableSearchEnum, ListAttribute } from "../../../../../common/tool/table-form-helper";
import { CameraAIModel, } from "../../../../../data-core/model/camera-ai-model";
import { TableAttribute } from "../../../../../common/tool/table-form-helper";
import { GetAIModelsParams } from "../../../../../data-core/model/camera-ai-event-records-params";
import { AICameraPanel } from "./ai-camera-panel";
import { AIModelsPanel } from "./ai-models-panel";
import "../../../../../common/string/hw-string";
import { Page } from "../../../../../data-core/model/page";
import { ViewPagination } from "../../../../../shared-module/card-list-panel/card-list-panel";
import { RegionTreeService } from "../../../../common/region-tree.service";
import { RegionCamera } from "./region-camera";
import { BatchCopyRequest } from "../../../../../data-core/model/ai-models-params";
import { ResourceLabel } from "../../../../../data-core/model/resource-label";
import { GetResourceLabelsParams } from "../../../../../data-core/model/resource-labels-params";
import { SearchControl } from "./ai-cameras-search";
@Injectable()
export class CameraAIModelMgrService extends RegionTreeService {
    public cameras = new Array<Camera>();
    public aiModels = new Array<CameraAIModel>();
    public regionCamera = new RegionCamera();
    search = new SearchControl();
    aiCameraPanel: AICameraPanel;
    aiModelsPanel: AIModelsPanel;
    pageIndex = 1; 
    constructor(public cameraRequestService: CameraRequestService
        , public aiModelRequestSerivce: AIModelRequestService
        , public cameraAIModelRequestService: CameraAIModelRequestService
        , public regionRequestService: RegionRequestService
        , public labelRequestService: LabelRequestService) {
        super(regionRequestService);
        this.search = new SearchControl();
        this.aiCameraPanel = new AICameraPanel();
        this.aiModelsPanel = new AIModelsPanel();
        this.aiCameraPanel.findCameraAIModel = async (cameraId: string, resultFn: (models: CameraAIModel[]) => void) => {
            const data = await this.requsetCameraAIModelData(cameraId);
            resultFn(data);
        }
        this.aiCameraPanel.viewPaginationFn = (page: Page) => {
            return new ViewPagination(page.PageCount, async (index) => {
                this.pageIndex = index;
                await this.requestCamerasData(index);
                this.aiCameraPanel.clearPanelView();
                this.aiCameraPanel.cardListPanelView = this.cameras;
                this.aiCameraPanel.underCamerasAIModels = this.cameras;

            });
        }
        this.aiCameraPanel.addAIModelToCameraFn = async (cameraId: string, aiModelId: string, successFn: (success: boolean) => void) => {
            const result = await this.addAIModelToCamera(cameraId, aiModelId);
            successFn(result);
        }
        this.aiCameraPanel.delAIModelToCameraFn = async (cameraId: string, aiModelId: string, successFn: (success: boolean) => void) => {
            const result = await this.delAIModelToCamera(cameraId, aiModelId);
            successFn(result);
        }
        this.regionCamera.cameraAIModelCopyToFn = async (tagCameraId, targetCameraIds) => {
            const success = await this.cameraAIModelsCopyTo(tagCameraId, targetCameraIds);
            if (success) {               
                /**刷新当前页 */
                //更新 view
                //更新 datasource
                this.aiCameraPanel.setEditListPanel(tagCameraId, targetCameraIds);
                this.aiCameraPanel.messageBar.response_success(); 
            }
            return success;
        }
    }

    async requestResourceLabels(callBack?: (items: ResourceLabel[]) => void) {
        const param = new GetResourceLabelsParams();
        param.PageIndex = 1;
        param.PageSize = new ListAttribute().maxSize;
        const response = await this.labelRequestService.list(param);
        if (callBack) callBack(response.data.Data.Data);
    }

    async requestCamerasData(pageIndex: number, callBack?: (items: Camera[], page: Page) => void) {
        const response = await this.cameraRequestService.list(this.getCameraRequsetParam(pageIndex, this.search));
        this.cameras = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.Name, b.Name);
        });
        if (callBack) callBack(this.cameras, response.data.Data.Page)

    }

    async requsetCameraAIModelData(cameraId: string) {
        const response = await this.cameraAIModelRequestService.list(cameraId);
        return response.data.Data;
    }

    async requestRegionCamerasData(regionId: string) {
        const response = await this.cameraRequestService.list(this.getCameraRequsetParam(1, null, regionId));
        const datas = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.Name, b.Name);
        });
        return datas;
    }

    async cameraAIModelsCopyTo(tagCameraId: string, targetCameraId: string[]) {
        const param = new BatchCopyRequest();
        param.ResourceIds = targetCameraId;
        const response = await this.cameraAIModelRequestService.copyTo(param, tagCameraId);
        console.log(response); 
        return response.data.FaultReason == 'OK';
    }

    async requsetAIModelData(pageIndex: number, callBack?: (data: CameraAIModel[]) => void) {
        const response = await this.aiModelRequestSerivce.list(this.getAIModelRequsetParam(pageIndex));
        this.aiModels = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.ModelName, b.ModelName);
        });
        if (callBack) callBack(this.aiModels);
    }

    async addAIModelToCamera(cameraId: string, aiModelId: string) {
        const response = await this.cameraAIModelRequestService.create(cameraId, aiModelId);
        return response.data.FaultReason == 'OK';
    }

    async delAIModelToCamera(cameraId: string, aiModelId: string) {
        const response = await this.cameraAIModelRequestService.del(cameraId, aiModelId);
        return response.data.FaultReason == 'OK';
    }

    getAIModelRequsetParam(pageIndex: number) {
        let param = new GetAIModelsParams();
        param.PageIndex = pageIndex;
        param.PageSize = new ListAttribute().maxSize;
        return param;
    }

    getCameraRequsetParam(pageIndex: number, search?: SearchControl, regionId?: string) {
        let param = new GetCamerasParams();
        param.PageIndex = pageIndex;
        param.PageSize = new TableAttribute().pageSize;
        if (search && search.state) {
            const s = search.toSearchParam();
            if (s.Name) param.Name = s.Name;
            if (s.AndLabelIds.length) param.AndLabelIds = s.AndLabelIds;
        }
        if (regionId) {
            param.RegionId = regionId;
            param.PageSize = new ListAttribute().maxSize;
        }
        return param;
    }

}
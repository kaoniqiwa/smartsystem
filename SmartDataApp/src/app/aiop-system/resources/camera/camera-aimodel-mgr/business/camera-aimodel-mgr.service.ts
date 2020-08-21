import { Injectable } from "@angular/core";
import { CameraRequestService, AIModelRequestService as CameraAIModelRequestService }
    from "../../../../../data-core/repuest/resources.service";
import { AIModelRequestService } from "../../../../../data-core/repuest/ai-model.service";

import { Camera } from "../../../../../data-core/model/camera";
import { FormGroup } from "@angular/forms";
import { GetCamerasParams } from "../../../../../data-core/model/encode-devices-params";
import { TableSearchEnum, ListAttribute } from "../../../../../common/tool/table-form-helper";
import { CameraAIModel, } from "../../../../../data-core/model/camera-ai-model";
import { TableAttribute, SearchHelper } from "../../../../../common/tool/table-form-helper";
import { GetAIModelsParams } from "../../../../../data-core/model/camera-ai-event-records-params";
import { PanelControl } from "./panel-control";
import "../../../../../common/string/hw-string";
import { Page } from "../../../../../data-core/model/page";
import { ViewPagination } from "../../../../../shared-module/card-list-panel/card-list-panel";
@Injectable()
export class CameraAIModelMgrService extends TableAttribute {
    cameras = new Array<Camera>();
    aiModels = new Array<CameraAIModel>();
    panelControl: PanelControl;
    constructor(private cameraRequestService: CameraRequestService
        , private aiModelRequestSerivce: AIModelRequestService
        , private cameraAIModelRequestService: CameraAIModelRequestService) {
        super();
        this.panelControl = new PanelControl();
        this.panelControl.findCameraAIModel = async (cameraId: string, resultFn: (models: CameraAIModel[]) => void) => {
            const data = await this.requsetCameraAIModelData(cameraId);
            resultFn(data);
        }
        this.panelControl.viewPaginationFn = (page: Page) => {
            return new ViewPagination(page.PageCount, () => {
            });
        }
        this.panelControl.addAIModelToCameraFn= async (cameraId: string, aiModelId: string,successFn:(success:boolean)=>void)=>{
            const result=await this.addAIModelToCamera(cameraId,aiModelId);
            successFn(result);
        }
        this.panelControl.delAIModelToCameraFn= async (cameraId: string, aiModelId: string,successFn:(success:boolean)=>void)=>{
            const result=await this.delAIModelToCamera(cameraId,aiModelId);
            successFn(result);
        }
    }

    async requestCamerasData(pageIndex: number) {
        const response = await this.cameraRequestService.list(this.getCameraRequsetParam(TableSearchEnum.none, pageIndex));
        this.cameras = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.Name, b.Name);
        });
        if (this.panelControl.viewPaginationFn) {
            const viewPagination = this.panelControl.viewPaginationFn(response.data.Data.Page);
            this.panelControl.cardListDataSource.pagination = viewPagination;
            this.panelControl.cardListDataSource.pagination.totalRecordCount = response.data.Data.Page.TotalRecordCount;
        }
    }

    async requsetCameraAIModelData(cameraId: string) {
        const response = await this.cameraAIModelRequestService.list(cameraId);
        return response.data.Data;
    }

    async requsetAIModelData(pageIndex: number) {
        const response = await this.aiModelRequestSerivce.list(this.getAIModelRequsetParam(TableSearchEnum.none, pageIndex));
        this.aiModels = response.data.Data.Data.sort((a, b) => {
            return ''.naturalCompare(a.ModelName, b.ModelName);
        });
    }

    async addAIModelToCamera(cameraId: string, aiModelId: string) {
        const response = await this.cameraAIModelRequestService.create(cameraId, aiModelId);
        return response.data.FaultReason == 'OK';
    }

    async delAIModelToCamera(cameraId: string, aiModelId: string) {
        const response = await this.cameraAIModelRequestService.del(cameraId, aiModelId);
        return response.data.FaultReason == 'OK';
    }

    getAIModelRequsetParam(paramType: TableSearchEnum, pageIndex: number, name?: string) {
        let param = new GetAIModelsParams();
        param.PageIndex = pageIndex;
        param.PageSize = new ListAttribute().maxSize;
        if (paramType == TableSearchEnum.none) {

        }
        else if (paramType == TableSearchEnum.search) {

        }
        return param;
    }

    getCameraRequsetParam(paramType: TableSearchEnum, pageIndex: number, search?: FormGroup) {
        let param = new GetCamerasParams();
        param.PageIndex = pageIndex;
        param.PageSize = this.pageSize;
        if (paramType == TableSearchEnum.none) {

        }
        else if (paramType == TableSearchEnum.search) {

        }
        return param;
    }

}
import { Injectable } from "@angular/core";
import { Resource  as ResourceModel} from "../model/resource";
import {  EncodeDevice as EncodeDeviceModel} from "../model/encode-device";
import { ResourceLabel  as ResourceLabelModel} from "../model/resource-label";
import { GetEncodeDevicesParams, GetCamerasParams } from "../model/encode-devices-params";
import { Protocol } from "../model/protocol";
import { Camera as CameraModel } from "../model/camera";
import {  CameraAIModel } from "../model/camera-ai-model";
import * as url from "../url/resources";
import { RequestService } from "./Request.service";
import { PagedList } from "../model/page";
import { Response } from "../model/Response";
import { GetResourcesParams } from "../model/resources-params"; 
import { GetResourceLabelsParams } from "../model/resource-labels-params";
import { SaveModel } from "../model/save-model"; 
@Injectable({
    providedIn:'root'
})
export class ResourceRequestService extends SaveModel{
    url: url.Resource;
    constructor(private requestService: RequestService) {
        super();
        this.url = new url.Resource();
    }
    create(item:ResourceModel){ 
    
        return this.requestService.axios.post<ResourceModel, Response<ResourceModel>>(this.url.create(),this.toModel(item,this.formMustField.resource));
    }

    get(id: string) {
        return this.requestService.axios.get<Response<ResourceModel>>(this.url.get(id));
    }

    set(item: ResourceModel){
        return this.requestService.axios.put<ResourceModel, Response<ResourceModel>>(this.url.edit(item.Id),this.toModel(item,this.formMustField.resource));
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<ResourceModel>>(this.url.del(id));
    }

    list(item:GetResourcesParams){
        return this.requestService.axios.post<GetResourcesParams, Response<PagedList<ResourceModel>>>('/api/howell/ver10/aiop_service/'+this.url.list(), item);
    }
}

@Injectable({
    providedIn:'root'
})
export class EncodeDeviceRequestService extends SaveModel{
    url: url.ResourceEncodeDevice;
    constructor(private requestService: RequestService) {
        super();
        this.url = new url.ResourceEncodeDevice();
    }
    create(item:EncodeDeviceModel){
        return this.requestService.axios.post<EncodeDeviceModel, Response<EncodeDeviceModel>>(this.url.create(), this.toModel(item,this.formMustField.encodeDevice));
    }

    get(id: string) {
        return this.requestService.axios.get<Response<EncodeDeviceModel>>(this.url.get(id));
    }

    set(item: EncodeDeviceModel){
        return this.requestService.axios.put<EncodeDeviceModel, Response<EncodeDeviceModel>>(this.url.edit(item.Id), this.toModel(item,this.formMustField.encodeDevice));
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<EncodeDeviceModel>>(this.url.del(id));
    }

    list(item:GetEncodeDevicesParams){
        return this.requestService.axios.post<GetEncodeDevicesParams, Response<PagedList<EncodeDeviceModel>>>(this.url.list(), item);
    }

    protocol(){
        return this.requestService.axios.get<Response<Protocol[]>>(this.url.protocol());
    }
}

@Injectable({
    providedIn:'root'
})
export class CameraRequestService extends SaveModel{
    url: url.ResourceCamera;
    constructor(private requestService: RequestService) {
        super();
        this.url = new url.ResourceCamera();
    }
    create(item:CameraModel){
        return this.requestService.axios.post<CameraModel, Response<CameraModel>>(this.url.create(), this.toModel(item,this.formMustField.camera));
    }

    get(id: string) {
        return this.requestService.axios.get<Response<CameraModel>>(this.url.get(id));
    }

    set(item: CameraModel){
        return this.requestService.axios.put<CameraModel, Response<CameraModel>>(this.url.edit(item.Id),this.toModel(item,this.formMustField.camera));
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<CameraModel>>(this.url.del(id));
    }

    list(item:GetCamerasParams){
        return this.requestService.axios.post<GetCamerasParams, Response<PagedList<CameraModel>>>(this.url.list(), item);
    }

}


@Injectable({
    providedIn:'root'
})
export class AIModelRequestService{
    url: url.ResourceCameraAIModel;
    constructor(private requestService: RequestService) {
        this.url = new url.ResourceCameraAIModel();
    }
    create(cameraId:string,aiModelId:string){
        return this.requestService.axios.post<CameraAIModel, Response<CameraAIModel>>(this.url.create(cameraId,aiModelId));
    }

    get(cameraId: string,aiModelId:string) {
        return this.requestService.axios.get<Response<CameraAIModel>>(this.url.get(cameraId,aiModelId));
    }

    list(cameraId:string){
        return this.requestService.axios.get<Response<CameraAIModel[]>>(this.url.list(cameraId));
    }

    del(cameraId: string,aiModelId:string) {
        return this.requestService.axios.delete<Response<CameraAIModel>>(this.url.del(cameraId,aiModelId));
    }

}


@Injectable({
    providedIn:'root'
})
export class LabelRequestService{
    url: url.Label;
    constructor(private requestService: RequestService) {
        this.url = new url.Label();
    }
    create(item:ResourceLabelModel){
        return this.requestService.axios.post<ResourceLabelModel, Response<ResourceLabelModel>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.axios.get<Response<ResourceLabelModel>>(this.url.get(id));
    }

    set(item: ResourceLabelModel){
        return this.requestService.axios.put<ResourceLabelModel, Response<ResourceLabelModel>>(this.url.edit(item.Id),item);
    }

    del(id: string) {
        return this.requestService.axios.delete<Response<ResourceLabelModel>>(this.url.del(id));
    }

    list(item:GetResourceLabelsParams){
        return this.requestService.axios.post<GetResourceLabelsParams, Response<PagedList<ResourceLabelModel>>>(this.url.list(), item);
    }
}

@Injectable({
    providedIn:'root'
})
export class ResourceLabelRequestService{
    url: url.ResourceLabel;
    constructor(private requestService: RequestService) {
        this.url = new url.ResourceLabel();
    }
    create(sourceId:string,labelId:string){
        return this.requestService.axios.post<ResourceLabelModel, Response<ResourceLabelModel>>(this.url.create(sourceId,labelId));
    }

    get(sourceId:string,labelId:string){
        return this.requestService.axios.get<Response<ResourceLabelModel>>(this.url.get(sourceId,labelId));
    }

    // list(sourceId:string){
    //     return this.requestService.axios.get<Response<ResourceLabelModel[]>>(this.url.list(sourceId));
    // }

    del(sourceId:string,labelId:string){
        return this.requestService.axios.delete<Response<ResourceLabelModel>>(this.url.del(sourceId,labelId));
    }
}

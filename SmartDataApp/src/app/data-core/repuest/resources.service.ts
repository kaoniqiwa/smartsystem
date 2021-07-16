import { Injectable } from "@angular/core";
import { Resource as ResourceModel } from "../model/aiop/resource";
import { EncodeDevice as EncodeDeviceModel } from "../model/aiop/encode-device";
import { ResourceLabel as ResourceLabelModel } from "../model/aiop/resource-label";
import {
  GetEncodeDevicesParams,
  GetCamerasParams,
} from "../model/aiop/encode-devices-params";
import { Protocol } from "../model/aiop/protocol";
import { Camera as CameraModel } from "../model/aiop/camera";
import { CameraAIModel } from "../model/aiop/camera-ai-model";
import * as url from "../url/aiop/resources";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { GetResourcesParams } from "../model/aiop/resources-params";
import { GetResourceLabelsParams } from "../model/aiop/resource-labels-params";
import { SaveModel } from "../model/save-model";
import { BatchCopyRequest } from "../model/aiop/ai-models-params";
import { BatchResult } from "../model/batch";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SRService } from "../url/aiop/sr-server";
import { SRService as StationSRService } from "../url/waste-regulation/sr-server";
import {
  GetPreviewUrlParams,
  GetVodUrlParams,
  VideoUrl,
} from "../model/aiop/video-url";
import { SessionUser } from "src/app/common/tool/session-user";
import { VideoPlayArgs } from "src/app/video/mode";
import { isIPAddressOrLocalhost } from "src/app/common/tool/tool.service";
@Injectable({
  providedIn: "root",
})
export class ResourceRequestService {
  url: url.Resource;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.Resource();
  }
  create(item: ResourceModel) {
    return this.requestService.post<ResourceModel, ResourceModel>(
      this.url.create(),
      SaveModel.toModel(item, SaveModel.formMustField.resource)
    );
  }

  get(id: string) {
    return this.requestService.get<ResourceModel>(this.url.get(id));
  }

  set(item: ResourceModel) {
    return this.requestService.put<ResourceModel, ResourceModel>(
      this.url.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.resource)
    );
  }

  del(id: string) {
    return this.requestService.delete<ResourceModel>(this.url.del(id));
  }

  list(item: GetResourcesParams) {
    return this.requestService.post<
      GetResourcesParams,
      HowellResponse<PagedList<ResourceModel>>
    >(this.url.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class EncodeDeviceRequestService {
  url: url.ResourceEncodeDevice;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.ResourceEncodeDevice();
  }
  create(item: EncodeDeviceModel) {
    return this.requestService.post<
      EncodeDeviceModel,
      HowellResponse<EncodeDeviceModel>
    >(
      this.url.create(),
      SaveModel.toModel(item, SaveModel.formMustField.encodeDevice)
    );
  }

  get(id: string) {
    return this.requestService.get<EncodeDeviceModel>(this.url.get(id));
  }

  set(item: EncodeDeviceModel) {
    return this.requestService.put<
      EncodeDeviceModel,
      HowellResponse<EncodeDeviceModel>
    >(
      this.url.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.encodeDevice)
    );
  }

  del(id: string) {
    return this.requestService.delete<EncodeDeviceModel>(this.url.del(id));
  }

  list(item: GetEncodeDevicesParams) {
    return this.requestService.post<
      GetEncodeDevicesParams,
      HowellResponse<PagedList<EncodeDeviceModel>>
    >(this.url.list(), item);
  }

  protocol() {
    return this.requestService.get<Protocol[]>(this.url.protocol());
  }
}

@Injectable({
  providedIn: "root",
})
export class CameraRequestService {
  url: url.ResourceCamera;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.ResourceCamera();
  }
  create(item: CameraModel) {
    return this.requestService.post<CameraModel, HowellResponse<CameraModel>>(
      this.url.create(),
      SaveModel.toModel(item, SaveModel.formMustField.camera)
    );
  }

  get(id: string) {
    return this.requestService.get<CameraModel>(this.url.get(id));
  }

  set(item: CameraModel) {
    return this.requestService.put<CameraModel, HowellResponse<CameraModel>>(
      this.url.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.camera)
    );
  }

  del(id: string) {
    return this.requestService.delete<CameraModel>(this.url.del(id));
  }

  list(item: GetCamerasParams) {
    return this.requestService.post<
      GetCamerasParams,
      HowellResponse<PagedList<CameraModel>>
    >(this.url.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class AIModelRequestService {
  url: url.ResourceCameraAIModel;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.ResourceCameraAIModel();
  }
  create(cameraId: string, aiModelId: string) {
    return this.requestService.post<
      CameraAIModel,
      HowellResponse<CameraAIModel>
    >(this.url.create(cameraId, aiModelId));
  }

  get(cameraId: string, aiModelId: string) {
    return this.requestService.get<CameraAIModel>(
      this.url.get(cameraId, aiModelId)
    );
  }

  list(cameraId: string) {
    return this.requestService.get<CameraAIModel[]>(this.url.list(cameraId));
  }

  del(cameraId: string, aiModelId: string) {
    return this.requestService.delete<CameraAIModel>(
      this.url.del(cameraId, aiModelId)
    );
  }

  copyTo(param: BatchCopyRequest, tagCameraId: string) {
    return this.requestService.post<
      BatchCopyRequest,
      HowellResponse<BatchResult>
    >(this.url.copy(tagCameraId), param);
  }
}

@Injectable({
  providedIn: "root",
})
export class LabelRequestService {
  url: url.Label;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.Label();
  }
  create(item: ResourceLabelModel) {
    return this.requestService.post<
      ResourceLabelModel,
      HowellResponse<ResourceLabelModel>
    >(this.url.create(), item);
  }

  get(id: string) {
    return this.requestService.get<ResourceLabelModel>(this.url.get(id));
  }

  set(item: ResourceLabelModel) {
    return this.requestService.put<ResourceLabelModel, ResourceLabelModel>(
      this.url.edit(item.Id),
      item
    );
  }

  del(id: string) {
    return this.requestService.delete<ResourceLabelModel>(this.url.del(id));
  }

  list(item: GetResourceLabelsParams) {
    return this.requestService.post<
      GetResourceLabelsParams,
      HowellResponse<PagedList<ResourceLabelModel>>
    >(this.url.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class ResourceLabelRequestService {
  url: url.ResourceLabel;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.ResourceLabel();
  }
  create(sourceId: string, labelId: string) {
    return this.requestService.post<
      ResourceLabelModel,
      HowellResponse<ResourceLabelModel>
    >(this.url.create(sourceId, labelId));
  }

  get(sourceId: string, labelId: string) {
    return this.requestService.get<ResourceLabelModel>(
      this.url.get(sourceId, labelId)
    );
  }

  // list(sourceId:string){
  //     return this.requestService.get<ResourceLabelModel[]>>(this.url.list(sourceId));
  // }

  del(sourceId: string, labelId: string) {
    return this.requestService.delete<ResourceLabelModel>(
      this.url.del(sourceId, labelId)
    );
  }
}

@Injectable({
  providedIn: "root",
})
export class ResourceMediumRequestService {
  url: url.MediumPicture;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.MediumPicture();
  }

  binary() {
    return this.url.binary();
  }

  getJPG(id: string) {
    return this.url.getJPG(id);
  }
  getData(id: string) {
    return this.url.getData(id);
  }
}

@Injectable({
  providedIn: "root",
})
export class ResourceSRServersRequestService {
  url: SRService;
  user = new SessionUser();
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new SRService();
  }

  async PreviewUrls(params: GetPreviewUrlParams) {
    const response = await this.requestService
      .post<GetPreviewUrlParams, HowellResponse<VideoUrl>>(
        this.url.preview(),
        params
      )
      .toPromise();
    if (response.Data.Url) {
      let args = VideoPlayArgs.FromUrl(response.Data.Url);
      if (response.Data.Username) {
        args.username = response.Data.Username;
      }
      if (response.Data.Password) {
        args.password = response.Data.Password;
      }
      let url = "";
      if (!(args.username && args.password)) {
        url = args.toString(this.user.videoUserPwd);
      } else {
        url = args.toString();
      }
      response.Data.Url = url;
    }
    if (isIPAddressOrLocalhost()) {
      const host = document.location.hostname;
      const port = document.location.port;
      response.Data.WebUrl =
        "http://" + host + ":" + port + "/video/wsplayer/wsplayer.html";
    }
    return response;
  }

  async VodUrls(params: GetVodUrlParams) {
    const response = await this.requestService
      .post<GetVodUrlParams, HowellResponse<VideoUrl>>(this.url.vod(), params)
      .toPromise();
    if (response.Data.Url) {
      let args = VideoPlayArgs.FromUrl(response.Data.Url);
      if (response.Data.Username) {
        args.username = response.Data.Username;
      }
      if (response.Data.Password) {
        args.password = response.Data.Password;
      }
      let url = "";
      if (!(args.username && args.password)) {
        url = args.toString(this.user.videoUserPwd);
      } else {
        url = args.toString();
      }
      response.Data.Url = url;
    }
    if (isIPAddressOrLocalhost()) {
      const host = document.location.hostname;
      const port = document.location.port;
      response.Data.WebUrl =
        "http://" + host + ":" + port + "/video/wsplayer/wsplayer.html";
    }
    return response;
  }
}

@Injectable({
  providedIn: "root",
})
export class StationResourceSRServersRequestService {
  url: StationSRService;
  user = new SessionUser();
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new StationSRService();
  }

  async PreviewUrls(params: GetPreviewUrlParams) {
    // return this.requestService.post<VideoUrl>(this.url.preview(), params);
    const response = await this.requestService
      .post<GetPreviewUrlParams, HowellResponse<VideoUrl>>(
        this.url.preview(),
        params
      )
      .toPromise();
    if (response.Data.Url) {
      let args = VideoPlayArgs.FromUrl(response.Data.Url);
      if (response.Data.Username) {
        args.username = response.Data.Username;
      }
      if (response.Data.Password) {
        args.password = response.Data.Password;
      }
      let url = "";
      if (!(args.username && args.password)) {
        url = args.toString(this.user.videoUserPwd);
      } else {
        url = args.toString();
      }
      response.Data.Url = url;
    }
    if (isIPAddressOrLocalhost()) {
      const host = document.location.hostname;
      const port = document.location.port;
      response.Data.WebUrl =
        "http://" + host + ":" + port + "/video/wsplayer/wsplayer.html";
    }
    return response;
  }

  async VodUrls(params: GetVodUrlParams) {
    // return this.requestService.post<VideoUrl>(this.url.vod(), params);
    const response = await this.requestService
      .post<GetVodUrlParams, HowellResponse<VideoUrl>>(this.url.vod(), params)
      .toPromise();
    if (response.Data.Url) {
      let args = VideoPlayArgs.FromUrl(response.Data.Url);
      if (response.Data.Username) {
        args.username = response.Data.Username;
      }
      if (response.Data.Password) {
        args.password = response.Data.Password;
      }
      let url = "";
      if (!(args.username && args.password)) {
        url = args.toString(this.user.videoUserPwd);
      } else {
        url = args.toString();
      }
      response.Data.Url = url;
    }
    if (isIPAddressOrLocalhost()) {
      const host = document.location.hostname;
      const port = document.location.port;
      response.Data.WebUrl =
        "http://" + host + ":" + port + "/video/wsplayer/wsplayer.html";
    }
    return response;
  }
}

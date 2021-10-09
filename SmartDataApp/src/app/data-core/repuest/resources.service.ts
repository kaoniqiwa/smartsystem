import { Injectable } from "@angular/core";
import { Resource as ResourceModel } from "../model/aiop/resource";
import { EncodeDevice as EncodeDeviceModel } from "../model/aiop/encode-device";
import { ResourceLabel as ResourceLabelModel } from "../model/aiop/resource-label";
import {
  GetEncodeDevicesParams,
  GetCamerasParams,
} from "../model/aiop/encode-devices-params";
import { Protocol } from "../model/aiop/protocol";
import { AiopCamera as CameraModel } from "../model/aiop/camera";
import { CameraAIModel } from "../model/aiop/camera-ai-model";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { GetResourcesParams } from "../model/aiop/resources-params";
import { GetResourceLabelsParams } from "../model/aiop/resource-labels-params";
import { SaveModel } from "../model/save-model";
import { BatchCopyRequest } from "../model/aiop/ai-models-params";
import { BatchResult } from "../model/batch";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { AIOPSRServiceUrl } from "../url/aiop/sr-server";
import { SRServiceUrl as StationSRServiceUrl } from "../url/waste-regulation/sr-server";
import {
  GetPreviewUrlParams,
  GetVodUrlParams,
  VideoUrl,
} from "../model/aiop/video-url";
import { SessionUser } from "../../common/tool/session-user";
import { VideoPlayArgs } from "../../video/mode";
import { isIPAddressOrLocalhost } from "../../common/tool/tool.service";
import {
  AIOPLabelUrl,
  AIOPMediumPictureUrl,
  AIOPResourceCameraAIModelUrl,
  AIOPResourceCameraUrl,
  AIOPResourceEncodeDeviceUrl,
  AIOPResourceLabelUrl,
  AIOPResourceUrl,
} from "../url/aiop/resources";

@Injectable({
  providedIn: "root",
})
export class ResourceRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(item: ResourceModel) {
    return this.requestService.post<ResourceModel, ResourceModel>(
      AIOPResourceUrl.create(),
      SaveModel.toModel(item, SaveModel.formMustField.resource)
    );
  }

  get(id: string) {
    return this.requestService.get<ResourceModel>(AIOPResourceUrl.get(id));
  }

  set(item: ResourceModel) {
    return this.requestService.put<ResourceModel, ResourceModel>(
      AIOPResourceUrl.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.resource)
    );
  }

  del(id: string) {
    return this.requestService.delete<ResourceModel>(AIOPResourceUrl.del(id));
  }

  list(item: GetResourcesParams) {
    return this.requestService.post<
      GetResourcesParams,
      HowellResponse<PagedList<ResourceModel>>
    >(AIOPResourceUrl.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class EncodeDeviceRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(item: EncodeDeviceModel) {
    return this.requestService.post<
      EncodeDeviceModel,
      HowellResponse<EncodeDeviceModel>
    >(
      AIOPResourceEncodeDeviceUrl.create(),
      SaveModel.toModel(item, SaveModel.formMustField.encodeDevice)
    );
  }

  get(id: string) {
    return this.requestService.get<EncodeDeviceModel>(
      AIOPResourceEncodeDeviceUrl.get(id)
    );
  }

  set(item: EncodeDeviceModel) {
    return this.requestService.put<
      EncodeDeviceModel,
      HowellResponse<EncodeDeviceModel>
    >(
      AIOPResourceEncodeDeviceUrl.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.encodeDevice)
    );
  }

  del(id: string) {
    return this.requestService.delete<EncodeDeviceModel>(
      AIOPResourceEncodeDeviceUrl.del(id)
    );
  }

  list(item: GetEncodeDevicesParams) {
    return this.requestService.post<
      GetEncodeDevicesParams,
      HowellResponse<PagedList<EncodeDeviceModel>>
    >(AIOPResourceEncodeDeviceUrl.list(), item);
  }

  protocol() {
    return this.requestService.get<Protocol[]>(
      AIOPResourceEncodeDeviceUrl.protocol()
    );
  }
}

@Injectable({
  providedIn: "root",
})
export class AiopCameraRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(item: CameraModel) {
    return this.requestService.post<CameraModel, HowellResponse<CameraModel>>(
      AIOPResourceCameraUrl.create(),
      SaveModel.toModel(item, SaveModel.formMustField.camera)
    );
  }

  get(id: string) {
    return this.requestService.get<CameraModel>(AIOPResourceCameraUrl.get(id));
  }

  set(item: CameraModel) {
    return this.requestService.put<CameraModel, HowellResponse<CameraModel>>(
      AIOPResourceCameraUrl.edit(item.Id),
      SaveModel.toModel(item, SaveModel.formMustField.camera)
    );
  }

  del(id: string) {
    return this.requestService.delete<CameraModel>(
      AIOPResourceCameraUrl.del(id)
    );
  }

  list(item: GetCamerasParams) {
    return this.requestService.post<
      GetCamerasParams,
      HowellResponse<PagedList<CameraModel>>
    >(AIOPResourceCameraUrl.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class AIModelRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(cameraId: string, aiModelId: string) {
    return this.requestService.post<
      CameraAIModel,
      HowellResponse<CameraAIModel>
    >(AIOPResourceCameraAIModelUrl.create(cameraId, aiModelId));
  }

  get(cameraId: string, aiModelId: string) {
    return this.requestService.get<CameraAIModel>(
      AIOPResourceCameraAIModelUrl.get(cameraId, aiModelId)
    );
  }

  list(cameraId: string) {
    return this.requestService.get<CameraAIModel[]>(
      AIOPResourceCameraAIModelUrl.list(cameraId)
    );
  }

  del(cameraId: string, aiModelId: string) {
    return this.requestService.delete<CameraAIModel>(
      AIOPResourceCameraAIModelUrl.del(cameraId, aiModelId)
    );
  }

  copyTo(param: BatchCopyRequest, tagCameraId: string) {
    return this.requestService.post<
      BatchCopyRequest,
      HowellResponse<BatchResult>
    >(AIOPResourceCameraAIModelUrl.copy(tagCameraId), param);
  }
}

@Injectable({
  providedIn: "root",
})
export class LabelRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(item: ResourceLabelModel) {
    return this.requestService.post<
      ResourceLabelModel,
      HowellResponse<ResourceLabelModel>
    >(AIOPLabelUrl.create(), item);
  }

  get(id: string) {
    return this.requestService.get<ResourceLabelModel>(AIOPLabelUrl.get(id));
  }

  set(item: ResourceLabelModel) {
    return this.requestService.put<ResourceLabelModel, ResourceLabelModel>(
      AIOPLabelUrl.edit(item.Id),
      item
    );
  }

  del(id: string) {
    return this.requestService.delete<ResourceLabelModel>(AIOPLabelUrl.del(id));
  }

  list(item: GetResourceLabelsParams) {
    return this.requestService.post<
      GetResourceLabelsParams,
      HowellResponse<PagedList<ResourceLabelModel>>
    >(AIOPLabelUrl.list(), item);
  }
}

@Injectable({
  providedIn: "root",
})
export class ResourceLabelRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  create(sourceId: string, labelId: string) {
    return this.requestService.post<
      ResourceLabelModel,
      HowellResponse<ResourceLabelModel>
    >(AIOPResourceLabelUrl.create(sourceId, labelId));
  }

  get(sourceId: string, labelId: string) {
    return this.requestService.get<ResourceLabelModel>(
      AIOPResourceLabelUrl.get(sourceId, labelId)
    );
  }

  // list(sourceId:string){
  //     return this.requestService.get<ResourceLabelModel[]>>(AIOPResourceLabelUrl.list(sourceId));
  // }

  del(sourceId: string, labelId: string) {
    return this.requestService.delete<ResourceLabelModel>(
      AIOPResourceLabelUrl.del(sourceId, labelId)
    );
  }
}

@Injectable({
  providedIn: "root",
})
export class ResourceMediumRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  static default = "/assets/img/timg-pic.jpg";
  default = "/assets/img/timg-pic.jpg";

  static binary() {
    return AIOPMediumPictureUrl.binary();
  }

  static getJPG(id: string) {
    if (!id) return this.default;
    return AIOPMediumPictureUrl.getJPG(id);
  }
  static getData(id: string) {
    if (!id) return this.default;
    return AIOPMediumPictureUrl.getData(id);
  }

  getData(id: string) {
    if (!id) return this.default;
    return AIOPMediumPictureUrl.getData(id);
  }
}

@Injectable({
  providedIn: "root",
})
export class ResourceSRServersRequestService {
  user = new SessionUser();
  constructor(private requestService: HowellAuthHttpService) {}

  async PreviewUrls(params: GetPreviewUrlParams) {
    const response = await this.requestService
      .post<GetPreviewUrlParams, HowellResponse<VideoUrl>>(
        AIOPSRServiceUrl.preview(),
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
      .post<GetVodUrlParams, HowellResponse<VideoUrl>>(
        AIOPSRServiceUrl.vod(),
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
}

@Injectable({
  providedIn: "root",
})
export class StationResourceSRServersRequestService {
  user = new SessionUser();
  constructor(private requestService: HowellAuthHttpService) {}

  async PreviewUrls(params: GetPreviewUrlParams) {
    // return this.requestService.post<VideoUrl>(StationSRServiceUrl.preview(), params);
    const response = await this.requestService
      .post<GetPreviewUrlParams, HowellResponse<VideoUrl>>(
        StationSRServiceUrl.preview(),
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
    // return this.requestService.post<VideoUrl>(StationSRServiceUrl.vod(), params);
    const response = await this.requestService
      .post<GetVodUrlParams, HowellResponse<VideoUrl>>(
        StationSRServiceUrl.vod(),
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
}

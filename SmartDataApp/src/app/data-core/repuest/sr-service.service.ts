import { AIOPSRServiceUrl } from "../url/aiop/sr-server";
import { HowellResponse } from "../model/response";
import { SRServer } from "../model/aiop/sr-server";
import {
  VideoUrl,
  GetPreviewUrlParams,
  GetVodUrlParams,
} from "../model/aiop/video-url";
import { Injectable } from "@angular/core";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { SaveModel } from "../model/save-model";
import { VideoPlayArgs } from "../../../app/video/mode";
import { SessionUser } from "../../../app/common/tool/session-user";
import { isIPAddressOrLocalhost } from "../../common/tool/tool.service";
import { isIP } from "net";

@Injectable({
  providedIn: "root",
})
export class SRServiceRequestSerivce {
  user = new SessionUser();
  constructor(private requestService: HowellAuthHttpService) {}

  create(item: SRServer) {
    return this.requestService.post<SRServer, HowellResponse<SRServer>>(
      AIOPSRServiceUrl.create(),
      SaveModel.toModel(item, SaveModel.formMustField.srServer)
    );
  }

  get(id: string) {
    return this.requestService.get<SRServer>(AIOPSRServiceUrl.get(id));
  }

  set(item: SRServer) {
    return this.requestService.put<SRServer, HowellResponse<SRServer>>(
      AIOPSRServiceUrl.edit(item.Id),
      item
    );
  }

  del(id: string) {
    return this.requestService.delete<SRServer>(AIOPSRServiceUrl.del(id));
  }

  list() {
    return this.requestService.get<SRServer[]>(AIOPSRServiceUrl.list());
  }

  sync(id: string) {
    return this.requestService.post<any>(AIOPSRServiceUrl.sync(id));
  }

  async preview(item: GetPreviewUrlParams) {
    const response = await this.requestService
      .post<GetPreviewUrlParams, HowellResponse<VideoUrl>>(
        AIOPSRServiceUrl.preview(),
        item
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

  async vod(item: GetVodUrlParams) {
    const response = await this.requestService
      .post<GetVodUrlParams, HowellResponse<VideoUrl>>(
        AIOPSRServiceUrl.vod(),
        item
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

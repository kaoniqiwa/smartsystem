import { SRService as SRServiceUrl } from "../url/aiop/sr-server";
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
import { isIPAddressOrLocalhost } from "src/app/common/tool/tool.service";
import { isIP } from "net";

@Injectable({
  providedIn: "root",
})
export class SRServiceRequestSerivce {
  url: SRServiceUrl;
  user = new SessionUser();
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new SRServiceUrl();
  }

  create(item: SRServer) {
    return this.requestService.post<SRServer, HowellResponse<SRServer>>(
      this.url.create(),
      SaveModel.toModel(item, SaveModel.formMustField.srServer)
    );
  }

  get(id: string) {
    return this.requestService.get<SRServer>(this.url.get(id));
  }

  set(item: SRServer) {
    return this.requestService.put<SRServer, HowellResponse<SRServer>>(
      this.url.edit(item.Id),
      item
    );
  }

  del(id: string) {
    return this.requestService.delete<SRServer>(this.url.del(id));
  }

  list() {
    return this.requestService.get<SRServer[]>(this.url.list());
  }

  sync(id: string) {
    return this.requestService.post<any>(this.url.sync(id));
  }

  async preview(item: GetPreviewUrlParams) {
    const response = await this.requestService
      .post<GetPreviewUrlParams, HowellResponse<VideoUrl>>(
        this.url.preview(),
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
      .post<GetVodUrlParams, HowellResponse<VideoUrl>>(this.url.vod(), item)
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

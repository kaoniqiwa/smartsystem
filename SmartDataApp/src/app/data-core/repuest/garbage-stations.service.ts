import { Injectable } from "@angular/core";
import { GarbageStation } from "../model/aiop/garbage-station.model";
import { HowellResponse } from "../model/response";
import { GarbageStationsUrl } from "../url/waste-regulation/garbage-station";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({
  providedIn: "root",
})
export class RequestGarbageStationsService {
  constructor(private httpService: HowellAuthHttpService) {}
  async create(item: GarbageStation) {
    let res = await this.httpService
      .post<GarbageStation, HowellResponse<GarbageStation>>(
        GarbageStationsUrl.create(),
        item
      )
      .toPromise();
    console.log(res);
    return res;
  }
}

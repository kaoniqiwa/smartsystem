import { Injectable } from "@angular/core";
import { GarbageStationType } from "../model/aiop/garbage-station-type.model";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
import { GarbageStationTypeUrl } from "../url/waste-regulation/garbage-station";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({
  providedIn: "root",
})
export class RequestGarbageStationsTypeService {
  constructor(private httpService: HowellAuthHttpService) {}

  //   async create(item: GarbageStationType) {
  //     let response = await this.requestService
  //       .post<GarbageStationType, HowellResponse<GarbageStationType>>(
  //         GarbageStationTypeUrl.create(),
  //         SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
  //       )
  //       .toPromise();

  //     return ServiceHelper.ResponseProcess(response, GarbageStationType);
  //   }

  //   async get(type: string) {
  //     let response = await this.requestService.get<GarbageStationType>(
  //       GarbageStationTypeUrl.get(type)
  //     );
  //   }

  //   async set(item: GarbageStationType) {
  //     let response = await this.requestService
  //       .put<GarbageStationType, HowellResponse<GarbageStationType>>(
  //         GarbageStationTypeUrl.edit(item.Type + ""),
  //         SaveModel.toModel(item, SaveModel.formMustField.garbageStationType)
  //       )
  //       .toPromise();

  //     return ServiceHelper.ResponseProcess(response, GarbageStationType);
  //   }

  //   async del(type: string) {
  //     let response = await this.requestService
  //       .delete<GarbageStationType>(GarbageStationTypeUrl.del(type))
  //       .toPromise();

  //     return ServiceHelper.ResponseProcess(response, GarbageStationType);
  //   }

  async list() {
    let response = await this.httpService
      .get<GarbageStationType[]>(GarbageStationTypeUrl.list())
      .toPromise();

    return response.Data;
  }
}

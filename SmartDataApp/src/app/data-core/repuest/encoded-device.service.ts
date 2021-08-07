import { Injectable } from "@angular/core";
import { EncodeDevice } from "../model/aiop/encoded-device.model";
import { PagedList } from "../model/page";
import { HowellResponse } from "../model/response";
import { EncodedDeviceParams } from "../params/encoded-device.params";
import { AIOPResourceEncodeDeviceUrl } from "../url/aiop/resources";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({ providedIn: "root" })
export class RequestEncodeDeviceService {
  constructor(private httpService: HowellAuthHttpService) {}

  // create(item: EncodeDeviceModel) {
  //   return this.requestService.post<
  //     EncodeDeviceModel,
  //     HowellResponse<EncodeDeviceModel>
  //   >(
  //     AIOPResourceEncodeDeviceUrl.create(),
  //     SaveModel.toModel(item, SaveModel.formMustField.encodeDevice)
  //   );
  // }

  // get(id: string) {
  //   return this.requestService.get<EncodeDeviceModel>(
  //     AIOPResourceEncodeDeviceUrl.get(id)
  //   );
  // }

  // set(item: EncodeDeviceModel) {
  //   return this.requestService.put<
  //     EncodeDeviceModel,
  //     HowellResponse<EncodeDeviceModel>
  //   >(
  //     AIOPResourceEncodeDeviceUrl.edit(item.Id),
  //     SaveModel.toModel(item, SaveModel.formMustField.encodeDevice)
  //   );
  // }

  // del(id: string) {
  //   return this.requestService.delete<EncodeDeviceModel>(
  //     AIOPResourceEncodeDeviceUrl.del(id)
  //   );
  // }

  list(item: EncodedDeviceParams) {
    return this.httpService
      .post<EncodedDeviceParams, HowellResponse<PagedList<EncodeDevice>>>(
        AIOPResourceEncodeDeviceUrl.list(),
        item
      )
      .toPromise();
  }
  // protocol() {
  //   return this.requestService.get<Protocol[]>(
  //     AIOPResourceEncodeDeviceUrl.protocol()
  //   );
  // }
}

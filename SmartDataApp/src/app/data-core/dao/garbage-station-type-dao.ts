import { AppCaChe } from "../../common/tool/app-cache/app-cache";
import { GarbageStationType } from "../model/waste-regulation/garbage-station-type";
import { GarbageStationTypeRequestService } from "../repuest/garbage-station.service";


export class GarbageStationTypeDao {
  cache = new AppCaChe(60 * 30 * 1000);
  readonly type = 'GarbageStationType';
  constructor(private requestService: GarbageStationTypeRequestService) { }

  async garbageStationType() {
    var result = this.cache.get<GarbageStationType[]>(this.type);
    if (!result) {
      const response = await this.requestService.list().toPromise();
      this.cache.set(this.type, response.Data);
      result = response.Data;
    }
    return result;
  }
}
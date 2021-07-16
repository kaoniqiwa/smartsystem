import { Injectable } from "@angular/core";
import { GarbageStationTypeRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
@Injectable()
export class DataService {
  types: GarbageStationType[];
  constructor(private typeService: GarbageStationTypeRequestService) {}

  async requestGarbageStationType() {
    const response = await this.typeService.list();
    return response;
  }

  async addGarbageStationType(item: GarbageStationType) {
    const response = await this.typeService.create(item);
    return response;
  }

  async editGarbageStationType(item: GarbageStationType) {
    const response = await this.typeService.set(item);
    return response;
  }

  async delGarbageStationType(type: string) {
    const response = await this.typeService.del(type);
    return !!response;
  }
}

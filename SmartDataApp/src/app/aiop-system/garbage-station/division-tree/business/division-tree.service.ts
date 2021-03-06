import { Injectable } from "@angular/core";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import {
  Division,
  GetDivisionsParams,
} from "../../../../data-core/model/waste-regulation/division";
import {
  GarbageStation,
  GetGarbageStationsParams,
} from "../../../../data-core/model/waste-regulation/garbage-station";
@Injectable()
export class DivisionTreeSerevice {
  divisions = new Array<Division>();
  garbageStations = new Array<GarbageStation>();

  constructor(
    private divisionService: DivisionRequestService,
    private garbageStationService: GarbageStationRequestService
  ) {}

  async requestGarbageStation(ancestorId: string, divisionId?: string) {
    const param = new GetGarbageStationsParams();
    param.PageIndex = 1;
    if (ancestorId) param.AncestorId = ancestorId;
    if (divisionId) param.DivisionId = divisionId;
    param.PageSize = new ListAttribute().maxSize;
    const response = await this.garbageStationService.list(param);
    return response.Data;
  }

  /**
   * 获取区划列表
   * @returns
   */
  async requestDivision() {
    let divisionParams = new GetDivisionsParams();
    divisionParams.PageSize = 9999;
    const response = await this.divisionService.list(divisionParams);
    return response.Data;
  }
}

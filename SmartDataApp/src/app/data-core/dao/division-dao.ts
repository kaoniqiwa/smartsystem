import { DivisionRequestService } from "../../data-core/repuest/division.service";
import {
  Division,
  GetDivisionsParams,
} from "../model/waste-regulation/division";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { AppCaChe } from "../../common/tool/app-cache/app-cache";
import { Injectable } from "@angular/core";
@Injectable()
export class DivisionDao extends ListAttribute {
  cache = new AppCaChe(60 * 30 * 1000);
  readonly division = "Divisions";
  constructor(private requestService: DivisionRequestService) {
    super();
  }

  async allDivisions() {
    var result = this.cache.get<Division[]>(this.division);

    if (!result) {
      const response = await this.requestService.list();
      this.cache.set(this.division, response.Data);
      result = response.Data;
    } else {
      debugger;
    }
    return result;
  }
}

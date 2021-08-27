import {
  StatisticalDataBufferService,
  TimeUnitEnum,
} from "../../buffer/statistical-data-buffer";
import { Divisions, Division } from "./data";
import { BusinessParameter } from "../../../../../common/interface/IBusiness";
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
export class DivisionList extends BaseBusinessRefresh {
  constructor(
    dataServe: StatisticalDataBufferService,
    businessParameter?: BusinessParameter
  ) {
    super(dataServe, businessParameter);
  }

  async getData() {
    const divisionId = this.businessParameter.divisionId as string;
    const model = new Divisions();
    model.items = new Array();
    const ancestorDivisions = await (
        this.dataServe as StatisticalDataBufferService
      ).getAncestorDivisions(divisionId),
      divisions = await (
        this.dataServe as StatisticalDataBufferService
      ).getDivisions(divisionId);

    for (const d of ancestorDivisions) {
      const _ = new Division();
      _.id = d.Id;
      _.name = d.Name;
      _.divisionType = d.DivisionType;
      _.parentId = d.ParentId;
      _.root = false;
      model.items.push(_);
    }
    const ds = new Division();
    ds.id = divisions[0].Id;
    ds.name = divisions[0].Name;
    ds.divisionType = divisions[0].DivisionType;
    ds.parentId = divisions[0].ParentId;
    ds.root = true;
    model.items.push(ds);
    return model;
  }
}

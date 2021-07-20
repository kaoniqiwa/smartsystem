import { Injectable } from "@angular/core";
import { SessionUser } from "../../common/tool/session-user";
import { GarbageStation } from "../../data-core/model/waste-regulation/garbage-station";
import { Division } from "../../data-core/model/waste-regulation/division";
import { StatisticalDataBufferService } from "../../waste-regulation-system/index/business-card-grid/buffer/statistical-data-buffer";
import { DivisionType } from "../../data-core/model/enum";
@Injectable({
  providedIn: "root",
})
export class BusinessManageService {
  /**
   * 前台 投放点 事件记录及统计 业务管理
   */

  viewDivisionType = ViewDivisionTypeEnum.None;
  divisionId: string;
  station: GarbageStation;
  user: SessionUser;
  viewDivisionTypeEnum = ViewDivisionTypeEnum;
  constructor(private dataBufferService: StatisticalDataBufferService) {
    this.user = new SessionUser();
  }

  resetNone() {
    this.station = null;
    this.viewDivisionType = ViewDivisionTypeEnum.None;
  }

  getGarbageStations(divisionsId: string) {
    return this.dataBufferService.getGarbageStations(divisionsId);
  }

  getParentDivision() {
    return this.dataBufferService.ancestorDivisions(
      null,
      this.user.userDivision.pop().Id
    );
  }

  getchildrenDivision() {
    return this.dataBufferService.ancestorDivisions(
      this.user.userDivision.pop().Id
    );
  }

  divisionType(division: Division) {
    if (division)
      this.viewDivisionType =
        division.DivisionType == DivisionType.City
          ? ViewDivisionTypeEnum.City
          : ViewDivisionTypeEnum.None;
  }
}

export enum ViewDivisionTypeEnum {
  None,
  /**区 */
  City,
  /**县、街道 */
  // County,
  /**	居委会 */
  //Committees,
  /**地图投放点 */
  MapStation,
  /**主页数据列表 */
  TableLinkChild,
}

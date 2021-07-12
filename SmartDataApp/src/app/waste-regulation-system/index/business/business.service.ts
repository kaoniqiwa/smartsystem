import { Injectable } from "@angular/core";
import { StatisticalDataBufferService } from "../business-card-grid/buffer/statistical-data-buffer";
import { DivisionTypeEnum } from "../../../common/tool/enum-helper";
import { SessionUser } from "../../../common/tool/session-user";
import { DivisionBusinessService } from "../business-card-grid/division-business.service";
import { EventType } from "src/app/data-core/model/waste-regulation/event-number";
@Injectable()
export class BusinessService {
  user: SessionUser;
  logoTitle = "";
  divisionParam: {
    divisionType: number /**父 区划类别 */;
    divisionsIds: Array<string>;
  };
  illegalDropTopCardConfig: Array<any>; /**乱扔垃圾排名table */
  mixedIntoDropTopCardConfig: Array<any>; /**混合投放排名 table */
  illegalDropHistoryCardConfig: Array<any>; /**乱扔垃圾记录 折线图 */
  mixedIntoHistoryCardConfig: Array<any>; /**混合投放记录 折线图  */
  divisionCardConfig: Array<any>; /**区 街道 居委 列表 */
  stationDisposeScoreCardConfig: Array<any>; /**小包垃圾处置 table */
  devCardConfig: Array<any>; /**设备状态 */
  inspectionCardConfig: Array<any>; /**巡检 */
  divisionGarbageSpCardConfig: Array<any>; /**区划 投放点 状态数据 */
  illegalDropEventCardConfig: Array<any>; /**报警推送 */
  constructor(
    private bufferService: StatisticalDataBufferService,
    private divisionBusinessService: DivisionBusinessService
  ) {
    this.user = new SessionUser();
  }

  setLogoTitle() {
    this.logoTitle = this.user.userDivision.pop().Name;
  }

  initCardConfig() {
    this.divisionCard();
    this.illegalDropTopCard();
    //this.mixedIntoDropTopCard();
    this.illegalDropHistoryCard();
    this.mixedIntoHistoryCard();
    this.stationDisposeScoreCard();
    this.devCard();
    this.divisionGarbageSpCard();
    this.illegalDropEventCard();
  }

  async illegalDropEventCard() {
    const param = await this.eventDropTopCardParam();
    if (param.divisionType == DivisionTypeEnum.County) {
      this.illegalDropEventCardConfig = new Array();
      this.illegalDropEventCardConfig.push({
        business: "IllegalDropEvent",
        flipTime: 60,
        cardType: "ImageThemeCardComponent",
        state: false,
      });
    }
  }

  divisionGarbageSpCard() {
    this.divisionGarbageSpCardConfig = new Array();
    this.divisionGarbageSpCardConfig.push({
      business: "DivisionGarbageSpecification",
      cardType: "HintCardComponent",
      divisionId: this.user.userDivision.pop().Id,
      dataTime: 60,
      border: false,
    });
  }

  inspectionCard(divisionId?: string, stationId?: string) {
    if (stationId && divisionId)
      this.inspectionCardConfig = [
        {
          business: "GarbageStationInspection",
          cardType: "GalleryRollPageComponent",
          stationId: stationId,
          divisionId: divisionId,
          border: false,
        },
      ];
    else
      this.inspectionCardConfig = [
        {
          business: "GarbageStationInspection",
          cardType: "GalleryRollPageComponent",
          divisionId: divisionId || this.user.userDivision.pop().Id,
          border: false,
        },
      ];
  }

  devCard() {
    this.devCardConfig = new Array();
    this.devCardConfig.push({
      business: "DeviceStatusStatistic",
      cardType: "StateScaleCardComponent",
      dataTime: 60,
      divisionId: this.user.userDivision.pop().Id,
    });
  }

  stationDisposeScoreCard() {
    this.stationDisposeScoreCardConfig = new Array();
    this.stationDisposeScoreCardConfig.push({
      business: "StationDisposeScore",
      cardType: "OrderTableCardComponent",
      divisionId: this.user.userDivision.pop().Id,
      dataTime: 60,
    });
  }

  divisionCard() {
    this.divisionCardConfig = new Array();
    this.divisionCardConfig.push({
      business: "DivisionList",
      cardType: "HeaderSquareListComponent",
      divisionId: this.user.userDivision.pop().Id,
      border: false,
    });
  }

  async illegalDropHistoryCard() {
    this.illegalDropHistoryCardConfig = new Array();
    this.illegalDropHistoryCardConfig.push({
      business: "IllegalDropHistory",
      cardType: "LineEChartsCardComponent",
      divisionId: this.user.userDivision.pop().Id,
      flipTime: 60 * 3,
      dataTime: 12,
      eventType: EventType.IllegalDrop,
    });
  }

  async mixedIntoHistoryCard() {
    this.mixedIntoHistoryCardConfig = new Array();
    this.mixedIntoHistoryCardConfig.push({
      business: "MixedIntoHistory",
      cardType: "LineEChartsCardComponent",
      divisionId: this.user.userDivision.pop().Id,
      flipTime: 60 * 3,
      dataTime: 12,
      eventType: EventType.MixedInto,
    });
  }

  async illegalDropTopCard() {
    const param = await this.eventDropTopCardParam();
    this.user.userDivisionType = param.divisionType + "";
    this.illegalDropTopCardConfig = new Array();
    this.illegalDropTopCardConfig.push({
      business: "DropOrder",
      cardType: "OrderTableCardComponent",
      //divisionsIds: param.divisionsIds,
      divisionId: this.user.userDivision.pop().Id,
      dataTime: 60,
      eventType: EventType.IllegalDrop,
      divisionType: param.divisionType,
    });
    //默认行政区 用于事件卡片
    this.divisionBusinessService.eventDropCard.divisionType =
      param.divisionType;
    this.divisionBusinessService.eventDropCard.dropDivisionType =
      param.divisionType;
  }

  async mixedIntoDropTopCard() {
    const param = await this.eventDropTopCardParam();
    this.mixedIntoDropTopCardConfig = new Array();
    this.mixedIntoDropTopCardConfig.push({
      business: "MixedIntoDropOrder",
      cardType: "OrderTableCardComponent",
      //divisionsIds: param.divisionsIds,
      divisionId: this.user.userDivision.pop().Id,
      dataTime: 60,
      eventType: EventType.MixedInto,
      divisionType: param.divisionType,
    });
  }

  async eventDropTopCardParam() {
    if (this.divisionParam) return this.divisionParam;
    else {
      const parentDivision = await this.bufferService.ancestorDivisions(
          null,
          this.user.userDivision.pop().Id
        ),
        childrenDivision = await this.bufferService.ancestorDivisions(
          this.user.userDivision.pop().Id
        ),
        divisionsIds = new Array<string>();
      if (parentDivision[0].DivisionType == DivisionTypeEnum.City)
        childrenDivision
          .filter(
            (d) =>
              d.DivisionType == DivisionTypeEnum.County &&
              d.ParentId == parentDivision[0].Id
          )
          .map((f) => divisionsIds.push(f.Id));
      else if (parentDivision[0].DivisionType == DivisionTypeEnum.County)
        childrenDivision
          .filter(
            (d) =>
              d.DivisionType == DivisionTypeEnum.Committees &&
              d.ParentId == parentDivision[0].Id
          )
          .map((f) => divisionsIds.push(f.Id));
      this.divisionParam = {
        divisionType: parentDivision[0].DivisionType,
        divisionsIds: divisionsIds,
      };
      return this.divisionParam;
    }
  }
}

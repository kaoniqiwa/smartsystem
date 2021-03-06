import { Injectable } from "@angular/core";
import { StatisticalDataBufferService } from "../business-card-grid/buffer/statistical-data-buffer";
import { SessionUser } from "../../../common/tool/session-user";
import { DivisionBusinessService } from "../business-card-grid/division-business.service";
import { DivisionType, EventType } from "../../../data-core/model/enum";
import { IBusinessConfig } from "src/app/shared-module/card-component/business-card-factory";

// 垃圾滞留配置信息
import * as garbageRetentionRankConfig from "./config/garbage-retention-rank.json";

@Injectable()
export class IndexBusinessService {
  user: SessionUser;
  logoTitle = "";
  divisionParam: {
    divisionType: number /**父 区划类别 */;
    divisionsIds: Array<string>;
  };
  illegalDropMixIntoRankConfig: Array<IBusinessConfig>; /**垃圾落地排名table */
  mixedIntoDropTopCardConfig: Array<IBusinessConfig>; /**混合投放排名 table */
  illegalDropHistoryCardConfig: Array<IBusinessConfig>; /**垃圾落地记录 折线图 */
  mixedIntoHistoryCardConfig: Array<IBusinessConfig>; /**混合投放记录 折线图  */
  divisionCardConfig: Array<IBusinessConfig>; /**区 街道 居委 列表 */
  garbageDisposalRankConfig: Array<IBusinessConfig>; /**小包垃圾处置 table */
  devCardConfig: Array<IBusinessConfig>; /**设备状态 */
  inspectionCardConfig: Array<IBusinessConfig>; /**巡检 */
  divisionGarbageSpCardConfig: Array<IBusinessConfig>; /**区划 投放点 状态数据 */
  illegalDropEventCardConfig: Array<IBusinessConfig>; /**报警推送 */
  garbageNumberCompareCardConfig: Array<IBusinessConfig>;
  taskNumberCardConfig: Array<IBusinessConfig>;

  garbageRententionCardConfig?: Array<IBusinessConfig>;

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
    this.illegalDropMixIntoRankCard();
    //this.mixedIntoDropTopCard();

    this.illegalDropHistoryCard();
    this.mixedIntoHistoryCard();
    this.garbageDisposalRankCard();
    this.devCard();
    this.divisionGarbageSpCard();
    this.initTaskNumberCard();

    this.initGarbageRententionRankCard();
    // if (this.user.userDivisionType == DivisionType.County) {
    //   this.illegalDropEventCard();
    // } else {
    //   this.garbageNumberCompareCard();
    // }
  }

  initGarbageRententionRankCard() {
    this.garbageRententionCardConfig = [
      {
        business: garbageRetentionRankConfig.business,
        cardType: garbageRetentionRankConfig.cardType,
      },
    ];
  }

  initTaskNumberCard() {
    this.taskNumberCardConfig = [
      {
        business: "GarbageTaskNumberBusiness",
        cardType: "GarbageTaskNumberCardComponent",
        flipTime: 15,
      },
    ];
  }

  /** 垃圾数量对比 */
  async garbageNumberCompareCard() {
    this.garbageNumberCompareCardConfig = new Array();
  }
  /** 垃圾落地事件 */
  async illegalDropEventCard() {
    this.illegalDropEventCardConfig = new Array();
    this.illegalDropEventCardConfig.push({
      business: "IllegalDropEvent",
      flipTime: 60,
      cardType: "ImageThemeCardComponent",
      state: false,
    });
  }

  async EventProcessCard() {}

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

  /**
   *  垃圾落地/混合投放排行榜
   */
  async illegalDropMixIntoRankCard() {
    this.illegalDropMixIntoRankConfig = new Array();
    this.illegalDropMixIntoRankConfig.push({
      business: "EventDropOrder",
      cardType: "OrderTableCardComponent",
      //divisionsIds: param.divisionsIds,
      divisionId: this.user.userDivision[0].Id,
      dataTime: 60,
      eventType: EventType.IllegalDrop,
      divisionType: this.user.userDivisionType,
    });
    //默认行政区 用于事件卡片
    this.divisionBusinessService.eventDropCard.divisionType =
      this.user.userDivisionType;
    this.divisionBusinessService.eventDropCard.dropDivisionType =
      this.user.userDivisionType;
  }

  /**
   * 小包垃圾处置排行榜
   */
  garbageDisposalRankCard() {
    this.garbageDisposalRankConfig = new Array();
    this.garbageDisposalRankConfig.push({
      business: "GarbageDisposalRank",
      cardType: "OrderTableCardComponent",
      divisionId: this.user.userDivision.pop().Id,
      dataTime: 60,
    });
  }

  async mixedIntoDropTopCard() {
    this.mixedIntoDropTopCardConfig = new Array();
    this.mixedIntoDropTopCardConfig.push({
      business: "MixedIntoDropOrder",
      cardType: "OrderTableCardComponent",
      //divisionsIds: param.divisionsIds,
      divisionId: this.user.userDivision.pop().Id,
      dataTime: 60,
      eventType: EventType.MixedInto,
      divisionType: this.user.userDivisionType,
    });
  }
}

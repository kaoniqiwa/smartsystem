import { Injectable } from "@angular/core";
import { StatisticalDataBufferService } from "../business-card-grid/buffer/statistical-data-buffer";
import { DivisionTypeEnum, EventTypeEnum } from "../../../common/tool/enum-helper";
import { SessionUser } from "../../../common/tool/session-user";
@Injectable()
export class BusinessService {
    user: SessionUser;
    logoTitle = '生活垃圾分类全程监管平台';
    divisionParam: {
        divisionType: number,/**父 区划类别 */
        divisionsIds: Array<string>
    }
    illegalDropTopCardConfig: Array<any>;/**乱扔垃圾排名table */
    mixedIntoDropTopCardConfig: Array<any>;/**混合投放排名 table */
    illegalDropHistoryCardConfig: Array<any>;/**乱扔垃圾记录 折线图 */
    mixedIntoHistoryCardConfig: Array<any>;/**混合投放记录 折线图  */
    divisionCardConfig: Array<any>;/**区 街道 居委 列表 */
    stationDisposeScoreCardConfig: Array<any>;/**小包垃圾处置 table */
    devCardConfig: Array<any>;/**设备状态 */
    inspectionCardConfig: Array<any>;/**巡检 */
    divisionGarbageSpCardConfig: Array<any>;/**区划 投放点 状态数据 */
    constructor(private bufferService: StatisticalDataBufferService) {
        this.user = new SessionUser();
    }

    setLogoTitle() {
        this.logoTitle = this.user.userDivision.pop().Name + '生活垃圾分类全程监管平台';
    }

    initCardConfig() {
        this.divisionCard();
        this.illegalDropTopCard();
        this.mixedIntoDropTopCard();
        this.illegalDropHistoryCard();
        this.mixedIntoHistoryCard();
        this.stationDisposeScoreCard();
        this.devCard();
        this.inspectionCard();
        this.divisionGarbageSpCard();
    }

    divisionGarbageSpCard() {
        this.divisionGarbageSpCardConfig = new Array();
        this.divisionGarbageSpCardConfig.push({
            business: 'DivisionGarbageSpecification',
            cardType: 'HintCardComponent',
            divisionId: this.user.userDivision.pop().Id,
            dataTime: 60,
            border: false
        });
    }

    inspectionCard(divisionId?: string) {
        this.inspectionCardConfig = [{
            business: 'GarbageStationInspection',
            cardType: 'GalleryRollPageComponent',
            divisionId: divisionId || this.user.userDivision.pop().Id,
            border: false
        }];
    }

    devCard() {
        this.devCardConfig = new Array();
        this.devCardConfig.push({
            business: 'DeviceStatusStatistic',
            cardType: 'StateScaleCardComponent',
            dataTime: 60,
            divisionId: this.user.userDivision.pop().Id,
        });

    }

    stationDisposeScoreCard() {
        this.stationDisposeScoreCardConfig = new Array();
        this.stationDisposeScoreCardConfig.push({
            business: 'StationDisposeScore',
            cardType: 'OrderTableCardComponent',
            divisionId: this.user.userDivision.pop().Id,
            dataTime: 60
        });
    }

    divisionCard() {
        this.divisionCardConfig = new Array();
        this.divisionCardConfig.push({
            business: 'DivisionList',
            cardType: 'HeaderSquareListComponent',
            divisionId: this.user.userDivision.pop().Id,
            border: false
        });
    }

    async illegalDropHistoryCard() {
        this.illegalDropHistoryCardConfig = new Array();
        this.illegalDropHistoryCardConfig.push({
            business: 'IllegalDropHistory',
            cardType: 'LineEChartsCardComponent',
            divisionId: this.user.userDivision.pop().Id,
            flipTime: 60 * 3,
            dataTime: 60,
            eventType: EventTypeEnum.IllegalDrop
        });
    }

    async mixedIntoHistoryCard() {
        this.mixedIntoHistoryCardConfig = new Array();
        this.mixedIntoHistoryCardConfig.push({
            business: 'MixedIntoHistory',
            cardType: 'LineEChartsCardComponent',
            divisionId: this.user.userDivision.pop().Id,
            flipTime: 60 * 3,
            dataTime: 60,
            eventType: EventTypeEnum.MixedInto
        });
    }

    async illegalDropTopCard() {
        const param = await this.eventDropTopCardParam();
        this.illegalDropTopCardConfig = new Array();
        this.illegalDropTopCardConfig.push({
            business: 'IllegalDropOrder',
            cardType: 'OrderTableCardComponent',
            divisionsIds: param.divisionsIds,
            divisionId: '',
            dataTime: 60,
            eventType: EventTypeEnum.IllegalDrop,
            divisionType: param.divisionType
        });
    }

    async mixedIntoDropTopCard() {
        const param = await this.eventDropTopCardParam();
        this.mixedIntoDropTopCardConfig = new Array();
        this.mixedIntoDropTopCardConfig.push({
            business: 'MixedIntoDropOrder',
            cardType: 'OrderTableCardComponent',
            divisionsIds: param.divisionsIds,
            divisionId: '',
            dataTime: 60,
            eventType: EventTypeEnum.MixedInto,
            divisionType: param.divisionType
        });

    }

    async eventDropTopCardParam() {
        if (this.divisionParam) return this.divisionParam;
        else {
            const parentDivision = await this.bufferService.ancestorDivisions(null, this.user.userDivision.pop().Id)
                , childrenDivision = await this.bufferService.ancestorDivisions(this.user.userDivision.pop().Id)
                , divisionsIds = new Array<string>();
            if (parentDivision[0].DivisionType == DivisionTypeEnum.City)
                childrenDivision.filter(d => d.DivisionType == DivisionTypeEnum.County && d.ParentId == parentDivision[0].Id)
                    .map(f => divisionsIds.push(f.Id));
            else if (parentDivision[0].DivisionType == DivisionTypeEnum.County)
                childrenDivision.filter(d => d.DivisionType == DivisionTypeEnum.Committees && d.ParentId == parentDivision[0].Id)
                    .map(f => divisionsIds.push(f.Id));
            this.divisionParam = {
                divisionType: parentDivision[0].DivisionType,
                divisionsIds: divisionsIds
            }
            return this.divisionParam;
        }
    }
}
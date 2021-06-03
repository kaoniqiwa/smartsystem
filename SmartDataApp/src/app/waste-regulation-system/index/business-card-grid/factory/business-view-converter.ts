/**
 * Developer 施文斌
 * LastUpdateTime  21.3.17
 */
import { DropEvent } from "../business/event-drop-history/data";
import { StationsScoreInfo } from "../business/station-dispose-score/data";
import { DeviceStatus } from "../business/dev/data";
import { IllegalDropEventInfos } from "../business/illegal-drop-event/data";
import { Divisions } from "../business/division/data";
import { EventDropOrderInfo } from "../business/event-drop-order/data";
import { Specification } from "../business/division-garbage-specification/data";
import { GarbageStationInspection } from "../business/inspection/data";
import { LineECharts } from '../../../../shared-module/card-component/line-echarts-card/line-echarts';
import { StateScale, Arc } from '../../../../shared-module/card-component/state-scale-card/state-scale';
import { ImageTheme } from "../../../../shared-module/card-component/image-theme-card/image-theme";
import { Hint, HintTag } from "../../../../shared-module/card-component/hint-card/hint";
import { OrderTable } from "../../../../shared-module/card-component/order-table-card/order-table";
import { HeaderSquareList, SquareItem } from "../../../../shared-module/header-square-list/header-square-list";
import { GalleryRollPage, Gallery } from "../../../../shared-module/card-component/gallery-roll-page/gallery-roll-page";
import { ViewsModel } from '../../../../common/abstract/base-view';
import { IConverter } from "../../../../common/interface/IConverter";
import { Injector, Injectable } from '@angular/core';
import { LineOption } from '../../../../common/directive/echarts/echart';
import { Percentage, DateInterval, IntegerDecimalNum } from '../../../../common/tool/tool.service'
import { EnumHelper, EventTypeEnum } from "../../../../common/tool/enum-helper";
import { MediumPicture } from "../../../../data-core/url/aiop/resources";
import { EventNumber } from '../../../../data-core/model/waste-regulation/event-number';
import { ColorEnum } from '../../../../shared-module/card-component/card-content-factory';
import { CameraStateTableEnum } from "../../../../shared-module/business-component/garbage-station-cameras/business/camera-table.service";
import { isBoolean } from 'util';
import { SessionUser } from "../../../../common/tool/session-user";
export class IllegalDropHistoryCardConverter implements IConverter {

    Convert<DropEvent, ViewsModel>(input: DropEvent, output: ViewsModel): ViewsModel;
    Convert(input: DropEvent, output: ViewsModel<LineECharts>): ViewsModel<LineECharts> {
        output.views = [];
        output.pageSize = 1;
        output.pageIndex = 1;
        const lc = this.joinPart(new LineECharts());
        var enters1 = new Array<EventNumber>();
        for (let i = 0; i < input.datas.length; i++) {
            enters1.push(input.datas[i]);
        }
        lc.option.seriesData = new Array();
        for (const x of enters1)
            lc.option.seriesData.push(x.DeltaNumber);
        output.views.push(lc);

        return output;
    }

    private joinPart(t1: LineECharts) {
        t1.title = "今日乱扔垃圾";
        t1.option = new LineOption();
        t1.option.xAxisData = [];
        for (let i = 1; i <= 12; i++) {
            if (i < 10)
                t1.option.xAxisData.push('0' + i + ':00');
            else
                t1.option.xAxisData.push(i + ':00');
        }
        for (let i = 13; i <= 24; i++) {
            if (i == 24)
                t1.option.xAxisData.push('23' + ':59');
            else
                t1.option.xAxisData.push(i + ':00');
        }
        return t1;
    }
}

export class MixedIntoHistoryCardConverter implements IConverter {

    Convert<DropEvent, ViewsModel>(input: DropEvent, output: ViewsModel): ViewsModel;
    Convert(input: DropEvent, output: ViewsModel<LineECharts>): ViewsModel<LineECharts> {
        output.views = [];
        output.pageSize = 1;
        output.pageIndex = 1;

        const lc = this.joinPart(new LineECharts());
        var enters1 = new Array<EventNumber>();
        for (let i = 0; i < input.datas.length; i++) {
            enters1.push(input.datas[i]);
        }
        lc.option.seriesData = new Array();
        for (const x of enters1)
            lc.option.seriesData.push(x.DeltaNumber);
        output.views.push(lc);

        return output;
    }

    private joinPart(t1: LineECharts) {
        t1.title = "今日混合投放";
        t1.option = new LineOption();
        t1.option.xAxisData = [];
        for (let i = 1; i <= 12; i++) {
            if (i < 10)
                t1.option.xAxisData.push('0' + i + ':00');
            else
                t1.option.xAxisData.push(i + ':00');
        }
        for (let i = 13; i <= 24; i++) {
            if (i == 24)
                t1.option.xAxisData.push('23' + ':59');
            else
                t1.option.xAxisData.push(i + ':00');
        }
        return t1;
    }
}

export class DevStatusCardConverter implements IConverter {

    Convert<DeviceStatus, ViewsModel>(input: DeviceStatus, output: ViewsModel): ViewsModel;
    Convert(input: DeviceStatus, output: ViewsModel<StateScale>): ViewsModel<StateScale> {
        output.views = [new StateScale()];
        output.pageSize = 1;
        output.pageIndex = 1;
        output.views[0].title = '设备运行状态';
        if (input instanceof DeviceStatus) {
            const percent = Percentage(input.cameraNumber - input.offlineCameraNumber, input.cameraNumber)
                , level = (percent: number) => {
                    if (percent > 90)
                        return '正常';
                    else if (percent >= 80 && percent < 90)
                        return '中度';
                    else
                        return '严重'
                }, arcVal = (percent: number) => {
                    if (percent == 100)
                        return Arc._100;
                    else if (percent == 0)
                        return Arc._0;
                    else if (percent >= 80 && percent < 100)
                        return Arc._80;
                    else if (percent >= 30 && percent < 80)
                        return Arc._40;
                    else if (percent < 30)
                        return Arc._20;

                };
            enum StateColorEnum {
                '正常' = 'green-text',
                '中度' = 'orange-text',
                '严重' = 'powder-red-text'
            }
            output.views[0].arc = arcVal(percent);
            output.views[0].stateLabel = {
                subTitle: '系统设备在线比',
                scaleNumber: percent + '',
                state: level(percent),
                color: StateColorEnum[level(percent)]
            }
            output.views[0].detail.push({
                label: '全部设备数量',
                number: input.cameraNumber + '',
                color: ColorEnum["sky-blue-text2"],
                tag: CameraStateTableEnum.none,
                linkTipLabel:'查看全部设备信息'
            });
            output.views[0].detail.push({
                label: '在线设备数量',
                number: (input.cameraNumber - input.offlineCameraNumber) + '',
                color: ColorEnum["green-text"],
                tag: CameraStateTableEnum.online,
                linkTipLabel:'查看在线设备信息'
            });
            output.views[0].detail.push({
                label: '离线设备数量',
                number: input.offlineCameraNumber + '',
                color: ColorEnum["powder-red-text"],
                tag: CameraStateTableEnum.offline,
                linkTipLabel:'查看离线设备信息'
            });
        }
        return output;
    }
}

export class DivisionListConverter implements IConverter {
    Convert<Divisions, ViewsModel>(input: Divisions, output: ViewsModel): ViewsModel;
    Convert(input: Divisions, output: ViewsModel<HeaderSquareList>): ViewsModel<HeaderSquareList> {
        output.views = [new HeaderSquareList()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof Divisions) {
            output.views[0].squareItems = new Array();
            const countys = input.items.filter(x => x.root == true),
                committees = input.items.filter(x => x.root == false && x.parentId == countys[0].id);

            for (let i = 0; i < countys.length; i++)
                output.views[0].squareItems.push(new SquareItem(countys[i].id, countys[i].name, countys[i].divisionType));

            for (let i = 0; i < committees.length; i++)
                output.views[0].squareItems.push(new SquareItem(committees[i].id, committees[i].name, committees[i].divisionType, committees[i].parentId));

            /**填补空白 样式走样 */
            // for (let i = 0; i < (12 - committees.length); i++)
            //     output.views[0].fillView.push('');
            if (countys.length)
                output.views[0].changebodyView = countys[0].id;

        }
        // setTimeout(() => {
        //     poshytip();  
        // },300);
        return output;
    }
}

export class IllegalDropEventConverter implements IConverter {

    Convert<IllegalDropEventInfos, ViewsModel>(input: IllegalDropEventInfos, output: ViewsModel): ViewsModel;
    Convert(input: IllegalDropEventInfos, output: ViewsModel<ImageTheme>): ViewsModel<ImageTheme> {
        output.views = [new ImageTheme()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof IllegalDropEventInfos) {
            output.pageSize = input.items.length;
            output.views = new Array();
            const user = new SessionUser();
            for (let i = 0; i < input.items.length; i++) {
                output.views.push(new ImageTheme());
                const pic = new MediumPicture();

                output.views[i].imgDesc1 = input.items[i].DivisionName;
                output.views[i].imgDesc2 = input.items[i].StationName;
                output.views[i].imgSrc = pic.getJPG(input.items[i].ImageUrl);
                output.views[i].title = '乱扔垃圾';
                output.views[i].imgDesc1Icon = 'howell-icon-signal2';
                output.views[i].imgDesc1IconColor = ColorEnum["green-text"];
                output.views[i].titleColor = ColorEnum["red-text"];
                output.views[i].subTitle = input.items[i].EventTime;
                output.views[i].tag = {
                    timeInterval: {
                        start: DateInterval(input.items[i].EventTimeAll, user.video.beforeInterval),
                        end: DateInterval(input.items[i].EventTimeAll, user.video.afterInterval)
                    },
                    cameraId: input.items[i].ResourceId
                }

                // { stationId: string, cameraId: string }
            }
        }
        else if (isBoolean(input)) {
            output.views[0].title = '乱扔垃圾';
            output.views[0].titleColor = ColorEnum["red-text"];
            output.views[0].imgDesc1 = '';
            output.views[0].imgDesc1Icon = input ? 'howell-icon-signal2' : 'howell-icon-no_signal';
            output.views[0].imgDesc1IconColor = input ? ColorEnum["green-text"] : ColorEnum["red-text"];
            output.views[0].imgDesc2 = '';
            output.views[0].subTitle = '';
        }
        return output;
    }
}

export class DropOrderConverter implements IConverter {
    Convert<EventDropOrderInfo, ViewsModel>(input: EventDropOrderInfo, output: ViewsModel): ViewsModel;
    Convert(input: EventDropOrderInfo, output: ViewsModel<OrderTable>): ViewsModel<OrderTable> {
        output.views = [new OrderTable()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof EventDropOrderInfo) {
            output.views[0].title = input.eventType == EventTypeEnum.IllegalDrop ? '乱扔垃圾排名' : '混合投放排名';
            output.views[0].table = new Array();

            const sort = input.items.sort((a, b) => {
                return b.dropNum - a.dropNum
            });
            for (const x of sort)
                output.views[0].table.push({
                    id:x.id,
                    name: x.division,
                    subName: x.dropNum + '',
                    subNameAfter: '起',
                    linkTipLabel:'查看事件记录'
                });
            /**补空行 */
            const len = output.views[0].table.length;
            if (len < 6)
                for (let i = 0; i < (6 - len); i++)
                    output.views[0].table.push({
                        id:'',
                        name: '-',
                        subName: '0',
                        subNameAfter: '起',
                        linkTipLabel:'查看事件记录'
                    });

            output.views[0].dropListV1 = {
                listNodes:  [ { id:'IllegalDrop',name:'乱扔垃圾'},{ id:'MixedInto',name:'混合投放'}]
                , fontSize: '18px'
                , defaultId:  'IllegalDrop'
                , eventType: input.eventType
            }
            if (input.dropList)
                output.views[0].dropList = {
                    listNodes: input.dropList
                    , fontSize: '18px'
                    , defaultId: input.defaultId
                    , eventType: input.eventType
                }


        }
        return output;
    }
}

export class IllegalDropOrderConverter implements IConverter {
    Convert<IllegalDropOrderInfo, ViewsModel>(input: IllegalDropOrderInfo, output: ViewsModel): ViewsModel;
    Convert(input: EventDropOrderInfo, output: ViewsModel<OrderTable>): ViewsModel<OrderTable> {
        output.views = [new OrderTable()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof EventDropOrderInfo) {
            output.views[0].title = '乱扔垃圾排名';
            output.views[0].table = new Array();

            const sort = input.items.sort((a, b) => {
                return b.dropNum - a.dropNum
            });
            for (const x of sort)
                output.views[0].table.push({
                    id:x.id,
                    name: x.division,
                    subName: x.dropNum + '',
                    subNameAfter: '起',
                    linkTipLabel:'查看事件记录'
                });
            /**补空行 */
            const len = output.views[0].table.length;
            if (len < 6)
                for (let i = 0; i < (6 - len); i++)
                    output.views[0].table.push({
                        id:'',
                        name: '-',
                        subName: '0',
                        subNameAfter: '起',
                        linkTipLabel:'查看事件记录'
                    });


            if (input.dropList)
                output.views[0].dropList = {
                    listNodes: input.dropList
                    , fontSize: '18px'
                    , defaultId: input.defaultId
                    , eventType: EventTypeEnum.IllegalDrop
                }

        }
        return output;
    }
}

export class MixedIntoDropOrderConverter implements IConverter {
    Convert<IllegalDropOrderInfo, ViewsModel>(input: IllegalDropOrderInfo, output: ViewsModel): ViewsModel;
    Convert(input: EventDropOrderInfo, output: ViewsModel<OrderTable>): ViewsModel<OrderTable> {
        output.views = [new OrderTable()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof EventDropOrderInfo) {
            output.views[0].title = '混合投放排名';
            output.views[0].table = new Array();

            const sort = input.items.sort((a, b) => {
                return b.dropNum - a.dropNum
            });
            for (const x of sort)
                output.views[0].table.push({
                    id:x.id,
                    name: x.division,
                    subName: x.dropNum + '',
                    subNameAfter: '起',
                    linkTipLabel:'查看事件记录'
                });
            /**补空行 */
            const len = output.views[0].table.length;
            if (len < 6)
                for (let i = 0; i < (6 - len); i++)
                    output.views[0].table.push({
                        id:'',
                        name: '-',
                        subName: '0',
                        subNameAfter: '起',
                        linkTipLabel:'查看事件记录'
                    });
            if (input.dropList)
                output.views[0].dropList = {
                    listNodes: input.dropList
                    , fontSize: '18px'
                    , defaultId: input.defaultId
                    , eventType: EventTypeEnum.MixedInto
                }
        }
        return output;
    }
}

export class StationDisposeScoreConverter implements IConverter {
    Convert<StationsScoreInfo, ViewsModel>(input: StationsScoreInfo, output: ViewsModel): ViewsModel;
    Convert(input: StationsScoreInfo, output: ViewsModel<OrderTable>): ViewsModel<OrderTable> {
        output.views = [new OrderTable()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof StationsScoreInfo) {
            output.views[0].title = '小包垃圾处置达标率排名';
            output.views[0].table = new Array();
            var i = 0;
            const sort = input.items.sort((a, b) => {
                return a.score - b.score
            });
            for (const x of sort) {
                if (i == 100) break;
                output.views[0].table.push({
                      id:x.id,
                    name: x.station,
                    subName: IntegerDecimalNum(x.score + ''),
                    subNameAfter: x.unit,
                    linkTipLabel:'查看小包垃圾处置记录'
                });
                i += 1;
            }

            /**补空行 */
            const len = output.views[0].table.length;
            if (len < 6)
                for (let i = 0; i < (6 - len); i++)
                    output.views[0].table.push({
                        id:'',
                        name: '-',
                        subName: '0',
                        subNameAfter: '起',
                        linkTipLabel:'查看小包垃圾处置记录'
                    });
        }
        return output;
    }
}

export class DivisionGarbageSpecificationConverter implements IConverter {

    Convert<Specification, ViewsModel>(input: Specification, output: ViewsModel): ViewsModel;
    Convert(input: Specification, output: ViewsModel<Hint[]>): ViewsModel<Hint[]> {

        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof Specification) {
            var hint = new Hint(), hints = new Array<Hint>();
            hint.title = '垃圾投放点数量';
            hint.linkTipLabel='查看垃圾投放点信息';
            hint.subTitleColor = ColorEnum["sky-blue-text2"];
            hint.subTitle = input.garbagePushNumber + '';
            hint.tag = HintTag.GarbageStation;
            hints.push(hint);
            hint = new Hint();
            hint.title = '小包垃圾滞留';
            hint.linkTipLabel='查看小包垃圾滞留信息';
            hint.tag = HintTag.StationStranded;
            hint.subTitleColor = ColorEnum["green-text"];
            hint.subTitle = input.garbageStrandedNumber + '';
            hints.push(hint);
            hint = new Hint();
            hint.title = '已满溢投放点数量';
            hint.linkTipLabel='查看满溢投放点信息';
            hint.subTitleColor = ColorEnum["orange-text"];
            hint.subTitle = input.fullPushNumber + '';
            hint.tag = HintTag.FullStation;
            hints.push(hint);
            hint = new Hint();
            hint.title = '乱丢垃圾';
            hint.linkTipLabel='查看乱丢垃圾事件记录';
            hint.subTitleColor = ColorEnum["powder-red-text"];
            hint.subTitle = input.illegalDropNumber + '';
            hint.tag = HintTag.IllegalDrop;
            hints.push(hint);
            hint = new Hint();
            hint.linkTipLabel='查看混合投放事件记录';
            hint.title = '混合投放';
            hint.tag = HintTag.MixedInto;
            hint.subTitleColor = ColorEnum["light-purple-text"];
            hint.subTitle = input.hybridPushNumber + '';
            hints.push(hint);
            output.views = [hints];
        }
        return output;
    }
}

export class GarbageStationInspectionCardConverter implements IConverter {

    Convert<GarbageStationInspection, ViewsModel>(input: GarbageStationInspection, output: ViewsModel): ViewsModel;
    Convert(input: GarbageStationInspection, output: ViewsModel<GalleryRollPage>): ViewsModel<GalleryRollPage> {
        output.views = [];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof GarbageStationInspection) {
            const model = new GalleryRollPage()
                , pic = new MediumPicture();
            model.items = new Map();
            model.leftBottom = {
                text: 0
            }

            for (let i = 0; i < input.garbageStations.length; i++) {

                const gs = input.garbageStations[i],
                    enumHelper = new EnumHelper(),
                    stationEvents = input.todayStationsEvent.filter(x => x.Data.StationId == gs.Id),
                    gallery = new Gallery(), state = () => {
                        if (gs.StationState == 0) return '正常';
                        else if (enumHelper.stationState.err.indexOf(gs.StationState) > -1)
                            return '异常';
                        else if (enumHelper.stationState.full.indexOf(gs.StationState) > -1)
                            return '满溢';
                    };
                gallery.title = {
                    state: state(),
                    text: gs.Name,
                    id: gs.Id,
                    eventNumber: stationEvents.length
                };
                gallery.imgDesc = new Array();
                gs.Cameras.sort((a, b) => {
                    return a.CameraUsage - b.CameraUsage;
                }).sort((a, b) => {
                    return ''.naturalCompare(a.Name, b.Name);
                }).map(x => {
                    gallery.imgDesc.push({
                        src: pic.getJPG(x.ImageUrl),
                        tag: {
                            id: x.Id
                        },
                        desc: x.Name,
                        state: x.OnlineStatus != 0
                    });
                });

                model.items.set(i + 1, gallery);
            }
            output.views = [model];
        }

        return output;
    }
}



@Injectable(
    { providedIn: 'root' }
)
export class ConverterFactory {
    convertInjector: Injector;
    constructor() {
        this.convertInjector = Injector.create([
            { provide: IllegalDropHistoryCardConverter, useValue: new IllegalDropHistoryCardConverter() },
            { provide: MixedIntoHistoryCardConverter, useValue: new MixedIntoHistoryCardConverter() },
            { provide: DevStatusCardConverter, useValue: new DevStatusCardConverter() },
            { provide: DivisionListConverter, useValue: new DivisionListConverter() },
            { provide: IllegalDropEventConverter, useValue: new IllegalDropEventConverter() },
            { provide: DivisionGarbageSpecificationConverter, useValue: new DivisionGarbageSpecificationConverter() },
            // { provide: IllegalDropOrderConverter, useValue: new IllegalDropOrderConverter() },
            // { provide: MixedIntoDropOrderConverter, useValue: new MixedIntoDropOrderConverter() },
            {provide: DropOrderConverter,useValue:new DropOrderConverter()},
            { provide: GarbageStationInspectionCardConverter, useValue: new GarbageStationInspectionCardConverter() },
            { provide: StationDisposeScoreConverter, useValue: new StationDisposeScoreConverter() }
        ])
    }

    createConvert(businessConfig: { business: string }) {
        if (businessConfig.business) {
            let convert = this.convertInjector.get<IConverter>(CardBusinessCoverterEnum[businessConfig.business]);
            return convert;
        }
    }
}

export const CardBusinessCoverterEnum = {
    "IllegalDropHistory": IllegalDropHistoryCardConverter,
    "MixedIntoHistory": MixedIntoHistoryCardConverter,
    "DeviceStatusStatistic": DevStatusCardConverter,
    "DivisionList": DivisionListConverter,
    "IllegalDropEvent": IllegalDropEventConverter,
    "DropOrder":DropOrderConverter,
    // "IllegalDropOrder": IllegalDropOrderConverter,
    // "MixedIntoDropOrder": MixedIntoDropOrderConverter,
    "DivisionGarbageSpecification": DivisionGarbageSpecificationConverter,
    "GarbageStationInspection": GarbageStationInspectionCardConverter,
    "StationDisposeScore": StationDisposeScoreConverter
}
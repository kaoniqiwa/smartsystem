/**
 * Developer 施文斌
 * LastUpdateTime 
 */
import { IllegalDropEvent } from '../business/illegal-drop-history/data';
import { DeviceStatus } from "../business/dev/data";
import { IllegalDropEventInfo, IllegalDropEventInfos } from "../business/illegal-drop-event/data";
import { Divisions, Division, } from "../business/division/data";
import { IllegalDropOrderInfo, IllegalDropInfo } from "../business/illegal-drop-order/data";
import { Specification } from "../business/division-garbage-specification/data";
import { LineECharts } from '../../../../shared-module/card-component/line-echarts-card/line-echarts';
import { StateScale, Arc } from '../../../../shared-module/card-component/state-scale-card/state-scale';
import { ImageTheme } from "../../../../shared-module/card-component/image-theme-card/image-theme";
import { Hint } from "../../../../shared-module/card-component/hint-card/hint";
import { OrderTable } from "../../../../shared-module/card-component/order-table-card/order-table";
import { HeaderSquareList, ItemTypeEnum, SquareItem } from "../../../../shared-module/header-square-list/header-square-list";
import { IViewModel, ViewsModel } from '../../../../common/abstract/base-view';
import { IConverter } from "../../../../common/interface/IConverter";
import { Injector, Injectable } from '@angular/core';
import { LineOption, PieOption } from '../../../../common/directive/echarts/echart';
import { Percentage } from '../../../../common/tool/tool.service'
import { DivisionTypeEnum } from "../../../../common/tool/enum-helper";
import { MediumPicture } from "../../../../data-core/url/aiop/resources";
import { EventNumber } from '../../../../data-core/model/waste-regulation/event-number';
import { ColorEnum } from '../../../../shared-module/card-component/card-content-factory';
import { isBoolean } from 'util';
export class IllegalDropHistoryCardConverter implements IConverter {

    Convert<IllegalDropEvent, ViewsModel>(input: IllegalDropEvent, output: ViewsModel): ViewsModel;
    Convert(input: IllegalDropEvent, output: ViewsModel<LineECharts>): ViewsModel<LineECharts> {
        output.views=[];
        output.pageSize = input.datas.length <= 12 ? 1 : 2;
        output.pageIndex = 1;
        if (output.pageSize == 1) {
            const lc = this.joinPart(new LineECharts(), true);
            var enters1 = new Array<EventNumber>();
            for (let i = 0; i < input.datas.length; i++) {
                if (i < 12)
                    enters1.push(input.datas[i]);
            }
            for (const x of enters1)
                lc.option.seriesData.push(x.DeltaNumber);
                output.views.push(lc);
        }
        else {
            const lc = this.joinPart(new LineECharts(), false);
            var enters1 = new Array<EventNumber>();
            for (let i = 0; i < input.datas.length; i++) {
                if (i > 12)
                    enters1.push(input.datas[i]);
            }
            lc.option.seriesData = new Array();
            for (const x of enters1)
                lc.option.seriesData.push(x.DeltaNumber);
            output.views.push(lc);

            const lc2 = this.joinPart(new LineECharts(), true);
            var enters2 = new Array<EventNumber>();
            for (let i = 0; i < input.datas.length; i++) {
                if (i < 12)
                    enters2.push(input.datas[i]);
            }
            lc2.option.seriesData = new Array();
            for (const x of enters2)
                lc2.option.seriesData.push(x.DeltaNumber);
            output.views.push(lc2);
        } 
        return output;
    }

    private joinPart(t1: LineECharts, moring: boolean) {
        t1.title = "今日乱扔垃圾";
        t1.option = new LineOption();
        t1.option.xAxisData = [];
        if (moring) {
            for (let i = 1; i <= 12; i++) {
                if (i < 10)
                    t1.option.xAxisData.push('0' + i + ':00');
                else
                    t1.option.xAxisData.push(i + ':00');
            }
        }
        else
            for (let i = 13; i <= 24; i++) {
                if (i == 24)
                    t1.option.xAxisData.push('00' + ':00');
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
            const percent = Percentage(input.offlineCameraNumber, input.cameraNumber)
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
                    else if (percent >= 30 && percent <= 40)
                        return Arc._40;
                    else if (percent <= 20)
                        return Arc._20;

                };

            output.views[0].arc = arcVal(percent);
            output.views[0].stateLabel = {
                subTitle: '系统设备在线比',
                scaleNumber: percent + '',
                state: level(percent),
            }
            output.views[0].detail.push({
                label: '全部设备数量',
                number: input.cameraNumber + '',
                color: ColorEnum["sky-blue-text2"]
            });
            output.views[0].detail.push({
                label: '在线设备数量',
                number: (input.cameraNumber - input.offlineCameraNumber) + '',
                color: ColorEnum["green-text"]
            });
            output.views[0].detail.push({
                label: '离线设备数量',
                number: input.offlineCameraNumber + '',
                color: ColorEnum["powder-red-text"]
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
            const countys = input.items.filter(x => x.divisionType == DivisionTypeEnum.County),
                committees = input.items.filter(x => x.divisionType == DivisionTypeEnum.Committees);

            for (let i = 0; i < countys.length; i++)
                output.views[0].squareItems.push(new SquareItem(countys[i].id, countys[i].name, DivisionTypeEnum.County));

            for (let i = 0; i < committees.length; i++)
                output.views[0].squareItems.push(new SquareItem(committees[i].id, committees[i].name, DivisionTypeEnum.Committees, committees[i].parentId));
            if (countys.length)
                output.views[0].changebodyView = countys[0].id;
        }
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
            for (let i = 0; i < input.items.length; i++) {
                output.views.push(new ImageTheme());
                const pic = new MediumPicture();

                output.views[i].imgDesc1 = input.items[i].DivisionName;
                output.views[i].imgDesc2 = input.items[i].StationName;
                output.views[i].imgSrc = pic.getJPG(input.items[i].ImageUrl);
                output.views[i].title = '乱扔垃圾';
                output.views[i].titleColor = ColorEnum["red-text"]
                output.views[i].subTitle = input.items[i].EventTime;
            }
        }
        else if (isBoolean(input)) {
            output.views[0].title = input == true ? '已连接' : '断开';
            output.views[0].titleColor = input == true ? ColorEnum["green-text"] : ColorEnum["red-text"];
        }
        return output;
    }
}

export class IllegalDropOrderConverter implements IConverter {
    Convert<IllegalDropOrderInfo, ViewsModel>(input: IllegalDropOrderInfo, output: ViewsModel): ViewsModel;
    Convert(input: IllegalDropOrderInfo, output: ViewsModel<OrderTable>): ViewsModel<OrderTable> {
        output.views = [new OrderTable()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof IllegalDropOrderInfo) {
            output.views[0].title = '乱扔垃圾行为TOP10';
            output.views[0].table = new Array();

            const sort = input.items.sort((a, b) => {
                return b.dropNum - a.dropNum
            });
            for (const x of sort.slice(0, 10)) {
                output.views[0].table.push({
                    name: x.division,
                    subName: x.dropNum + '',
                    subNameAfter: '起'
                });
            }

            const len = output.views[0].table.length;
            for (let i = 0; i <= 9 - len; i++) {
                output.views[0].table.push({
                    name: '-',
                    subName: '0',
                    subNameAfter: '起'
                });

            }

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
            hint.subTitleColor = ColorEnum["sky-blue-text2"];
            hint.subTitle = input.garbagePushNumber + '';
            hints.push(hint);
            hint = new Hint();
            hint.title = '垃圾桶数量';
            hint.subTitleColor = ColorEnum["green-text"];
            hint.subTitle = input.garbageBarrelNumber + '';
            hints.push(hint);
            hint = new Hint();
            hint.title = '已满溢投放点数量';
            hint.subTitleColor = ColorEnum["light-purple-text"];
            hint.subTitle = input.fullPushNumber + '';
            hints.push(hint);
            hint = new Hint();
            hint.title = '乱丢垃圾';
            hint.subTitleColor = ColorEnum["powder-red-text"];
            hint.subTitle = input.illegalDropNumber + '';
            hints.push(hint);
            hint = new Hint();
            hint.title = '混合投放垃圾';
            hint.subTitleColor = ColorEnum["orange-text"];
            hint.subTitle = input.hybridPushNumber + '';
            hints.push(hint);
            output.views = [hints];
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
            { provide: DevStatusCardConverter, useValue: new DevStatusCardConverter() },
            { provide: DivisionListConverter, useValue: new DivisionListConverter() },
            { provide: IllegalDropEventConverter, useValue: new IllegalDropEventConverter() },
            { provide: DivisionGarbageSpecificationConverter, useValue: new DivisionGarbageSpecificationConverter() },
            { provide: IllegalDropOrderConverter, useValue: new IllegalDropOrderConverter() }
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
    "DeviceStatusStatistic": DevStatusCardConverter,
    "DivisionList": DivisionListConverter,
    "IllegalDropEvent": IllegalDropEventConverter,
    "DivisionGarbageSpecification": DivisionGarbageSpecificationConverter,
    "IllegalDropOrder": IllegalDropOrderConverter
} 
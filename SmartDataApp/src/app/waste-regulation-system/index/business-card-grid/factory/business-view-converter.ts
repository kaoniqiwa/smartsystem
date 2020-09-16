/**
 * Developer 施文斌
 * LastUpdateTime 
 */
import { IllegalDropEvent } from '../business/illegal-drop-statistic/data';
import { DeviceStatus } from "../business/dev/data";
import { IllegalDropEventInfo } from "../business/illegal-drop-event/data";
import { Divisions, Division, } from "../business/division/data";
import { IllegalDropOrderInfo, IllegalDropInfo } from "../business/illegal-drop-order/data";
import { Specification } from "../business/division-garbage-specification/data";
import { LineECharts } from '../../../../shared-module/card-component/line-echarts-card/line-echarts';
import { StateScale } from '../../../../shared-module/card-component/state-scale-card/state-scale';
import { ImageTheme } from "../../../../shared-module/card-component/image-theme-card/image-theme";
import { Hint, ColorEnum } from "../../../../shared-module/card-component/hint-card/hint";
import { OrderTable } from "../../../../shared-module/card-component/order-table-card/order-table";
import { HeaderSquareList, ItemTypeEnum, SquareItem } from "../../../../shared-module/header-square-list/header-square-list";
import { IViewModel, ViewsModel } from '../../../../common/abstract/base-view';
import { IConverter } from "../../../../common/interface/IConverter";
import { Injector, Injectable } from '@angular/core';
import { PieOption } from '../../../../common/directive/echarts/echart';
import { Percentage } from '../../../../common/tool/tool.service'
import { DivisionTypeEnum } from "../../../../common/tool/enum-helper";
import { IBusinessData } from '../../../../common/interface/IBusiness';
import { MediumPicture } from "../../../../data-core/url/aiop/resources";
export class IllegalDropCardConverter implements IConverter {

    Convert<IllegalDropEvent, ViewsModel>(input: IllegalDropEvent, output: ViewsModel): ViewsModel;
    Convert(input: IllegalDropEvent, output: ViewsModel<LineECharts>): ViewsModel<LineECharts> {
        output.views = [new LineECharts()];
        output.pageSize = 1;
        output.pageIndex = 1;

        return output;
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
                    if (percent > 90)
                        return 74;
                    else if (percent >= 80 && percent < 90)
                        return 30;
                    else
                        return 10
                };
            output.views[0].stateLabel = {
                subTitle: '系统设备在线比',
                scaleNumber: percent + '',
                state: level(percent),
                arc: arcVal(percent)
            }
            output.views[0].detail.push({
                label: '全部设备数量',
                number: input.cameraNumber + ''
            });
            output.views[0].detail.push({
                label: '在线设备数量',
                number: (input.cameraNumber - input.offlineCameraNumber) + ''
            });
            output.views[0].detail.push({
                label: '离线设备数量',
                number: input.offlineCameraNumber + ''
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
                output.views[0].squareItems.push(new SquareItem(countys[i].id, countys[i].name));

            for (let i = 0; i < committees.length; i++)
                output.views[0].squareItems.push(new SquareItem(committees[i].id, committees[i].name, committees[i].parentId));
            if (countys.length)
                output.views[0].changebodyView = countys[0].id;
        }
        return output;
    }
}

export class IllegalDropEventConverter implements IConverter {

    Convert<IllegalDropEventInfo, ViewsModel>(input: IllegalDropEventInfo, output: ViewsModel): ViewsModel;
    Convert(input: IllegalDropEventInfo, output: ViewsModel<ImageTheme>): ViewsModel<ImageTheme> {
        output.views = [new ImageTheme()];
        output.pageSize = 1;
        output.pageIndex = 1;
        if (input instanceof IllegalDropEventInfo) {
            const pic = new MediumPicture();

            output.views[0].imgDesc1 = input.DivisionName;
            output.views[0].imgDesc2 = input.StationName;
            output.views[0].imgSrc = pic.getJPG(input.ImageUrl);
            output.views[0].title = '乱扔垃圾';
            output.views[0].subTitle = input.EventTime;
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
            output.views[0].title='';
            output.views[0].table = new Array();
            for(const x of input.items){
                output.views[0].table.push({
                    name:x.division,
                    subName:x.dropNum+'',
                    subNameAfter:'起'
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
            { provide: IllegalDropCardConverter, useValue: new IllegalDropCardConverter() },
            { provide: DevStatusCardConverter, useValue: new DevStatusCardConverter() },
            { provide: DivisionListConverter, useValue: new DivisionListConverter() },
            { provide: IllegalDropEventConverter, useValue: new IllegalDropEventConverter() },
            { provide: DivisionGarbageSpecificationConverter, useValue: new DivisionGarbageSpecificationConverter() }
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
    "IllegalDropStatistic": IllegalDropCardConverter,
    "DeviceStatusStatistic": DevStatusCardConverter,
    "DivisionList": DivisionListConverter,
    "IllegalDropEvent": IllegalDropEventConverter,
    "DivisionGarbageSpecification": DivisionGarbageSpecificationConverter,
    "IllegalDropOrderConverter":IllegalDropOrderConverter
} 
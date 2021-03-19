
import { StatisticalDataBufferService } from '../../buffer/statistical-data-buffer';
import { EventDropInfo, EventDropOrderInfo } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { DivisionTypeEnum, EventTypeEnum } from '../../../../../common/tool/enum-helper';

/**
 * 今日 事件排行
 */
export class EventDropOrder extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        const model = new EventDropOrderInfo(),
            divisionDrop = new Map<DivisionTypeEnum, Array<{ id: string, name: string }>>();
        divisionDrop.set(DivisionTypeEnum.City, [{
            id: DivisionTypeEnum.County + '',
            name: '街道'
        }, {
            id: DivisionTypeEnum.Committees + '',
            name: '居委'
        }]);
        divisionDrop.set(DivisionTypeEnum.County, [{
            id: DivisionTypeEnum.Committees + '',
            name: '居委'
        }, {
            id: 'station',
            name: '投放点'
        }]);
        model.items = new Array(); 
        const divisionId = this.businessParameter.map.get('divisionId') as string //父区划 
            , divisionType = this.businessParameter.map.get('divisionType') as DivisionTypeEnum
            , eventType = this.businessParameter.map.get('eventType') as EventTypeEnum
            , dropList = this.businessParameter.map.get('dropList') as string
            , division = await (this.dataServe as StatisticalDataBufferService).ancestorDivisions(null, divisionId)
            , fillIllegalDropInfo = async () => {
                const ancestorDivisions = await (this.dataServe as StatisticalDataBufferService).ancestorDivisions(divisionId)
                    , ids = new Array<string>();  
                
                switch (dropList) {
                    case DivisionTypeEnum.County + '':
                        ancestorDivisions.filter(f => f.DivisionType == DivisionTypeEnum.County).map(d => ids.push(d.Id));
                        break;

                    case DivisionTypeEnum.Committees + '':
                        ancestorDivisions.filter(f => f.DivisionType == DivisionTypeEnum.Committees).map(d => ids.push(d.Id));
                        break;
                    default:
                        ancestorDivisions.filter(f => f.ParentId == divisionId).map(d => ids.push(d.Id));
                        break;
                } 
               
                const data = await (this.dataServe as StatisticalDataBufferService).postDivisionStatisticNumbers(ids);
                for (const x of data) {
                    const info = new EventDropInfo();
                    model.items.push(info);
                    info.division = x.Name;
                    info.dropNum = 0;                   
                    for (const v of x.TodayEventNumbers)
                        if (v.EventType == eventType)
                            info.dropNum += v.DayNumber;
                }
               
            }
            , stationDropInfo = async () => {
                const stations = await (this.dataServe as StatisticalDataBufferService).getGarbageStations(divisionId)
                    , stationIds = new Array<string>();

                for (const x of stations)
                    stationIds.push(x.Id);
                if (stationIds.length) {
                    const data = await (this.dataServe as StatisticalDataBufferService).postGarbageStationStatisticNumbers(stationIds);
                    // console.log(data,stationIds);
                    for (const x of data) {
                        const info = new EventDropInfo();
                        model.items.push(info);
                        info.division = x.Name;
                        info.dropNum = 0;
                        for (const v of x.TodayEventNumbers)
                            if (v.EventType == eventType)
                                info.dropNum += v.DayNumber;
                    }
                }

            };


        model.eventType = eventType;

        if (dropList) {
            model.dropList = divisionDrop.get(division[0].DivisionType);
            //统计街道 乱扔垃圾
            if (dropList == 'station')
                await stationDropInfo();
            else await fillIllegalDropInfo();
            model.defaultId = dropList;
        }
        else {
            model.dropList = divisionDrop.get(division[0].DivisionType);

            if (divisionType == DivisionTypeEnum.City) {
                model.defaultId = DivisionTypeEnum.County + '';
                //统计街道 统计居委 乱扔垃圾
                await fillIllegalDropInfo();
            }
            else if (divisionType == DivisionTypeEnum.County) {
                model.defaultId = DivisionTypeEnum.Committees + '';
                //统计居委 乱扔垃圾
                await fillIllegalDropInfo();

            }
            else if (divisionType == DivisionTypeEnum.Committees) {
                //统计投放点 乱扔垃圾
                await stationDropInfo();
            }
        }
        return model;
    }
}

export class EventDropOrderB extends EventDropOrder {

}
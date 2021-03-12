
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
        const model = new EventDropOrderInfo();
        model.items = new Array();
        const divisionId = this.businessParameter.map.get('divisionId') as string //父区划
            , divisionsIds = this.businessParameter.map.get('divisionsIds') as Array<string>//子区划
            , divisionType = this.businessParameter.map.get('divisionType') as DivisionTypeEnum
            , eventType = this.businessParameter.map.get('eventType') as EventTypeEnum
            , dropList =  this.businessParameter.map.get('dropList') as string
            ,fillIllegalDropInfo = async () => {
                const data = await (this.dataServe as StatisticalDataBufferService).postDivisionStatisticNumbers(divisionsIds);
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
            ,stationDropInfo=async ()=>{
                const stations = await (this.dataServe as StatisticalDataBufferService).getGarbageStations(divisionId)
                    , stationIds = new Array<string>();
                for (const x of stations)
                    stationIds.push(x.Id);
                if (stationIds.length) {
                    const data = await (this.dataServe as StatisticalDataBufferService).postGarbageStationStatisticNumbers(stationIds);
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


        model.eventType=eventType;         
       
        if(dropList){    
            if (divisionType == DivisionTypeEnum.Committees) { 
                model.dropList = [{
                    id:  DivisionTypeEnum.Committees+'',
                    name: '居委'
                },{
                    id: 'station',
                    name: '投放点'
                }];
                //统计 统计居委 乱扔垃圾
                await fillIllegalDropInfo();
            } 
            else if (divisionType == DivisionTypeEnum.County) {
                model.dropList = [{
                    id: DivisionTypeEnum.County + '',
                    name: '街道'
                }, {
                    id:  DivisionTypeEnum.Committees+'',
                    name: '居委'
                }]; 
                //统计街道 乱扔垃圾
                await fillIllegalDropInfo(); 
            } 
            else  if (divisionType == null) { 
                model.dropList = [{
                    id:  DivisionTypeEnum.Committees+'',
                    name: '居委'
                },{
                    id: 'station',
                    name: '投放点'
                }]; 
              await  stationDropInfo();
            }             
            model.defaultId =  dropList;
        }
        else{
            if (divisionType == DivisionTypeEnum.City) { 
                model.dropList = [{
                    id: DivisionTypeEnum.County + '',
                    name: '街道'
                }, {
                    id: DivisionTypeEnum.Committees + '',
                    name: '居委'
                }];
                model.defaultId =  DivisionTypeEnum.County + '';
                //统计街道 统计居委 乱扔垃圾
                await fillIllegalDropInfo();
            }
            else if (divisionType == DivisionTypeEnum.County) {
                model.dropList = [{
                    id: DivisionTypeEnum.Committees + '',
                    name: '居委'
                }, {
                    id:  'station',
                    name: '投放点'
                }];
                model.defaultId =  DivisionTypeEnum.Committees + '';
                //统计居委 乱扔垃圾
                await fillIllegalDropInfo();
    
            }
            else  if (divisionType == DivisionTypeEnum.Committees) {
                //统计投放点 乱扔垃圾
               await  stationDropInfo();
            } 
        }
        return model;
    }
}

export class EventDropOrderB extends EventDropOrder {

}
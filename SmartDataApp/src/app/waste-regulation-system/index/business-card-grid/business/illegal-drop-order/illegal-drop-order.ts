
import { StatisticalDataBufferService, TimeUnitEnum } from '../../buffer/statistical-data-buffer';
import { IllegalDropOrderInfo, IllegalDropInfo } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { EventNumber } from '../../../../../data-core/model/waste-regulation/event-number';
import { DivisionTypeEnum, EventTypeEnum } from '../../../../../common/tool/enum-helper';
export class IllegalDropOrder extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        var divisionsIds = this.businessParameter.map.get('divisionsIds') as string[];
        const   divisionsId = this.businessParameter.map.get('divisionsId') as string
            , divisionsType = this.businessParameter.map.get('divisionsType') as DivisionTypeEnum;
 
        const model = new IllegalDropOrderInfo();
        model.items = new Array();
      
        if (divisionsType == DivisionTypeEnum.Committees) {
            const stations = await (this.dataServe as StatisticalDataBufferService).getGarbageStations(divisionsId)
                , stationIds = new Array<string>();
               
                
            for (const x of stations)
                stationIds.push(x.Id);
            if(stationIds.length){
                const data = await (this.dataServe as StatisticalDataBufferService).postGarbageStationStatisticNumbers(stationIds);
                for (const x of data) {
                    const info = new IllegalDropInfo();
                    model.items.push(info);
                    info.division = x.Name;
                    info.dropNum = 0;
                    for (const v of x.TodayEventNumbers)
                        if (v.EventType == EventTypeEnum.IllegalDrop)
                            info.dropNum += v.DayNumber;
                }
            }
           
        }
        else if (divisionsType == DivisionTypeEnum.County || divisionsType == void 0) {
            if(divisionsId&&divisionsIds == void 0){
                
               const divisions=  await (this.dataServe as StatisticalDataBufferService).getDivisions();
               divisionsIds = new Array(); 
               divisions.filter(x=>x.DivisionType == DivisionTypeEnum.Committees).map(x=> divisionsIds.push(x.Id));
            }
            const data = await (this.dataServe as StatisticalDataBufferService).postDivisionStatisticNumbers(divisionsIds);
            for (const x of data) {
                const info = new IllegalDropInfo();
                model.items.push(info);
                info.division = x.Name;
                info.dropNum = 0;
                for (const v of x.TodayEventNumbers)
                    if (v.EventType == EventTypeEnum.IllegalDrop)
                        info.dropNum += v.DayNumber;
            }
        }

        return model;
    }
}
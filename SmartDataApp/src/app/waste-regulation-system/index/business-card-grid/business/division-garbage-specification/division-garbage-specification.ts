
import { StatisticalDataBufferService } from '../../buffer/statistical-data-buffer';
import { Specification } from "./data";
import { BusinessParameter } from '../../../../../common/interface/IBusiness';
import { BaseBusinessRefresh } from "../../../../../common/tool/base-business-refresh";
import { DivisionTypeEnum, EventTypeEnum } from '../../../../../common/tool/enum-helper'
export class DivisionGarbageSpecification extends BaseBusinessRefresh {

    constructor(dataServe: StatisticalDataBufferService, businessParameter?: BusinessParameter) {
        super(dataServe, businessParameter);
    }

    async getData() {
        const divisionsIds = this.businessParameter.map.get('divisionsIds') as string[]
            , divisionsId = this.businessParameter.map.get('divisionId') as string
            , divisionsType = this.businessParameter.map.get('divisionsType') as DivisionTypeEnum
        , model = new Specification()
        , data = await (this.dataServe as StatisticalDataBufferService).getDivisionStatisticNumber(divisionsId);
        model.fullPushNumber = data.DryFullStationNumber;
        model.garbageStrandedNumber = data.GarbageDropStationNumber || 0;
        model.garbagePushNumber = data.StationNumber || 0;
        model.hybridPushNumber = 0;
        model.illegalDropNumber = 0;
        if (divisionsType == DivisionTypeEnum.Committees ) {
            const stations = await (this.dataServe as StatisticalDataBufferService).getGarbageStations(divisionsId)
                , stationIds = new Array<string>();                
                
            for (const x of stations)
                stationIds.push(x.Id);
            if(stationIds.length){
                const data = await (this.dataServe as StatisticalDataBufferService).postGarbageStationStatisticNumbers(stationIds);
                for (const x of data) { 
                    for (const v of x.TodayEventNumbers)
                        if (v.EventType == EventTypeEnum.IllegalDrop)
                        model.illegalDropNumber  += v.DayNumber;
                        else if(v.EventType == EventTypeEnum.MixedInto)
                        model.hybridPushNumber+=v.DayNumber;
                }
            }           
        }
        else if (divisionsType == DivisionTypeEnum.County) {
            const data = await (this.dataServe as StatisticalDataBufferService).postDivisionStatisticNumbers(divisionsIds);
            for (const x of data) { 
                for (const v of x.TodayEventNumbers)
                    if (v.EventType == EventTypeEnum.IllegalDrop)
                    model.illegalDropNumber  += v.DayNumber;
                    else if(v.EventType == EventTypeEnum.MixedInto)
                    model.hybridPushNumber+=v.DayNumber;
            }
        } 
        else if(divisionsType == void 0){
            const data = await (this.dataServe as StatisticalDataBufferService).postDivisionStatisticNumbers([divisionsId]);
            for (const x of data) { 
                for (const v of x.TodayEventNumbers)
                    if (v.EventType == EventTypeEnum.IllegalDrop)
                    model.illegalDropNumber  += v.DayNumber;
                    else if(v.EventType == EventTypeEnum.MixedInto)
                    model.hybridPushNumber+=v.DayNumber;
            }
        }
        return model;
    }
}
import {  EventNumber } from '../../../../../data-core/model/waste-regulation/event-number';  
import { IBusinessData } from "../../../../../common/interface/IBusiness";
export class DropEvent implements IBusinessData{
    datas:EventNumber[]; 
}

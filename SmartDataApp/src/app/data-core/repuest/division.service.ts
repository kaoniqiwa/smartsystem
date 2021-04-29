import { Injectable } from "@angular/core";
import { SaveModel } from "../model/save-model";
import { Division,GetDivisionsParams } from "../model/waste-regulation/division"; 
import { DivisionTree } from "../model/waste-regulation/division-tree"; 
import { DivisionNumberStatistic ,GetDivisionStatisticNumbersParams,GetDivisionStatisticNumbersParamsV2,DivisionNumberStatisticV2} from "../model/waste-regulation/division-number-statistic"; 
import { EventNumberStatistic,GetDivisionEventNumbersParams, } from "../model/waste-regulation/division-event-numbers"; 
import { GarbageVolume,GetDivisionVolumesParams } from "../model/waste-regulation/garbage-volume"; 
import * as url from "../url/waste-regulation/division";
import { PagedList } from "../model/page";
import { BatchRequest,BatchResult } from "../model/batch";
import { Response } from "../model/Response"; 
import { HowellAuthHttpService } from "./howell-auth-http.service";
@Injectable({
    providedIn:'root'
})
export class DivisionRequestService extends SaveModel{
    url: url.DivisionUrl;
    constructor(private requestService: HowellAuthHttpService) {
        super();
        this.url = new url.DivisionUrl();
    }
    create(item:Division){ 
        return this.requestService.post<Division, Response<Division>>(this.url.create(), this.toModel(item,this.formMustField.division));
    }

    createMore(item:BatchRequest){ 
        return this.requestService.post<BatchRequest, Response<BatchResult>>(this.url.create(), item);
    }

    get(id: string) {
        return this.requestService.get<Division>(this.url.get(id));
    }

    set(item: Division){
        return this.requestService.put<Division, Response<Division>>(this.url.edit(item.Id), this.toModel(item,this.formMustField.division));
    }

    del(id: string) {
        return this.requestService.delete<Division>(this.url.del(id));
    }

    list(item:GetDivisionsParams){
        return this.requestService.post<GetDivisionsParams, Response<PagedList<Division>>>(this.url.list(), item);
    }

    tree(){
        return this.requestService.get<DivisionTree>(this.url.tree());
    }

    volumesHistory(item:GetDivisionVolumesParams,divisionsId:string){
        return this.requestService.post<GetDivisionVolumesParams, Response<PagedList<GarbageVolume>>>(this.url.volumesHistory(divisionsId), item);
    }

    eventNumbersHistory(item:GetDivisionEventNumbersParams,divisionsId:string){
        return this.requestService.post<GetDivisionEventNumbersParams, Response<PagedList<EventNumberStatistic>>>(this.url.eventNumbersHistory(divisionsId), item);
    }

    statisticNumber(divisionsId: string) {
        return this.requestService.get<DivisionNumberStatistic>(this.url.statisticNumber(divisionsId));
    }

    statisticNumberList(item:GetDivisionStatisticNumbersParams){
        return this.requestService.post<GetDivisionStatisticNumbersParams, Response<PagedList<DivisionNumberStatistic>>>(this.url.statisticNumberList(), item);
    }

    statisticNumberListV2(item:GetDivisionStatisticNumbersParamsV2){
        return this.requestService.post<GetDivisionStatisticNumbersParamsV2, Response<DivisionNumberStatisticV2[]>>(this.url.statisticNumberHistoryList(), item);
    }
}



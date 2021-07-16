import { Injectable } from "@angular/core";
import { SaveModel } from "../model/save-model";
import {
  Division,
  GetDivisionsParams,
} from "../model/waste-regulation/division";
import { DivisionTree } from "../model/waste-regulation/division-tree";
import {
  DivisionNumberStatistic,
  GetDivisionStatisticNumbersParams,
  GetDivisionStatisticNumbersParamsV2,
  DivisionNumberStatisticV2,
} from "../model/waste-regulation/division-number-statistic";
import {
  EventNumberStatistic,
  GetDivisionEventNumbersParams,
} from "../model/waste-regulation/division-event-numbers";
import {
  GarbageVolume,
  GetDivisionVolumesParams,
} from "../model/waste-regulation/garbage-volume";
import * as url from "../url/waste-regulation/division";
import { PagedList } from "../model/page";
import { BatchRequest, BatchResult } from "../model/batch";
import { HowellResponse } from "../model/response";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { plainToClass } from "class-transformer";
@Injectable({
  providedIn: "root",
})
export class DivisionRequestService {
  url: url.DivisionUrl;
  constructor(private requestService: HowellAuthHttpService) {
    this.url = new url.DivisionUrl();
  }
  async create(item: Division) {
    let response = await this.requestService
      .post<Division, HowellResponse<Division>>(
        this.url.create(),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return plainToClass(Division, response.Data);
  }

  async createMore(item: BatchRequest) {
    let response = await this.requestService
      .post<BatchRequest, HowellResponse<BatchResult>>(this.url.create(), item)
      .toPromise();
    return plainToClass(BatchResult, response.Data);
  }

  async get(id: string) {
    let response = await this.requestService
      .get<Division>(this.url.get(id))
      .toPromise();
    return plainToClass(Division, response.Data);
  }

  async set(item: Division) {
    let response = await this.requestService
      .put<Division, HowellResponse<Division>>(
        this.url.edit(item.Id),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return plainToClass(Division, response.Data);
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<Division>(this.url.del(id))
      .toPromise();
    return plainToClass(Division, response.Data);
  }

  async list(item: GetDivisionsParams) {
    let response = await this.requestService
      .post<GetDivisionsParams, HowellResponse<PagedList<Division>>>(
        this.url.list(),
        item
      )
      .toPromise();
    let result = response.Data;
    result.Data = plainToClass(Division, response.Data.Data);
    return result;
  }

  async tree() {
    let response = await this.requestService
      .get<DivisionTree>(this.url.tree())
      .toPromise();
    return plainToClass(DivisionTree, response.Data);
  }

  async volumesHistory(item: GetDivisionVolumesParams, divisionsId: string) {
    let response = await this.requestService
      .post<GetDivisionVolumesParams, HowellResponse<PagedList<GarbageVolume>>>(
        this.url.volumesHistory(divisionsId),
        item
      )
      .toPromise();
    let result = response.Data;
    result.Data = plainToClass(GarbageVolume, response.Data.Data);
    return result;
  }

  async eventNumbersHistory(
    item: GetDivisionEventNumbersParams,
    divisionsId: string
  ) {
    let response = await this.requestService
      .post<
        GetDivisionEventNumbersParams,
        HowellResponse<PagedList<EventNumberStatistic>>
      >(this.url.eventNumbersHistory(divisionsId), item)
      .toPromise();
    let result = response.Data;
    result.Data = plainToClass(EventNumberStatistic, response.Data.Data);
    return result;
  }

  async statisticNumber(divisionsId: string) {
    let response = await this.requestService
      .get<DivisionNumberStatistic>(this.url.statisticNumber(divisionsId))
      .toPromise();
    return plainToClass(DivisionNumberStatistic, response.Data);
  }

  async statisticNumberList(item: GetDivisionStatisticNumbersParams) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParams,
        HowellResponse<PagedList<DivisionNumberStatistic>>
      >(this.url.statisticNumberList(), item)
      .toPromise();
    let result = response.Data;
    result.Data = plainToClass(DivisionNumberStatistic, response.Data.Data);
    return result;
  }

  async statisticNumberListV2(item: GetDivisionStatisticNumbersParamsV2) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParamsV2,
        HowellResponse<DivisionNumberStatisticV2[]>
      >(this.url.statisticNumberHistoryList(), item)
      .toPromise();
    return plainToClass(DivisionNumberStatisticV2, response.Data);
  }
}

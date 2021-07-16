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
import { ServiceResponseProcessor } from "../model/waste-regulation/request-service-processor";
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
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async createMore(item: BatchRequest) {
    let response = await this.requestService
      .post<BatchRequest, HowellResponse<BatchResult>>(this.url.create(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, BatchResult);
  }

  async get(id: string) {
    let response = await this.requestService
      .get<Division>(this.url.get(id))
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async set(item: Division) {
    let response = await this.requestService
      .put<Division, HowellResponse<Division>>(
        this.url.edit(item.Id),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<Division>(this.url.del(id))
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async list(item: GetDivisionsParams) {
    let response = await this.requestService
      .post<GetDivisionsParams, HowellResponse<PagedList<Division>>>(
        this.url.list(),
        item
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async tree() {
    let response = await this.requestService
      .get<DivisionTree>(this.url.tree())
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, DivisionTree);
  }

  async volumesHistory(item: GetDivisionVolumesParams, divisionsId: string) {
    let response = await this.requestService
      .post<GetDivisionVolumesParams, HowellResponse<PagedList<GarbageVolume>>>(
        this.url.volumesHistory(divisionsId),
        item
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, GarbageVolume);
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
    return ServiceResponseProcessor.ResponseProcess(
      response,
      EventNumberStatistic
    );
  }

  async statisticNumber(divisionsId: string) {
    let response = await this.requestService
      .get<DivisionNumberStatistic>(this.url.statisticNumber(divisionsId))
      .toPromise();

    return ServiceResponseProcessor.ResponseProcess(
      response,
      DivisionNumberStatistic
    );
  }

  async statisticNumberList(item: GetDivisionStatisticNumbersParams) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParams,
        HowellResponse<PagedList<DivisionNumberStatistic>>
      >(this.url.statisticNumberList(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      DivisionNumberStatistic
    );
  }

  async statisticNumberListV2(item: GetDivisionStatisticNumbersParamsV2) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParamsV2,
        HowellResponse<DivisionNumberStatisticV2[]>
      >(this.url.statisticNumberHistoryList(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      DivisionNumberStatisticV2
    );
  }
}

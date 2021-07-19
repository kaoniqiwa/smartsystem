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
import { PagedList } from "../model/page";
import { BatchRequest, BatchResult } from "../model/batch";
import { HowellResponse } from "../model/response";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceResponseProcessor } from "../model/waste-regulation/request-service-processor";
import { DivisionUrl } from "../url/waste-regulation/division";
@Injectable({
  providedIn: "root",
})
export class DivisionRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: Division) {
    let response = await this.requestService
      .post<Division, HowellResponse<Division>>(
        DivisionUrl.create(),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async createMore(item: BatchRequest) {
    let response = await this.requestService
      .post<BatchRequest, HowellResponse<BatchResult>>(
        DivisionUrl.create(),
        item
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, BatchResult);
  }

  async get(id: string) {
    let response = await this.requestService
      .get<Division>(DivisionUrl.get(id))
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async set(item: Division) {
    let response = await this.requestService
      .put<Division, HowellResponse<Division>>(
        DivisionUrl.edit(item.Id),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<Division>(DivisionUrl.del(id))
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async list(item: GetDivisionsParams) {
    let response = await this.requestService
      .post<GetDivisionsParams, HowellResponse<PagedList<Division>>>(
        DivisionUrl.list(),
        item
      )
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, Division);
  }

  async tree() {
    let response = await this.requestService
      .get<DivisionTree>(DivisionUrl.tree())
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(response, DivisionTree);
  }

  async volumesHistory(item: GetDivisionVolumesParams, divisionsId: string) {
    let response = await this.requestService
      .post<GetDivisionVolumesParams, HowellResponse<PagedList<GarbageVolume>>>(
        DivisionUrl.volumesHistory(divisionsId),
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
      >(DivisionUrl.eventNumbersHistory(divisionsId), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      EventNumberStatistic
    );
  }

  async statisticNumber(divisionsId: string) {
    let response = await this.requestService
      .get<DivisionNumberStatistic>(DivisionUrl.statisticNumber(divisionsId))
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
      >(DivisionUrl.statisticNumberList(), item)
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
      >(DivisionUrl.statisticNumberHistoryList(), item)
      .toPromise();
    return ServiceResponseProcessor.ResponseProcess(
      response,
      DivisionNumberStatisticV2
    );
  }
}

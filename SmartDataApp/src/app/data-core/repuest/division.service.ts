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
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
import { DivisionUrl } from "../url/waste-regulation/division";
@Injectable({
  providedIn: "root",
})
export class DivisionRequestService {
  constructor(private requestService: HowellAuthHttpService) {}
  async create(item: Division) {
    let response = await this.requestService
      .post<Division, HowellResponse<Division>>(
        DivisionUrl.basic(),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      ServiceHelper.cacheItemByPaged.push(ServiceHelper.key.Division, x);
      ServiceHelper.cache.reset();
      return x;
    });
  }

  async createMore(item: BatchRequest) {
    let response = await this.requestService
      .post<BatchRequest, HowellResponse<BatchResult>>(
        DivisionUrl.basic(),
        item
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, BatchResult);
  }

  async get(id: string): Promise<Division> {
    let url = DivisionUrl.get(id);
    let result = ServiceHelper.getCacheItemByPaged<Division>(
      ServiceHelper.key.Division,
      (x) => {
        return x.Id == id;
      }
    );
    if (result) {
      debugger;
      return result;
    }
    let response = await this.requestService.get<Division>(url).toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      ServiceHelper.cacheItemByPaged.push(ServiceHelper.key.Division, x);

      return x;
    });
  }

  async set(item: Division) {
    let response = await this.requestService
      .put<Division, HowellResponse<Division>>(
        DivisionUrl.edit(item.Id),
        SaveModel.toModel(item, SaveModel.formMustField.division)
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      return x;
    });
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<Division>(DivisionUrl.del(id))
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division);
  }

  async list(item?: GetDivisionsParams) {
    if (!item) {
      let result = ServiceHelper.cache.get<PagedList<Division>>(
        ServiceHelper.key.Division
      );
      if (result) {
        return result;
      }

      item = {
        PageSize: 99999,
      };
    }
    let response = await this.requestService
      .post<GetDivisionsParams, HowellResponse<PagedList<Division>>>(
        DivisionUrl.list(),
        item
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      ServiceHelper.cache.set(ServiceHelper.key.Division, x);
      return x;
    });
  }

  async tree() {
    let response = await this.requestService
      .get<DivisionTree>(DivisionUrl.tree())
      .toPromise();
    return ServiceHelper.ResponseProcess(response, DivisionTree);
  }

  async volumesHistory(item: GetDivisionVolumesParams, divisionsId: string) {
    let response = await this.requestService
      .post<GetDivisionVolumesParams, HowellResponse<PagedList<GarbageVolume>>>(
        DivisionUrl.volumesHistory(divisionsId),
        item
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, GarbageVolume);
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
    return ServiceHelper.ResponseProcess(response, EventNumberStatistic);
  }

  async statisticNumber(divisionsId: string) {
    let response = await this.requestService
      .get<DivisionNumberStatistic>(DivisionUrl.statisticNumber(divisionsId))
      .toPromise();

    return ServiceHelper.ResponseProcess(response, DivisionNumberStatistic);
  }

  async statisticNumberList(item: GetDivisionStatisticNumbersParams) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParams,
        HowellResponse<PagedList<DivisionNumberStatistic>>
      >(DivisionUrl.statisticNumberList(), item)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, DivisionNumberStatistic);
  }

  async statisticNumberListV2(item: GetDivisionStatisticNumbersParamsV2) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParamsV2,
        HowellResponse<DivisionNumberStatisticV2[]>
      >(DivisionUrl.statisticNumberHistoryList(), item)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, DivisionNumberStatisticV2);
  }
}

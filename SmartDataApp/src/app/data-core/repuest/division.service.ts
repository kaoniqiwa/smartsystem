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
import { Page, PagedList } from "../model/page";
import { BatchRequest, BatchResult } from "../model/batch";
import { HowellResponse } from "../model/response";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
import { DivisionUrl } from "../url/waste-regulation/division-url";
import { classToPlain } from "class-transformer";
import { SessionUser } from "src/app/common/tool/session-user";

interface CacheConfig {
  handle: NodeJS.Timer;
  loading: boolean;
}
interface CacheConfigs {
  [key: string]: CacheConfig;
}

@Injectable({
  providedIn: "root",
})
export class DivisionRequestService {
  user: SessionUser;
  constructor(private requestService: HowellAuthHttpService) {
    this.user = new SessionUser();
  }
  async create(item: Division) {
    let data = classToPlain(item);
    // SaveModel.toModel(item, SaveModel.formMustField.division)
    let response = await this.requestService
      .post<Division, HowellResponse<Division>>(DivisionUrl.basic(), data)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      // ServiceHelper.cacheItemByPaged.push(ServiceHelper.key.Division, x);
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
      return result;
    }
    let response = await this.requestService.get<Division>(url).toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      ServiceHelper.cacheItemByPaged.push(ServiceHelper.key.Division, x);

      return x;
    });
  }

  async set(item: Division) {
    let data = classToPlain(item) as Division;
    // SaveModel.toModel(item, SaveModel.formMustField.division)
    let response = await this.requestService
      .put<Division, HowellResponse<Division>>(DivisionUrl.edit(item.Id), data)
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      // ServiceHelper.cache.set(ServiceHelper.key.Division, x);
      ServiceHelper.cache.reset();
      return x;
    });
  }

  async del(id: string) {
    let response = await this.requestService
      .delete<Division>(DivisionUrl.del(id))
      .toPromise();
    return ServiceHelper.ResponseProcess(response, Division).then((x) => {
      // ServiceHelper.cache.set(ServiceHelper.key.Division, null);
      ServiceHelper.cache.reset();
      return x;
    });
  }

  children(parentId?: string) {
    if (!parentId) {
      if (this.user.userDivision && this.user.userDivision.length > 0) {
        parentId = this.user.userDivision[0].Id;
      }
    }

    let params = new GetDivisionsParams();
    params.ParentId = parentId;
    return this.list(params);
  }

  async list(item?: GetDivisionsParams) {
    // if (!item) {
    //   let result = ServiceHelper.cache.get<PagedList<Division>>(
    //     ServiceHelper.key.Division
    //   );
    //   if (result) {
    //     console.log("使用缓存");
    //     return result;
    //   }

    //   item = new GetDivisionsParams();
    // } else if (item.Ids) {
    //   let result = new Array<Division>();
    //   let all = true;
    //   for (const id of item.Ids) {
    //     let item = ServiceHelper.cacheItemByPaged.get<Division>(
    //       ServiceHelper.key.Division,
    //       (x) => x.Id == id
    //     );
    //     if (!item) {
    //       all = false;
    //       break;
    //     }
    //     result.push(item);
    //   }
    //   if (all) {
    //     let page: Page = {
    //       PageIndex: 1,
    //       PageSize: result.length,
    //       TotalRecordCount: result.length,
    //       PageCount: 1,
    //       RecordCount: result.length,
    //     };
    //     return {
    //       Page: page,
    //       Data: result,
    //     };
    //   }
    // }
    if (!item) {
      item = {};
    }
    if (!item.PageSize) {
      item.PageSize = ServiceHelper.pageMaxSize;
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
  config: CacheConfigs = {
    statisticNumberList: {
      handle: undefined,
      loading: false,
    },
  };

  getCache<T>(key: string, config: CacheConfig) {
    if (config.loading) {
      let result = ServiceHelper.cache.get<T>(key);
      if (result) {
        return result;
      }
    }
    config.loading = true;
    config.handle = setTimeout(() => {
      ServiceHelper.cache.set(key, undefined);
      config.loading = false;
      config.handle = undefined;
    }, 1000);
  }

  async statisticNumberList(item: GetDivisionStatisticNumbersParams) {
    let response = await this.requestService
      .post<
        GetDivisionStatisticNumbersParams,
        HowellResponse<PagedList<DivisionNumberStatistic>>
      >(DivisionUrl.statisticNumberList(), item)
      .toPromise();
    return ServiceHelper.ResponseProcess(
      response,
      DivisionNumberStatistic
    ).then((x) => {
      ServiceHelper.cache.set(DivisionUrl.statisticNumberList(), x);
      return x;
    });
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

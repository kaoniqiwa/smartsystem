import { ClassConstructor, plainToClass } from "class-transformer";
import { AppCaChe } from "../../../common/tool/app-cache/app-cache";
import { DivisionUrl } from "../../url/waste-regulation/division-url";
import { PagedList } from "../page";
import { HowellResponse } from "../response";

export class ServiceHelper {
  static pageMaxSize = 99999;
  static cache = new AppCaChe(1000 * 60 * 30);
  static key = {
    Division: DivisionUrl.basic(),
  };

  static cacheItemByPaged = {
    get: <T>(key: string, predicate: (t: T) => boolean) => {
      let paged = ServiceHelper.cache.get<PagedList<T>>(key);
      if (paged) {
        return paged.Data.find((x) => predicate(x));
      }
    },
    push: <T>(key: string, t: T) => {
      let paged = ServiceHelper.cache.get<PagedList<T>>(key);
      if (paged) {
        paged.Data.push(t);
        paged.Page.RecordCount = paged.Data.length;
        paged.Page.TotalRecordCount = paged.Data.length;
        ServiceHelper.cache.set<PagedList<T>>(key, paged);
      }
    },
  };

  static getCacheItemByPaged<T>(
    key: string,
    predicate: (t: T) => boolean
  ): T | undefined {
    let paged = this.cache.get<PagedList<T>>(key);
    return paged.Data.find((x) => predicate(x));
  }

  static ResponseProcess<T>(
    response: HowellResponse<T>,
    t: ClassConstructor<T>
  ): Promise<T>;
  static ResponseProcess<T>(
    response: HowellResponse<T[]>,
    t: ClassConstructor<T>
  ): Promise<T[]>;
  static ResponseProcess<T>(
    response: HowellResponse<PagedList<T>>,
    t: ClassConstructor<T>
  ): Promise<PagedList<T>>;

  static async ResponseProcess<T>(
    response: HowellResponse<T | T[] | PagedList<T>>,
    t: ClassConstructor<T>
  ) {
    if (response.FaultCode != 0) {
      console.error(response.FaultReason, response.InnerException);
      throw new Error(response.FaultReason);
    }

    if ((response.Data as PagedList<T>).Page) {
      let result = response.Data as PagedList<T>;
      result.Data = plainToClass(
        t,
        (response.Data as PagedList<T>).Data
      ) as unknown as T[];
      return result;
    } else {
      return plainToClass(t, response.Data);
    }
  }
}

import { GarbageBaseUrl } from "../IUrl";

export class DivisionUrl extends GarbageBaseUrl {
  static basic(): string {
    return this.garbage + "Divisions";
  }
  static edit(id: string): string {
    return this.basic() + `/${id}`;
  }
  static del(id: string): string {
    return this.basic() + `/${id}`;
  }
  static get(id: string): string {
    return this.basic() + `/${id}`;
  }
  static list(): string {
    return this.basic() + `/List`;
  }

  static garbageStations(id: string): string {
    return this.basic() + `/${id}/GarbageStations`;
  }

  static tree(): string {
    return this.basic() + `/Tree`;
  }

  static volumesHistory(id: string): string {
    return this.basic() + `/${id}/Volumes/History/List`;
  }

  static eventNumbersHistory(id: string): string {
    return this.basic() + `/${id}/EventNumbers/History/List`;
  }

  static statisticNumber(id: string): string {
    return this.basic() + `/${id}/Statistic/Number`;
  }

  static statisticNumberList(): string {
    return this.basic() + `/Statistic/Number/List`;
  }

  static statisticNumberHistoryList(): string {
    return this.basic() + `/Statistic/Number/History/List`;
  }
}

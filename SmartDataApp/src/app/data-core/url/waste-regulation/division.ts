import { GarbageBaseUrl } from "../IUrl";

export class DivisionUrl extends GarbageBaseUrl {
  static create(): string {
    return this.garbage + "Divisions";
  }
  static edit(id: string): string {
    return this.garbage + `Divisions/${id}`;
  }
  static del(id: string): string {
    return this.garbage + `Divisions/${id}`;
  }
  static get(id: string): string {
    return this.garbage + `Divisions/${id}`;
  }
  static list(): string {
    return this.garbage + `Divisions/List`;
  }

  static garbageStations(id: string): string {
    return this.garbage + `Divisions/${id}/GarbageStations`;
  }

  static tree(): string {
    return this.garbage + `Divisions/Tree`;
  }

  static volumesHistory(id: string): string {
    return this.garbage + `Divisions/${id}/Volumes/History/List`;
  }

  static eventNumbersHistory(id: string): string {
    return this.garbage + `Divisions/${id}/EventNumbers/History/List`;
  }

  static statisticNumber(id: string): string {
    return this.garbage + `Divisions/${id}/Statistic/Number`;
  }

  static statisticNumberList(): string {
    return this.garbage + `Divisions/Statistic/Number/List`;
  }

  static statisticNumberHistoryList(): string {
    return this.garbage + `Divisions/Statistic/Number/History/List`;
  }
}

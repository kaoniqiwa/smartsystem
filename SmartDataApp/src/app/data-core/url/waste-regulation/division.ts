import { IUrl, BaseUrl, GarbageBaseUrl } from "../IUrl";

export class DivisionUrl extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.garbage + 'Divisions';
    }
    edit(id: string): string {
        return this.garbage + `Divisions/${id}`;
    }
    del(id: string): string {
        return this.garbage + `Divisions/${id}`;
    }
    get(id: string): string {
        return this.garbage + `Divisions/${id}`;
    }
    list(): string {
        return this.garbage + `Divisions/List`;
    }

    garbageStations(id: string): string {
        return this.garbage + `Divisions/${id}/GarbageStations`;
    }

    tree(): string {
        return this.garbage + `Divisions/Tree`;
    }

    volumesHistory(id: string): string {
        return this.garbage + `Divisions/${id}/Volumes/History/List`;
    }

    eventNumbersHistory(id: string): string {
        return this.garbage + `Divisions/${id}/EventNumbers/History/List`;
    }

    statisticNumber(id: string): string {
        return this.garbage + `Divisions/${id}/Statistic/Number`;
    }

    statisticNumberList(): string {
        return this.garbage + `Divisions/Statistic/Number/List`;
    }

    statisticNumberHistoryList():string {
        return this.garbage + `Divisions/Statistic/Number/History/List`;
    }
}
import { IConverter } from "../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { CustomTableArgs, FootArgs, TableAttr, TdIconsAttr } from "../../../custom-table/custom-table-model";
import { TableFormControl } from "../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../common/interface/IPageTable";
import { CustomTableEvent } from "../../../custom-table/custom-table-event";
import { ITableField } from "../../../../aiop-system/common/ITableField";
import { GarbageStationNumberStatistic, GetGarbageStationStatisticNumbersParams } from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { Injectable } from "@angular/core";
import { BusinessTable } from "../../../../aiop-system/common/business-table";
import { Page } from "../../../../data-core/model/page";
import { GarbageStation, GetGarbageStationsParams } from "../../../../data-core/model/waste-regulation/garbage-station";
import "../../../../common/string/hw-string";
import { TableAttribute } from '../../../../common/tool/table-form-helper';
import {SearchControl  } from "./search"; 
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service";
import { GarbageStationDao } from "../../../../data-core/dao/garbage-station-dao";
@Injectable()
export class BusinessService {
    garbageStationDao:GarbageStationDao;
    statistics:GarbageStationNumberStatistic[]=new Array();
    table = new StatisticTable();
    search = new SearchControl();

    dataSource_ = new Array<GarbageStation>(); 

    set dataSource(items: GarbageStation[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    constructor(private garbageStationService: GarbageStationRequestService) {
        this.garbageStationDao = new GarbageStationDao(garbageStationService);
    }

    async stationStatistic() {
        const result =await this.garbageStationDao.allGarbageStationsStatistic();
        return result.Data;
    }

    async requestData(pageIndex: number, callBack?: (page: Page) => void) {
        const response = await this.garbageStationService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
        let data = new Statistics();
        data.garbageStations = response.Data.Data;
        data.items = this.statistics;

        this.table.clearItems();
        this.dataSource = [];
        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = response.Data.Page.TotalRecordCount;
        this.dataSource = response.Data.Data;
        if (callBack) callBack(response.Data.Page);
    }; 

    getRequsetParam(pageIndex: number, search: SearchControl) {

        const param = new GetGarbageStationsParams();
        param.PageIndex = pageIndex;
      
        param.PageSize = 10;
        if (search.searchText && search.other == false)
            param.Name = search.searchText;
        return param;
    }

}


export class StatisticTable extends BusinessTable implements IConverter, IPageTable<GarbageStationNumberStatistic> {
    dataSource = new CustomTableArgs<TableField>({
        hasTableOperationTd: false,
        hasHead: true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        eventDelegate: (event: CustomTableEvent) => {

        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "20%",
            tdInnerAttrName: "name"
        })],
        iconTd: [],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });
    scrollPageFn: (event: CustomTableEvent) => void;

    form = new TableFormControl<GarbageStationNumberStatistic>(this);
    constructor() {
        super();
    }
    addItem(item: GarbageStationNumberStatistic): void {

    }
    editItem(item: GarbageStationNumberStatistic): void {

    }
    delItemFn: (id: string) => void;
    updateItemFn: (item: GarbageStationNumberStatistic) => void;
    addItemFn: (item: GarbageStationNumberStatistic) => void;
    findItemFn: (id: string) => GarbageStationNumberStatistic;

    Convert<Statistics, CustomTableArgs>(input: Statistics, output: CustomTableArgs) {
        const items = new Array<TableField>();
        var tds: TdIconsAttr[] = new Array();
        if (input instanceof Statistics) {
            var stations = input.garbageStations.filter(x => x.DryFull || x.WetFull);
            stations = stations.sort((a, b) => {
                return ''.naturalCompare(b.UpdateTime, a.UpdateTime);
            });
            var stationsX = input.garbageStations.filter(x => !x.DryFull);
            stationsX = stationsX.sort((a, b) => {
                return ''.naturalCompare(b.UpdateTime, a.UpdateTime);
            });

            for (const item of stations) {
                items.push(this.toTableModel(item));
                const find = input.items.find(x => x.Id == item.Id);
                tds.push(this.toIconModel(find));
            }
            for (const item of stationsX) {
                items.push(this.toTableModel(item));
                const find = input.items.find(x => x.Id == item.Id);                
                tds.push(this.toIconModel(find));
            }

        }
        if (output instanceof CustomTableArgs) {
            output.iconTd = tds;
            output.values = [...output.values, ...items];
        }

        return output;
    }



    toTableModel(item: GarbageStation) {
        let tableField = new TableField();
        tableField.id = item.Id;
        tableField.name = item.Name;
        return tableField;
    }

    toIconModel(item: GarbageStationNumberStatistic) {
        const cans = new Array<{
            colorClass: string;
            iconClass: string;
            width: string;
            bgColorClass: string;
        }>(), td = new TdIconsAttr();
        for (let i = 0; i < item.DryTrashCanNumber; i++) {
            const can = {
                colorClass: 'gray-text2',
                iconClass: 'howell-icon-full',
                width: '40px',
                bgColorClass: 'blue-bg-transparent-0-2'
            }
            cans.push(can);
        }
        for (let i = 0; i < item.WetTrashCanNumber; i++) {
            const can = {
                colorClass: 'blue-text',
                iconClass: 'howell-icon-full',
                width: '40px',
                bgColorClass: 'blue-bg-transparent-0-2'
            }
            cans.push(can);
        }

        for (let i = 0; i < (item.TrashCanNumber - item.WetTrashCanNumber - item.DryTrashCanNumber); i++) {
            const can = {
                colorClass: 'blue-text',
                iconClass: 'howell-icon-empty',
                width: '40px',
                bgColorClass: 'blue-bg-transparent-0-2'
            }
            cans.push(can);
        }
        td.width = (60 * cans.length) + 'px';
        td.icons = cans;
        td.key = item.Id;
        return td;

    }
}

export class Statistics implements IBusinessData {
    items: GarbageStationNumberStatistic[];
    garbageStations: GarbageStation[];
}

export class TableField implements ITableField {
    id: string;
    name: string;
}

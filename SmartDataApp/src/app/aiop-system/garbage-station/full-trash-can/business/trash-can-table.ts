import { IConverter } from "../../../../common/interface/IConverter";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { CustomTableArgs, FootArgs, TableAttr, TableOperationBtn, TdIconsAttr } from "../../../../shared-module/custom-table/custom-table-model";
import { TableFormControl } from "../../../../common/tool/table-form-helper";
import { IPageTable } from "../../../../common/interface/IPageTable";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../shared-module/custom-table/custom-table-event";
import { ITableField } from "../../../common/ITableField";
import { GarbageStationNumberStatistic } from "../../../../data-core/model/waste-regulation/garbage-station-number-statistic";
import { Injectable } from "@angular/core";
import { BusinessTable } from "../../../common/business-table"; 
import { Page } from "../../../../data-core/model/page";

@Injectable()
export class BusinessService {
 
    table = new StatisticTable();
    constructor() { 
       
    }
    loadTableData(statistics: GarbageStationNumberStatistic[]) {
        this.table.clearItems();
        const list = new Statistics();
        list.items = statistics;

        this.table.Convert(list, this.table.dataSource);
        this.table.totalCount = statistics.length;

        this.table.initPagination({ PageCount: 1 } as Page, async (index) => {

        });
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
        var tds:TdIconsAttr[]=new Array();
        if (input instanceof Statistics) {
            for (const item of input.items) {
                items.push(this.toTableModel(item));
                 tds.push(this.toIconModel(item));
            }
        }
        if (output instanceof CustomTableArgs) {
            output.iconTd = tds;
            output.values = [...output.values, ...items];
        }
        
        return output;
    }



    toTableModel(item: GarbageStationNumberStatistic) {
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
            bgColorClass:string;
        }>(), td = new TdIconsAttr();
        for (let i = 0; i < item.DryTrashCanNumber; i++) {
            const can = {
                colorClass: 'gray-text2',
                iconClass: 'howell-icon-full',
                width: '40px',
                bgColorClass:'blue-bg-transparent-0-2'
            }
            cans.push(can);
        }
        for (let i = 0; i < item.WetTrashCanNumber; i++) {
            const can = {
                colorClass: 'blue-text',
                iconClass: 'howell-icon-full',
                width: '40px',
                bgColorClass:'blue-bg-transparent-0-2'
            }
            cans.push(can);
        }
 
        for (let i = 0; i < (item.TrashCanNumber - item.WetTrashCanNumber - item.DryTrashCanNumber); i++) {
            const can = {
                colorClass: 'blue-text',
                iconClass: 'howell-icon-empty',
                width: '40px',
                bgColorClass:'blue-bg-transparent-0-2'
            }
            cans.push(can);
        }
        td.width = (60*cans.length)+'px';
        td.icons = cans;
        td.key = item.Id;
        return td;

    }
}

export class Statistics implements IBusinessData {
    items: GarbageStationNumberStatistic[];
}

export class TableField implements ITableField {
    id: string;
    name: string;
}

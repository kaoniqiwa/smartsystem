import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../common/interface/IConverter";
import { GarbageStation } from "../../../../data-core/model/waste-regulation/garbage-station";
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
import { CustomTableEvent } from "../../../custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, TableAttr } from "../../../custom-table/custom-table-model";
import { ITableField } from "../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../aiop-system/common/business-table"; 
import { Injectable } from "@angular/core"; 
import { Division } from "../../../../data-core/model/waste-regulation/division"; 
import { Page } from "../../../../data-core/model/page";
import { StationStateEnum } from "../../../../common/tool/enum-helper";
@Injectable()
export class BusinessService {

    table = new GarbageStationTable(this.datePipe);
    constructor(private datePipe:DatePipe) {

    }
    loadTableData(data:BusinessData) {
        this.table.clearItems();      

        this.table.Convert(data, this.table.dataSource);
        this.table.totalCount = data.statioins.length;

        this.table.initPagination({ PageCount: 1 } as Page, async (index) => {

        });
    } 
}

export class GarbageStationTable extends BusinessTable implements IConverter {
   
    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: false,
        hasHead: true,
        isSingleElection: true,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg: true,
        eventDelegate: (event: CustomTableEvent) => {
          
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "20%",
            tdInnerAttrName: "name"
        }), new TableAttr({
            HeadTitleName: "类型",
            tdWidth: "20%",
            tdInnerAttrName: "type"
        }), new TableAttr({
            HeadTitleName: "状态",
            tdWidth: "20%",
            tdInnerAttrName: "state"
        }), new TableAttr({
            HeadTitleName: "区划",
            tdWidth: "20%",
            tdInnerAttrName: "divisionName"
        }), new TableAttr({
            HeadTitleName: "更新时间",
            tdWidth: "20%",
            tdInnerAttrName: "updateTime"
        })],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });


    constructor(private datePipe: DatePipe) {
        super();
    }
    scrollPageFn: (event: CustomTableEvent) => void;

   
    Convert<BusinessData, CustomTableArgs>(input: BusinessData, output: CustomTableArgs) {
        const items = new Array<TableField>();

        if (input instanceof BusinessData)
            for (const item of input.statioins) {
                const division = input.divisions.find(x=>x.Id==item.DivisionId)
                ,type = input.types.find(x=>x.Type==item.StationType);
                
                
                items.push(this.toTableModel(division,type,item));
            }
        if (output instanceof CustomTableArgs)
            output.values = items;

        return output;
    }

    toTableModel(division: Division,type:GarbageStationType,statioin:GarbageStation) {
        let tableField = new TableField();
        tableField.id = statioin.Id;
        tableField.updateTime = this.datePipe.transform(statioin.UpdateTime, 'yyyy-MM-dd HH:mm');
        tableField.name = statioin.Name;
        tableField.type = type ? type.Name :'-';
        tableField.divisionName = division ? division.Name:'-';
        tableField.state=StationStateEnum[statioin.StationState];
        return tableField;
    }
}

export class BusinessData implements IBusinessData {
    types: GarbageStationType[];
    statioins: GarbageStation[];
    divisions: Division[];
    constructor(types: GarbageStationType[],
        statioins: GarbageStation[],
        divisions: Division[]){
this.types=types;
this.statioins=statioins;
this.divisions=divisions;
    }
}

export class TableField implements ITableField {
    id: string;
    updateTime: string;
    name: string;
    state:string;
    type:string;    
    divisionName: string; 
}

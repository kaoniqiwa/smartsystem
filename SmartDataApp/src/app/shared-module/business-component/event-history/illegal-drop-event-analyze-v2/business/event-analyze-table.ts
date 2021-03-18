
import { IConverter } from "../../../../../common/interface/IConverter"; 
import { CustomTableEvent } from "../../../../custom-table/custom-table-event";
import { CustomTableArgs, FootArgs, TableAttr } from "../../../../custom-table/custom-table-model";
import { ITableField } from "../../../../../aiop-system/common/ITableField";
import { IBusinessData } from "../../../../../common/interface/IBusiness";
import { BusinessTable } from "../../../../../aiop-system/common/business-table"; 
import { Division } from "../../../../../data-core/model/waste-regulation/division"; 
import { ClassTypeEnum } from "../../illegal-drop-event-analyze/business/search"; 
export class EventAnalyzeTable extends BusinessTable implements IConverter { 
    findDivision:(id:string)=>Division; 
    findStationDivision:(id:string)=>Division; 
    classType:ClassTypeEnum;
    dataSource = new CustomTableArgs<any>({
        hasTableOperationTd: false,
        hasHead: true,
        isSingleElection: true,
        values: [],
        primaryKey: "id",
        isDisplayDetailImg: false,
        eventDelegate: (event: CustomTableEvent) => {
            
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "30%",
            tdInnerAttrName: "name"
        }), new TableAttr({
            HeadTitleName: "区划名称",
            tdWidth: "30%",
            tdInnerAttrName: "divisionName"
        }), new TableAttr({
            HeadTitleName: "乱扔垃圾",
            tdWidth: "30%",
            tdInnerAttrName: "eventNumber"
        })],
        footArgs: new FootArgs({
            hasSelectBtn: false,
            hasSelectCount: false
        })
    });


    constructor() {
        super();
    }
    scrollPageFn: (event: CustomTableEvent) => void;

   
    Convert<EventsAnalyzeRecord, CustomTableArgs>(input: EventsAnalyzeRecord, output: CustomTableArgs) {
        const items = new Array<TableField>();

        if (input instanceof EventsAnalyzeRecord)
            for (const k of input.items.keys()) {
                const val = input.items.get(k);
                items.push(this.toTableModel(k,val.name,val.num));
            }
        if (output instanceof CustomTableArgs)
            output.values = items;

        return output;
    }

    toTableModel(id:string,name:string,eventNumber:number) {
        let tableField = new TableField();
        tableField.id = id;    
        tableField.name=name; 
        if(this.classType==ClassTypeEnum.Division)
        tableField.divisionName= this.findDivision(id).Name;
        else if(this.classType==ClassTypeEnum.Station)
             tableField.divisionName= this.findStationDivision(id).Name;
        tableField.eventNumber = eventNumber;
        return tableField;
    }
}

export class EventsAnalyzeRecord implements IBusinessData {
    items: Map<string, {name:string,num:number}>;
}

export class TableField implements ITableField {
    id: string;
    eventNumber: number;
    name: string; 
    divisionName: string; 
}

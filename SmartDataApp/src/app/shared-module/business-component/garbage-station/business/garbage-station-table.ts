import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../common/interface/IConverter";
import { GarbageStation, GetGarbageStationsParams } from "../../../../data-core/model/waste-regulation/garbage-station";
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
import { GarbageStationRequestService } from "../../../../data-core/repuest/garbage-station.service"; 
import { SearchControl } from "./search";
import { DivisionDao } from "../../../../data-core/dao/division-dao";
import { GarbageStationTypeDao } from "../../../../data-core/dao/garbage-station-type-dao";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { GarbageStationTypeRequestService } from "../../../../data-core/repuest/garbage-station.service";
@Injectable()
export class BusinessService {
    dataSource_ = new Array<GarbageStation>(); 

    divisions: Division[] = new Array(); 
    garbageStationTypes:GarbageStationType[]=new Array();

    search = new SearchControl();
    set dataSource(items: GarbageStation[]) {
        for (const x of items)
            this.dataSource_.push(x);
    }

    get dataSource() {
        return this.dataSource_;
    }
    table = new GarbageStationTable(this.datePipe);
    private divisionDao: DivisionDao;
    private  garbageStationTypeDao:GarbageStationTypeDao;
    constructor(private datePipe:DatePipe,private garbageStationService:GarbageStationRequestService
       , divisionService: DivisionRequestService
        , garbageStationTypeService:GarbageStationTypeRequestService) {
        this.divisionDao = new DivisionDao(divisionService);
        this.garbageStationTypeDao=new GarbageStationTypeDao(garbageStationTypeService);
    }

    async  requestGarbageStationType(){
        const result = await this.garbageStationTypeDao.garbageStationType();
        return result;
    }

    async requestDivisions() {
        const result = await this.divisionDao.allDivisions();
        return result.Data;
    }
   
    async requestData(pageIndex: number, callBack?: (page: Page) => void) {
        const response = await this.garbageStationService.list(this.getRequsetParam(pageIndex, this.search)).toPromise();
        let data = new BusinessData(this.garbageStationTypes,response.Data.Data,this.divisions);       

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

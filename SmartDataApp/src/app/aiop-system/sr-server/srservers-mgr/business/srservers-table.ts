import { IBusinessData } from "../../../../common/Interface/IBusiness";
import { SRServer } from "../../../../data-core/model/aiop/sr-server";
import { ITableField } from "../../../common/ITableField";
import { IPageTable } from "../../../../common/interface/IPageTable";
import { CustomTableArgs, TableAttr, TableOperationBtn } from "../../../../shared-module/custom-table/custom-table-model";
import { IConverter } from "../../../../common/interface/IConverter";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../shared-module/custom-table/custom-table-event";
import { TableFormControl } from "../../../../common/tool/table-form-helper";
import { BusinessTable } from "../../../common/business-table";
export class SRServiceTable extends BusinessTable implements IConverter, IPageTable<SRServer>{
    form = new TableFormControl<SRServer>(this);   
    updateItemFn: (item: SRServer) => void;
    addItemFn: (item: SRServer) => void;
    scrollPageFn: (event: CustomTableEvent) => void;
    findItemFn: (id: string) => SRServer;
    delItemFn:(id:string)=>void;
    syncFn:(id:string)=>void;   
    dataSource = new CustomTableArgs<TableField>({
        hasTableOperationTd: true,
        hasHead: true,
        isSingleElection: false,
        values: [],
        primaryKey: "id",
        eventDelegate: (event: CustomTableEvent) => {
            if (event.eventType == CustomTableEventEnum.ScrollDown)
            this.scrollPageFn(event);
        },
        tableAttrs: [new TableAttr({
            HeadTitleName: "名称",
            tdWidth: "25%",
            tdInnerAttrName: "name"
        }), new TableAttr({
            HeadTitleName: "协议",
            tdWidth: "25%",
            tdInnerAttrName: "protocolType"
        }), new TableAttr({
            HeadTitleName: "用户名",
            tdWidth: "20%",
            tdInnerAttrName: "protocolType"
        }), new TableAttr({
            HeadTitleName: "密码",
            tdWidth: "20%",
            tdInnerAttrName: "password"
        })]
        , tableOperationBtns: [
            new TableOperationBtn({
                css: 'fa fa-retweet td-icon',
                title: '同步',
                callback: (item: TableField) => {
                   if(this.syncFn)this.syncFn(item.id);
                }
            }),
            new TableOperationBtn({
                css: 'howell-icon-modification td-icon',
                title: '编辑',
                callback: (item: TableField) => {
                    this.form.show = true;
                    this.form.editItem = this.findItemFn(item.id);
                }
            }),
            new TableOperationBtn({
                css: 'howell-icon-delete-bin td-icon',
                title: '删除',
                callback: (item: TableField) => { 
                    if(this.delItemFn)this.delItemFn(item.id);
                }
            }) 
        ]
    });
    constructor(){
        super();
    }
  
    Convert<SRServers, CustomTableArgs>(input: SRServers, output: CustomTableArgs) {
        const items = new Array<TableField>();       
        if (input instanceof SRServers) 
            for (const item of input.items) {
                items.push(this.toTableModel(item));            
        }
        if (output instanceof CustomTableArgs) 
            output.values =items;         
        return output;
    }

    toTableModel(item: SRServer) {
        let tableField = new TableField();
        tableField.id = item.Id;
        tableField.name=item.Name;
        tableField.password=item.Password;
        tableField.protocolType = item.ProtocolType; 
        tableField.name = item.Name;         
        return tableField;
    }    

    addItem(item: SRServer) {
        this.dataSource.values.push(this.toTableModel(item));
        this.addItemFn(item);
        this.dataSource.footArgs.totalRecordCount += 1;
    }
  

    editItem(item: SRServer) {
        const findVal = this.dataSource.values.find(x => x.id == item.Id);
        findVal.name = item.Name;      
        findVal.protocolType = item.ProtocolType;
       findVal.password=item.Password;
       findVal.userName=item.Username;
    }
}

export class TableField implements ITableField{
    /**平台ID */
    id: string;
    /**平台名称(可选) */
    name: string; 
    /**协议类型:Artemis */
    protocolType: string; 
    userName: string;  
    password: string;  
 }
 
 
 export class SRServers implements IBusinessData {
     items: SRServer[];
 }
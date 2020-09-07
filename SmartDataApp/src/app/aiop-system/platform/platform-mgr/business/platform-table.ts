import { IBusinessData } from "../../../../common/Interface/IBusiness";
import { Platform } from "../../../../data-core/model/aiop/platform";
import { ITableField } from "../../../common/ITableField";
import { IPageTable } from "../../../../common/interface/IPageTable";
import { CustomTableArgs, TableAttr, TableOperationBtn } from "../../../../shared-module/custom-table/custom-table-model";
import { DatePipe } from "@angular/common";
import { IConverter } from "../../../../common/interface/IConverter";
import { CustomTableEvent, CustomTableEventEnum } from "../../../../shared-module/custom-table/custom-table-event";
import { TableFormControl } from "../../../../common/tool/table-form-helper";
import { ConfirmDialog } from "../../../../shared-module/confirm-dialog/confirm-dialog.component";
import { MessageBar } from "../../../../common/tool/message-bar";
import { BusinessTable  } from "../../../common/business-table";
export class PlatformTable extends BusinessTable implements IConverter, IPageTable<Platform> {
    form = new TableFormControl<Platform>(this);
    updateItemFn: (item: Platform) => void;
    addItemFn: (item: Platform) => void;
    scrollPageFn: (event: CustomTableEvent) => void;
    findItemFn: (id: string) => Platform;
    delItemFn:(id:string)=>void;
    syncFn:(id:string)=>void;
    confirmDialog_:ConfirmDialog;
    msg = new MessageBar();
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
            tdWidth: "20%",
            tdInnerAttrName: "name"
        }), new TableAttr({
            HeadTitleName: "地址",
            tdWidth: "20%",
            tdInnerAttrName: "url"
        }), new TableAttr({
            HeadTitleName: "协议类型",
            tdWidth: "20%",
            tdInnerAttrName: "protocolType"
        }), new TableAttr({
            HeadTitleName: "状态",
            tdWidth: "10%",
            tdInnerAttrName: "state"
        }), new TableAttr({
            HeadTitleName: "更新时间",
            tdWidth: "20%",
            tdInnerAttrName: "updateTime"
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
    constructor(private datePipe:DatePipe){
        super();
    }
   
    Convert<Platforms, CustomTableArgs>(input: Platforms, output: CustomTableArgs) {
        const items = new Array<TableField>();       
        if (input instanceof Platforms) 
            for (const item of input.items) {
                items.push(this.toTableModel(item));            
        }
        if (output instanceof CustomTableArgs) 
            output.values =items;         
        return output;
    }

    toTableModel(item: Platform) {
        let tableField = new TableField();
        tableField.id = item.Id;
        tableField.state = item.State == 0 ? '正常':'故障';
        tableField.protocolType = item.ProtocolType; 
        tableField.name = item.Name;
        tableField.updateTime = this.datePipe.transform(item.UpdateTime,'yyyy-MM-dd hh:mm');
        tableField.url = item.Url;
       
        return tableField;
    }   

    addItem(item: Platform) {
        this.dataSource.values.push(this.toTableModel(item));
        this.addItemFn(item);
        this.dataSource.footArgs.totalRecordCount += 1;
    }  

    editItem(item: Platform) {
        const findVal = this.dataSource.values.find(x => x.id == item.Id);
        findVal.name = item.Name;
        findVal.state = item.State == 0 ? '正常':'故障';
        findVal.protocolType = item.ProtocolType;
        findVal.updateTime = this.datePipe.transform(item.UpdateTime,'yyyy-MM-dd hh:mm');
        findVal.url = item.Url; 
    }

}
export class TableField implements ITableField{
   /**平台ID */
   id: string;
   /**平台名称(可选) */
   name: string; 
   /**协议类型:Artemis */
   protocolType: string;
   /**连接地址 */
   url: string; 
   /**状态(可选)：0-正常，1-故障 */
   state: string; 
   /**更新时间 */
   updateTime:  string; 
}


export class Platforms implements IBusinessData {
    items: Platform[];
}
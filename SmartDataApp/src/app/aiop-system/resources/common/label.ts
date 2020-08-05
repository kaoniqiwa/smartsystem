import { ResourceLabel } from "../../../data-core/model/resource-label";
import { InputTagArea } from "../../../shared-module/input-tag-area/input-tag-area";
import { MessageBar } from "../../../common/tool/message-bar";
export class Labels{
    dataSource_ = new Array<InputTagArea>();
    show = false;
    messageBar = new MessageBar();
    set dataSource(items: Partial< ResourceLabel>[]) {
        for (const x of items){
            if(x.hasOwnProperty("type"))
                this.dataSource_.push(new InputTagArea(x.Id,x.Name,false,2));
            else   this.dataSource_.push(new InputTagArea(x.Id,x.Name,false,1));
        }          
    }

    get _dataSource(){
        return this.dataSource_;
    }
    

    clearDataSource(){this.dataSource_=new Array<InputTagArea>() }

    createFn : (item: InputTagArea,fn:(id:string)=>void) =>void;
    delFn : (item: InputTagArea,fn:(success:boolean)=>void) =>void;
    bind :(items: InputTagArea[]) =>void;
} 
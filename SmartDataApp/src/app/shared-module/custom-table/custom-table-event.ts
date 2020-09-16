
import { IViewEvent } from "../../common/interface/IViewEvent";
import { IBusinessData } from "../../common/interface/IBusiness";

/**
 * 触发事件
 */
export class CustomTableEvent implements IViewEvent {
    eventType:CustomTableEventEnum;
    data:IBusinessData;
    constructor(eventType:CustomTableEventEnum,data:IBusinessData){
        this.data=data;
        this.eventType=eventType;
    }
}

 

export enum CustomTableEventEnum {
    /**
     * 滚动底部触发
     */
    ScrollDown = 'ScrollDown',
    /**
     * 点击某行触发
     */
    Item = 'Item',
    /**
     * 点击全选触发
     */
    SelectAll = 'SelectAll',
    /**
     * 点击取消触发
     */
    SelectCancel = 'SelectCancel',
    /**
     * 点击某行图片触发
     */
    Img='Img',

    TagBtn='TagBtn'
}
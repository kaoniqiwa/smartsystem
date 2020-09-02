import { IViewModel } from "../../common/abstract/Base-View";
import { IBusinessData } from "../../common/Interface/IBusiness";
import { IViewEvent } from "../../common/interface/IViewEvent";
import { HWPaginationOptions } from "../../common/directive/pagination-directive";
import { CustomTableEventEnum, CustomTableEvent } from "./custom-table-event";

export class CustomTableArgs<T extends IBusinessData> implements IViewModel {
    //数据源
    values: T[];
    //数据源主键
    primaryKey: string;
    //是否有操作列
    hasTableOperationTd: boolean;
    //操作列名称
    operationTdName: string;
    //是否有表头
    hasHead: boolean;
    //是否有表脚
    hasFoot: boolean;
    //表头属性
    tableAttrs: TableAttr[];
    //按钮组
    tableOperationBtns: TableOperationBtn[];
    //是否能选中
    disableSelect: boolean;
    //是否单选
    isSingleElection: boolean;
    //底部参数
    footArgs: FootArgs;
    //表格宽度
    tableWidth: string;
    //是否显示详细图片
    isDisplayDetailImg: boolean;

    eventDelegate: (tag: IViewEvent) => void;
    paginationOptions: HWPaginationOptions;
    iconTextTh: TableTh;
    iconTextTagAttr: TableIconTextTagAttr[];
    constructor(options: {
        values?: T[],
        primaryKey?: string,
        hasTableOperationTd?: boolean;
        operationTdName?: string;
        hasHead?: boolean;
        hasFoot?: boolean;
        tableAttrs?: TableAttr[];
        tableOperationBtns?: TableOperationBtn[];
        disableSelect?: boolean,
        isSingleElection?: boolean,
        footArgs?: FootArgs,
        tableWidth?: string,
        isDisplayDetailImg?: boolean,
        eventDelegate?: (tag: IViewEvent) => void,
        iconTextTh?: TableTh,
        iconTextTagAttr?: TableIconTextTagAttr[]
    } = {}) {
        this.values = options.values;
        this.primaryKey = options.primaryKey;
        this.hasTableOperationTd = options.hasTableOperationTd;
        this.operationTdName = options.operationTdName ? options.operationTdName : "操作";
        this.hasHead = options.hasHead;
        this.hasFoot = options.hasFoot == false ? options.hasFoot : true;
        this.tableAttrs = options.tableAttrs;
        this.tableOperationBtns = options.tableOperationBtns;
        this.disableSelect = options.disableSelect || false;
        this.isSingleElection = options.isSingleElection || false;
        this.footArgs = options.footArgs || new FootArgs();
        this.tableWidth = options.tableWidth || "100%";
        this.isDisplayDetailImg = options.isDisplayDetailImg || false;
        this.eventDelegate = options.eventDelegate;
        this.iconTextTh = options.iconTextTh;
        this.iconTextTagAttr = options.iconTextTagAttr;
    }
}

export class TableAttr implements IViewModel {
    //表头title名称
    HeadTitleName: string;
    //表格Td宽度 格式如:'20%'
    tdWidth: string;
    //表格Td的显示的属性名称;
    tdInnerAttrName: string;
    //表格Td的显示的属性样式名称;
    tdInnerAttrClassName: string;
    //是否是img
    isImg: boolean;
    //是否小img
    isSmallImg: boolean;
    //是否鼠标滑过小图片变大;
    isHoverBig: boolean;
    //是否html
    isHTML: boolean;

    constructor(options: {
        HeadTitleName?: string,
        tdWidth?: string,
        tdInnerAttrName?: string,
        tdInnerAttrClassName?: string,
        isImg?: boolean,
        isSmallImg?: boolean,
        isHoverBig?: boolean,
        isHTML?: boolean
    } = {}) {
        this.HeadTitleName = options.HeadTitleName || '';
        this.tdWidth = options.tdWidth || '';
        this.tdInnerAttrName = options.tdInnerAttrName || '';
        this.tdInnerAttrClassName = options.tdInnerAttrClassName || '';
        this.isImg = options.isImg || false;
        this.isSmallImg = options.isSmallImg || false;
        this.isHoverBig = options.isHoverBig || false;
        this.isHTML = options.isHTML || false;
    }
}

export class TableTh {
    width: string;
    name: string;
    constructor(width: string, name: string) {
        this.width = width;
        this.name = name;
    }
}

export class TableIconTextTagAttr implements IViewModel {
    texts: { id: string, label: string }[] = new Array<{ id: string, label: string }>();
    key: string;
    callback: Function = () => { };

}

export class TableOperationBtn implements IViewModel {
    //按钮样式
    css: string;
    //按鈕title
    title: string;
    //方法
    callback: Function;
    constructor(options: {
        css?: string,
        title?: string,
        callback?: Function,
    } = {}) {
        this.css = options.css;
        this.title = options.title || '';
        this.callback = options.callback || function () { };
    }
}

export class FootArgs implements IViewModel {
    //是否显示选中数量
    hasSelectCount: boolean;
    //是否有当前数/总数
    hasCount: boolean;
    //是否显示全选反选取消
    hasSelectBtn: boolean;
    //总条数
    totalRecordCount: number;
    /**总页数 */
    pageCount: number;
    constructor(options: {
        hasSelectCount?: boolean,
        hasCount?: boolean,
        hasSelectBtn?: boolean,
        totalRecordCount?: number,
        pageCount?: number
    } = {}) {
        this.hasSelectCount = options.hasSelectCount == false ? options.hasSelectCount : true;
        this.hasCount = options.hasCount == false ? options.hasCount : true;
        this.hasSelectBtn = options.hasSelectBtn == false ? options.hasSelectBtn : true;
        this.totalRecordCount = options.totalRecordCount || 0;
        this.pageCount = options.pageCount || 1;
    }
}
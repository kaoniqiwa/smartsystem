import { IViewModel } from "../../common/abstract/base-view";
import { IBusinessData } from "../../common/interface/IBusiness";
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
  iconTd: TdIconsAttr[];
  galleryTd: GalleryTdAttr[];
  galleryTdWidth: string;
  tooltipTd: TooltipTd;
  constructor(
    options: {
      values?: T[];
      primaryKey?: string;
      hasTableOperationTd?: boolean;
      operationTdName?: string;
      hasHead?: boolean;
      hasFoot?: boolean;
      tableAttrs?: TableAttr[];
      tableOperationBtns?: TableOperationBtn[];
      disableSelect?: boolean;
      isSingleElection?: boolean;
      footArgs?: FootArgs;
      tableWidth?: string;
      isDisplayDetailImg?: boolean;
      eventDelegate?: (tag: IViewEvent) => void;
      iconTextTh?: TableTh;
      iconTextTagAttr?: TableIconTextTagAttr[];
      iconTd?: TdIconsAttr[];
      galleryTd?: GalleryTdAttr[];
      tooltipTd?: TooltipTd;
      galleryTdWidth?: string;
    } = {}
  ) {
    this.values = options.values;
    this.primaryKey = options.primaryKey;
    this.hasTableOperationTd = options.hasTableOperationTd;
    this.operationTdName = options.operationTdName
      ? options.operationTdName
      : "操作";
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
    this.iconTd = options.iconTd;
    this.galleryTd = options.galleryTd;
    this.galleryTdWidth = options.galleryTdWidth || "30%";
    this.tooltipTd = options.tooltipTd;
  }
}

export class TableAttr implements IViewModel {
  //表头title名称
  HeadTitleName: string;
  //表格Td宽度 格式如:'20%'
  tdWidth: string;
  //表格Td的显示的属性名称;
  tdInnerAttrName: string;
  tdInnerAttrTitle: string;
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
  //图标css class 及文本
  iocnClassLabel: boolean;
  //排序
  orderBy: {
    asOrderBy: OrderByEnum;
    id: string;
  };
  /** 固定宽度 */
  fixedWidth: string;
  /** 对齐方式 */
  align: boolean;
  /** 样式名称 */
  className?: string;

  itemClassName?: string[];

  constructor(
    options: {
      HeadTitleName?: string;
      tdWidth?: string;
      tdInnerAttrName?: string;
      tdInnerAttrTitle?: string;
      tdInnerAttrClassName?: string;
      isImg?: boolean;
      isSmallImg?: boolean;
      isHoverBig?: boolean;
      isHTML?: boolean;
      iocnClassLabel?: boolean;
      align?: boolean;
      orderBy?: {
        asOrderBy: OrderByEnum;
        id: string;
      };
      fixedWidth?: string;
      className?: string;
      itemClassName?: string[];
    } = {}
  ) {
    this.HeadTitleName = options.HeadTitleName || "";
    this.tdWidth = options.tdWidth || "";
    this.tdInnerAttrName = options.tdInnerAttrName || "";
    this.tdInnerAttrClassName = options.tdInnerAttrClassName || "";
    this.iocnClassLabel = options.iocnClassLabel || false;
    this.isImg = options.isImg || false;
    this.isSmallImg = options.isSmallImg || false;
    this.isHoverBig = options.isHoverBig || false;
    this.isHTML = options.isHTML || false;
    this.orderBy = options.orderBy || null;
    this.fixedWidth = options.fixedWidth || "110px";
    this.align = options.align || false;
    this.className = options.className;
    this.itemClassName = options.itemClassName;
    this.tdInnerAttrTitle = options.tdInnerAttrTitle || "";
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

/**图标提示信息 */
export class TooltipTd {
  width: string;
  tdName: string;
  listMap: Map<string, Array<{ icon: string; tip: string }>>;
  constructor(width: string, tdName: string) {
    this.width = width;
    this.tdName = tdName;
  }
}

export class TableIconTextTagAttr implements IViewModel {
  texts: { id: string; label: string }[] = new Array<{
    id: string;
    label: string;
  }>();
  key: string;
  callback: Function = () => {};
}

export class TdIconsAttr implements IViewModel {
  width: string;
  key: string;
  icons: {
    colorClass: string;
    iconClass: string;
    width: string;
    bgColorClass: string;
  }[];
}

export class GalleryTdAttr implements IViewModel {
  imgSrc: string[];
  key: string;
}

export class TableOperationBtn implements IViewModel {
  //按钮样式
  css: string;
  //按鈕title
  title: string;
  //方法
  callback: Function;
  operateType?: string;
  constructor(
    options: {
      css?: string;
      title?: string;
      callback?: Function;
      operateType?: string;
    } = {}
  ) {
    this.css = options.css;
    this.title = options.title || "";
    this.callback = options.callback || function () {};
    this.operateType = options.operateType || "";
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
  constructor(
    options: {
      hasSelectCount?: boolean;
      hasCount?: boolean;
      hasSelectBtn?: boolean;
      totalRecordCount?: number;
      pageCount?: number;
    } = {}
  ) {
    this.hasSelectCount =
      options.hasSelectCount == false ? options.hasSelectCount : true;
    this.hasCount = options.hasCount == false ? options.hasCount : true;
    this.hasSelectBtn =
      options.hasSelectBtn == false ? options.hasSelectBtn : true;
    this.totalRecordCount = options.totalRecordCount || 0;
    this.pageCount = options.pageCount || 1;
  }
}

export enum OrderByEnum {
  up,
  down,
}

export class HTMLString {
  constructor(
    opts: {
      className?: string;
      title?: string;
    },
    value?: any
  ) {
    this.className = opts.className;
    this.title = opts.title;
    this.value = value;
  }
  value: string;
  className: string;
  title: string;

  toString() {
    return this.value;
  }
}

import { DivisionType } from "src/app/data-core/model/enum";

// 嵌套 division 树节点
export interface NestedDivisionTreeNode {
  id: string;
  name: string;
  divisionType: DivisionType;
  isLeaf: boolean;
  createTime: Date | string;
  UpdateTime: Date | string;
  hide: boolean;
  description?: string;
  parentId: string | null;
  children?: NestedDivisionTreeNode[];

  iconClass: "howell-icon-earth" | "howell-icon-map5";
}

export enum IconType {
  earth = "howell-icon-earth",
  map = "howell-icon-map5",
}
export enum FormState {
  none = 0,
  add = 1,
  edit = 2,
}

import { DivisionType } from "src/app/data-core/model/enum";

// 嵌套 division 树节点
interface NestedDivisionTreeNode {
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

enum FormState {
  none = 0,
  add = 1,
  edit = 2,
}
interface DivisionFormData {
  Name: string;
  Id: string;
  ParentName: string;
  Description: string;
}
export { FormState, DivisionFormData };

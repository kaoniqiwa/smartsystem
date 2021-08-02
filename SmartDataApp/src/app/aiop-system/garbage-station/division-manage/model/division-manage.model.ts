import { DateTimePickerDirective } from "src/app/common/directive/date-time-picker.directive";
import { DivisionType } from "src/app/data-core/model/enum";

// 嵌套 division 树节点
export interface NestedDivisionTreeNode {
  id: string;
  name: string;
  divisionType: DivisionType;
  isLeaf: boolean;
  createTime: Date | string;
  UpdateTime: Date | string;

  description?: string;
  parentId: string | null;
  children?: NestedDivisionTreeNode[];
}

export enum FormState {
  none = 0,
  add = 1,
  edit = 2,
}

export enum DivisionTypeToLanguage {
  n = "省份",
}

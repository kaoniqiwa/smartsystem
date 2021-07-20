import { DivisionType } from "../../data-core/model/enum";
import { IViewModel } from "../../common/abstract/base-view";
export class HeaderSquareList implements IViewModel {
  squareItems: SquareItem[];
  headerView: { label: string; id: string; type: DivisionType };
  bodyView: { label: string; id: string; type: DivisionType }[] = new Array();

  set changebodyView(headerId: string) {
    const header = this.squareItems.find((x) => x.id == headerId),
      body = this.squareItems.filter((x) => x.parentId == header.id);
    this.headerView = {
      label: header.label,
      id: header.id,
      type: header.type,
    };
    this.bodyView = new Array();
    for (const x of body)
      this.bodyView.push({
        label: x.label,
        id: x.id,
        type: x.type,
      });
  }
}

export class SquareItem {
  id: string;
  label: string;
  parentId: string;
  type: DivisionType;
  constructor(
    id: string,
    label: string,
    type: DivisionType,
    parentId?: string
  ) {
    this.id = id;
    this.label = label;
    this.parentId = parentId;
    this.type = type;
  }
}
export enum ItemTypeEnum {
  header,
  body,
}

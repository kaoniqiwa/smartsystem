import { IViewModel } from "../../common/abstract/base-view";
import { DivisionTypeEnum } from "../../common/tool/enum-helper"; 
export class HeaderSquareList implements IViewModel {
    squareItems: SquareItem[];
    headerView: { label: string, id: string ,  type:DivisionTypeEnum};
    bodyView: { label: string, id: string,  type:DivisionTypeEnum }[] = new Array();


    set changebodyView(headerId: string) {
        const header = this.squareItems.find(x => x.id == headerId),
            body = this.squareItems.filter(x => x.parentId == header.id);
        this.headerView = {
            label: header.label,
            id: header.id,
            type:header.type
        }
        this.bodyView = new Array();
        for (const x of body)
            this.bodyView.push({
                label: x.label,
                id: x.id,
                type:x.type
            });

    }
}

export class SquareItem{
    id: string;
    label: string;
    parentId: string;
    type:DivisionTypeEnum
    constructor(id: string,
        label: string,
        type:DivisionTypeEnum,
        parentId?: string) {
        this.id = id;
        this.label = label;
        this.parentId = parentId;
        this.type=type;
    }
}
export enum ItemTypeEnum {
    header,
    body
} 
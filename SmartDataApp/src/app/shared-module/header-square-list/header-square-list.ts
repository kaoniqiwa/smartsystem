import { IViewModel } from "../../common/abstract/base-view";

export class HeaderSquareList implements IViewModel {
    squareItems: SquareItem[];
    headerView: { label: string, id: string };
    bodyView: { label: string, id: string }[] = new Array();


    set changebodyView(headerId: string) {
        const header = this.squareItems.find(x => x.id == headerId),
            body = this.squareItems.filter(x => x.parentId == header.id);
        this.headerView = {
            label: header.label,
            id: header.id
        }
        this.bodyView = new Array();
        for (const x of body)
            this.bodyView.push({
                label: x.label,
                id: x.id
            });

    }
}

export class SquareItem{
    id: string;
    label: string;
    parentId: string;
    constructor(id: string,
        label: string,
        parentId?: string) {
        this.id = id;
        this.label = label;
        this.parentId = parentId;
    }
}
export enum ItemTypeEnum {
    header,
    body
}

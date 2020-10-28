import {  ColorEnum} from "../card-content-factory";
export class Hint {
    title: string;
    subTitle: string;
    subTitleColor: ColorEnum;
    tag:any;
}

export class HintList{
    items:Hint[];
}

export enum HintTag{
    IllegalDrop=1,
    MixedInto
}

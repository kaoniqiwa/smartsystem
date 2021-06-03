import {  ColorEnum} from "../card-content-factory";
export class Hint {
    title: string;
    subTitle: string;
    subTitleColor: ColorEnum;
    tag:any;
    linkTipLabel:string;
}

export class HintList{
    items:Hint[];
}

export enum HintTag{
    IllegalDrop=1,
    MixedInto,
    FullStation,
    GarbageStation,
    StationStranded
}

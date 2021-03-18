import { IBusinessData } from "../../../../../common/interface/IBusiness";
export class Divisions implements IBusinessData {
    items:Division[];
}

export class Division implements IBusinessData {
    id: string;
    name: string;
    divisionType: number;
    parentId:string;
    root:boolean;
}
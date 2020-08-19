export interface IUrl{
    create(...param:string[]):string;
    edit(...param:string[]):string;
    del(...param:string[]):string
    get(...param:string[]):string;
    list(...param:string[]):string;
}

export class BaseUrl{
    aiop='/api/howell/ver10/aiop_service/';
}
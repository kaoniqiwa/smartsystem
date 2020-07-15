export interface IUrl{
    create(...param:string[]):string;
    edit(...param:string[]):string;
    del(...param:string[]):string
    get(...param:string[]):string;
    list(...param:string[]):string;
}
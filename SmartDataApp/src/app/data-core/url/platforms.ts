import {  IUrl} from "./IUrl";

export class Platform implements IUrl{
    create(): string {
        return 'Platforms';
    }
    edit(id:string): string {
       return `Platforms/${id}`;
    }
    del(id:string): string {
        return `Platforms/${id}`;
    }
    get(id:string): string {
        return `Platforms/${id}`;
    }
    list(): string {
       return 'Platforms/List';
    }
    sync(id:string): string {
        return `Platforms/${id}/Sync`;
    }
}
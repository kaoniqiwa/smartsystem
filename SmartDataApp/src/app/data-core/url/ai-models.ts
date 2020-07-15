import {  IUrl} from "./IUrl";
export class AIModel implements IUrl{
    create(): string {
         return 'AIModels';
    }
    edit(id:string): string {
        return `AIModels/${id}`
    }
    del(id:string): string {
        return `AIModels/${id}`
    }
    get(id:string): string {
        return `AIModels/${id}`
    }
    list(): string {
        return `AIModels/List`;
    }   
  

}
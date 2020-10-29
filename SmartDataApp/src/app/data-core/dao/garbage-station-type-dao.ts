import { GarbageStationTypeRequestService } from "../repuest/garbage-station.service";

export class GarbageStationTypeDao{
    constructor(private requestService:GarbageStationTypeRequestService){}

   async garbageStationType(){
      const result= await this.requestService.list().toPromise();
      return result.Data;
    }
}
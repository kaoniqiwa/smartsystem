import { Injectable } from "@angular/core";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({
  providedIn: "root",
})
export class RequestGarbageStationsService {
  constructor(private httpService: HowellAuthHttpService) {}
}

import { AxiosDigestInstance } from "howell-http-lib";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Response } from "../model/response";
@Injectable({
    providedIn: 'root'
})
export class ConfigRequestService {
 
  constructor(private http: HttpClient) {
} 
 
     getAIIcons() {
        return this.http.get<any>('assets/ai-icon.json');
    }

    getMQTT(){
      return  this.http.get<{Port:number}>('assets/mqtt.json');
    }
}
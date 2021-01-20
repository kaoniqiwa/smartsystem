import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http"; 
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

    getVideo(){
      return this.http.get<{beforeInterval:number,afterInterval:number}>('assets/video.json')
    }

    xls(name:string){ 
      return this.http.get('assets/'+name,{
        responseType: 'arraybuffer'
      });
    } 

}
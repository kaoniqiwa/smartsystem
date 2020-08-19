import { AxiosDigestInstance } from "howell-http-lib";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ConfigRequestService {

  private  axios: AxiosDigestInstance;
    constructor() {
        this.axios = new AxiosDigestInstance(null, null, false);
    }

     getAIIcons() {
        return this.axios.get('assets/ai-icon.json');
    }

}
import { Injectable } from "@angular/core";
import { AuthCode } from "../model/auth-code";
import { SmsProtocolType } from "../model/enum";
import { HowellResponse } from "../model/response";
import { ServiceHelper } from "../model/waste-regulation/request-service-processor";
import { SmsUrl } from "../url/sms-url";
import { HowellAuthHttpService } from "./howell-auth-http.service";

@Injectable({
  providedIn: "root",
})
export class SmsRequestService {
  constructor(private requestService: HowellAuthHttpService) {}

  async getAuthCodes(PhoneNo: string) {
    let response = await this.requestService
      .get<AuthCode>(SmsUrl.authcodes(PhoneNo))
      .toPromise();
    return ServiceHelper.ResponseProcess(response, AuthCode);
  }
  async postAuthCodes(
    phoneNo: string,
    protocolType: SmsProtocolType = SmsProtocolType.aliyun
  ) {
    let response = await this.requestService
      .post<any, HowellResponse<AuthCode>>(
        SmsUrl.authcodes(phoneNo, protocolType)
      )
      .toPromise();
    return ServiceHelper.ResponseProcess(response, AuthCode);
  }
}

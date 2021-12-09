import { Injectable } from "@angular/core";
import { UserConfigService } from "../../data-core/repuest/user-config.service";
import { UserUrl } from "../../data-core/url/user-url";

export enum UserConfigType {
  Map = 1,
  MapStatisticVideo = 2,
  MapStatisticLayout = 3,
  GisMapVideoLive = 4,
  VideoRuleState = 5,
  IntervalInspection = 99,
}

@Injectable({
  providedIn: "root",
})
export class UserDalService {
  constructor(public userService: UserConfigService) {
    this.userService = userService;
  }

  async getUserConfig(userId: string, configType: UserConfigType) {
    const me = this;
    const userConfig = await me.userService
      .getUserConfig(UserUrl.config(userId, configType.toString()))
      .toPromise();
    return userConfig;
  }

  async editUserConfig(
    userId: string,
    configType: UserConfigType,
    base64: string
  ) {
    const me = this;
    const fault = await me.userService
      .editUserConfig(UserUrl.config(userId, configType.toString()), base64)
      .toPromise();
    return fault;
  }
}

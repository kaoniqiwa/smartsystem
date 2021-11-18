import { Injectable } from "@angular/core";
import { UserConfigService } from "../../data-core/repuest/user-config.service";
import { UserUrl } from "../../data-core/url/user-url";

@Injectable({
  providedIn: "root",
})
export class UserDalService {
  constructor(public userService: UserConfigService) {
    this.userService = userService;
  }

  async getUserConfig(userId: string, configType: string) {
    const me = this;
    const userConfig = await me.userService
      .getUserConfig(UserUrl.config(userId, configType))
      .toPromise();
    return userConfig;
  }

  async editUserConfig(userId: string, configType: string, base64: string) {
    const me = this;
    const fault = await me.userService
      .editUserConfig(UserUrl.config(userId, configType), base64)
      .toPromise();
    return fault;
  }
}

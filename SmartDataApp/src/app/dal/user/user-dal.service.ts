import { Injectable } from '@angular/core';
import { UserService } from 'src/app/data-core/repuest/user.service';
import { User } from '../../data-core/url/user-url';



@Injectable({
  providedIn: 'root'
})
export class UserDalService {

  userUrl = new User();

  constructor(public userService: UserService) {
    this.userService = userService;
  }

  async getUserConfig(userId: string, configType: string) {
    const me = this;
    const config = await me.userService.getConfig().toPromise();
    const userConfig = await me.userService.getUserConfig(config.UserApiUrl + me.userUrl.config(userId, configType)).toPromise();
    return userConfig;
  }

  async editUserConfig(userId: string, configType: string, base64: string) {
    const me = this;
    const config = await me.userService.getConfig().toPromise();
    const fault = await me.userService.editUserConfig(config.UserApiUrl + me.userUrl.config(userId, configType), base64).toPromise();
    return fault;
  }
}

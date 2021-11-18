import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RoutePaths } from "../app-routing.module";
import { HowellUri } from "../common/howell-uri";
import { SessionUser } from "../common/tool/session-user";
import { User } from "../data-core/model/user";
import {
  ChangeUserPasswordParams,
  CheckCodeParams,
} from "../data-core/model/waste-regulation/user-password";
import { UserRequestService } from "../data-core/repuest/user.service";

@Injectable()
export class PasswordToChangeService {
  constructor(private userService: UserRequestService) {}

  change(userId: string, password: string) {
    let params = new ChangeUserPasswordParams();
    params.Password = password;
    return this.userService.password.change(userId, params);
  }
}

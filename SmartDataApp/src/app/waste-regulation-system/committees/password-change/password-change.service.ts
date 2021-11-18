import { Injectable } from "@angular/core";
import { ChangeUserPasswordParams } from "src/app/data-core/model/waste-regulation/user-password";
import { UserRequestService } from "src/app/data-core/repuest/user.service";

@Injectable()
export class PasswordChangeService {
  constructor(private userService: UserRequestService) {}

  change(userId: string, password: string) {
    let params = new ChangeUserPasswordParams();
    params.Password = password;
    return this.userService.password.change(userId, params);
  }
}

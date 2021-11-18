import { Injectable } from "@angular/core";
import { HowellAuthHttpService } from "./howell-auth-http.service";
import { PagedList } from "../model/page";
import { PasswordUrl, UserUrl } from "../url/user-url";
import { Fault } from "../model/response";
import {
  GetUserLabelsParams,
  GetUsersParams,
  Role,
  User,
  UserLabel,
} from "../model/user";
import { UserLabelType } from "../model/enum";
import {
  ChangeUserPasswordParams,
  CheckCodeParams,
  PasswordCheckCodeResult,
  RandomUserPaswordParams,
} from "../model/waste-regulation/user-password";

@Injectable({
  providedIn: "root",
})
export class UserRequestService {
  constructor(private http: HowellAuthHttpService) {}

  user = new UsersRequestService(this.http);

  password = new UsersPasswordsRequestService(this.http);
}

class UsersRequestService {
  constructor(private http: HowellAuthHttpService) {}
  list(index: number, size: number): Promise<PagedList<User>>;
  list(params: GetUsersParams): Promise<PagedList<User>>;

  list(index: GetUsersParams | number = 1, size: number = 999) {
    if (typeof index === "number") {
      return this.http
        .httpGet<PagedList<User>>(UserUrl.list(index, size))
        .toPromise();
    } else {
      return this.http.post(UserUrl.user_list(), index).toPromise();
    }
  }

  post(user: User) {
    return this.http.post<User, Fault>(UserUrl.base(), user).toPromise();
  }

  get(userId: string): Promise<User> {
    return this.http.httpGet<User>(UserUrl.item(userId)).toPromise();
  }

  put(user: User) {
    return this.http.put<User, Fault>(UserUrl.item(user.Id), user).toPromise();
  }

  delete(userId: string) {
    return this.http.delete<Fault>(UserUrl.item(userId)).toPromise();
  }

  role = new UsersRolesRequestService(this.http);
  label = new UsersLabelsRequestService(this.http);
}

class UsersRolesRequestService {
  constructor(private http: HowellAuthHttpService) {}
  list(userId: string, index: number = 1, size: number = 999) {
    return this.http
      .httpGet<PagedList<Role>>(UserUrl.roles_list(userId, index, size))
      .toPromise();
  }

  get(userId: string, roleId: string) {
    return this.http.httpGet(UserUrl.roles_item(userId, roleId)).toPromise();
  }
}
class UsersLabelsRequestService {
  constructor(private http: HowellAuthHttpService) {}
  get(labelId: string, type: UserLabelType) {
    return this.http
      .httpGet<UserLabel>(UserUrl.label_type_item(labelId, type.toString()))
      .toPromise();
  }
  delete(labelId: string, type: UserLabelType) {
    {
      return this.http
        .delete<Fault>(UserUrl.label_type_item(labelId, type.toString()))
        .toPromise();
    }
  }
  post(labelId: string, label: UserLabel) {
    {
      return this.http
        .post<UserLabel, Fault>(
          UserUrl.label_type_item(labelId, label.LabelType.toString()),
          label
        )
        .toPromise();
    }
  }
  put(labelId: string, label: UserLabel) {
    {
      return this.http
        .put<UserLabel, Fault>(
          UserUrl.label_type_item(labelId, label.LabelType.toString()),
          label
        )
        .toPromise();
    }
  }

  list(params: GetUserLabelsParams) {
    return this.http
      .post<GetUserLabelsParams, PagedList<UserLabel>>(
        UserUrl.label_list(),
        params
      )
      .toPromise();
  }
}

class UsersPasswordsRequestService {
  constructor(private http: HowellAuthHttpService) {}
  random(userId: string, params: RandomUserPaswordParams) {
    return this.http
      .post<RandomUserPaswordParams, string>(
        UserUrl.password_random(userId),
        params
      )
      .toPromise();
  }
  change(userId: string, params: ChangeUserPasswordParams) {
    return this.http
      .post<ChangeUserPasswordParams, User>(
        UserUrl.password_change(userId),
        params
      )
      .toPromise();
  }

  checkMobileNo(mobileNo: string) {
    return this.http
      .httpGet<Fault>(PasswordUrl.CheckMobileNo(mobileNo))
      .toPromise();
  }

  getCheckCode(mobileNo: string) {
    return this.http
      .httpGet<string>(PasswordUrl.CheckCode(mobileNo))
      .toPromise();
  }

  toCheckCode(params: CheckCodeParams) {
    return this.http
      .post<CheckCodeParams, PasswordCheckCodeResult>(
        PasswordUrl.CheckCode(),
        params
      )
      .toPromise();
  }
}

/**
 * Developer 施文斌
 * LastUpdateTime
 */
import { GarbageBaseUrl } from "./IUrl";
export class UserUrl extends GarbageBaseUrl {
  static base() {
    return this.user + `Users`;
  }
  static list(index: number = 1, size: number = 999) {
    let query = `?PageIndex=${index}&PageSize=${size}`;
    return this.user + `Users${query}`;
  }

  static user_list() {
    return `${this.base()}/List`;
  }

  static item(id: string) {
    return this.user + `Users/${id}`;
  }

  static roles_base(id: string) {
    return this.user + `Users/${id}/Roles`;
  }
  static roles_list(id: string, index: number, size: number) {
    return this.user + `Users/${id}/Roles?PageIndex=${index}&PageSize=${size}`;
  }

  static roles_item(id: string, roleId: string) {
    return this.user + `Users/${id}/Roles/${roleId}`;
  }

  static label() {
    return `${this.base()}/Labels`;
  }
  static label_item(labelId: string) {
    return `${this.label()}/${labelId}`;
  }
  static label_type(labelId: string) {
    return `${this.label_item(labelId)}/LabelTypes`;
  }
  static label_type_item(labelId: string, type: string) {
    return `${this.label_type(labelId)}/${type}`;
  }
  static label_list() {
    return `${this.label()}/List`;
  }

  static login(name: string) {
    return this.user + `Users/Login/${name}`;
  }
  static config(id: string, configType: string) {
    return this.user + `Users/${id}/Config/${configType}`;
  }
  static password(id: string) {
    return `${this.item(id)}/Passwords`;
  }
  static password_random(id: string) {
    return `${this.password(id)}/Random`;
  }
  static password_change(id: string) {
    return `${this.password(id)}/Change`;
  }
}

export class RolesUrl extends GarbageBaseUrl {
  static list() {
    return this.user + `Roles`;
  }

  static item(id: string) {
    return this.user + `Roles/${id}`;
  }

  static user_list(id: string) {
    return this.user + `Roles/${id}/Users`;
  }

  static user_item(id: string, userId: string) {
    return this.user + `Roles/${id}/Users/${userId}`;
  }
}

export class PasswordUrl extends GarbageBaseUrl {
  static base() {
    return this.user + "Passwords";
  }
  static CheckCode(mobileNo?: string) {
    let query = "";
    if (mobileNo) {
      query = `?MobileNo=${mobileNo}`;
    }
    return `${PasswordUrl.base()}/CheckCode${query}`;
  }
  static CheckMobileNo(mobileNo: string) {
    return `${PasswordUrl.base()}/CheckMobileNo?MobileNo=${mobileNo}`;
  }
}

export class UserCode extends GarbageBaseUrl {
  static getCode(phoneNumber: string) {
    return this.user + "GetVerificationCode?phoneNumber=" + phoneNumber;
  }

  static checkCode(phoneNumber: string, code: string) {
    return (
      this.user +
      `CheckVerificationCode?phoneNumber=${phoneNumber}&code=${code}`
    );
  }
}

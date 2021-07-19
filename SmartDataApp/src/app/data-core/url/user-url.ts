/**
 * Developer 施文斌
 * LastUpdateTime
 */
import { GarbageBaseUrl } from "./IUrl";
export class UserUrl extends GarbageBaseUrl {
  static list() {
    return this.user + `Users`;
  }

  static item(id: string) {
    return this.user + `Users/${id}`;
  }

  static roles_list(id: string) {
    return this.user + `Users/${id}/Roles`;
  }

  static roles_item(id: string, roleId: string) {
    return this.user + `Users/${id}/Roles/${roleId}`;
  }

  static login(name: string) {
    return this.user + `Users/Login/${name}`;
  }
  static config(id: string, configType: string) {
    return this.user + `Users/${id}/Config/${configType}`;
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

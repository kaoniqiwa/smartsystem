/**
 * Developer 施文斌
 * LastUpdateTime  
 */
import { GarbageBaseUrl, IUrl } from "./IUrl";
export class User  extends GarbageBaseUrl  {
    list() {
        return this.user+`Users`;
    }

    item(id: string) {
        return this.user+`Users/${id}`;
    }

    roles_list(id: string) {
        return this.user+`Users/${id}/Roles`;
    }

    roles_item(id: string, roleId: string) {
        return this.user+`Users/${id}/Roles/${roleId}`;
    }

    login(name: string) {
        return this.user+`Users/Login/${name}`;
    }
    config(id: string, configType: string) {
        return this.user+`Users/${id}/Config/${configType}`;
    }
}

export class Roles extends GarbageBaseUrl{
    list() {
        return this.user+`Roles`;
    }

    item(id: string) {
        return this.user+`Roles/${id}`;
    }

    user_list(id: string) {
        return this.user+`Roles/${id}/Users`;
    }

    user_item(id: string, userId: string) {
        return this.user+`Roles/${id}/Users/${userId}`;
    }
}
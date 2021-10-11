import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from "@angular/router";

import { SessionUser } from "../tool/session-user";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): true | UrlTree {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): true | UrlTree {
    debugger;
    if (url.indexOf("Auth") > -1) return true;
    const user = new SessionUser(),
      digestAuth = sessionStorage.getItem("WWW-Authenticate");
    if (user.name && user.pwd && digestAuth) {
      return true;
    }

    return this.router.parseUrl("/login");
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { log } from 'console';
import { SessionUser } from "../tool/session-user";

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true | UrlTree {
    let url: string = state.url; 
    return this.checkLogin(url);
  }

  checkLogin(url: string): true | UrlTree {
    const user = new SessionUser(), digestAuth = sessionStorage.getItem('WWW-Authenticate');
    if (user.name && user.pwd&&digestAuth) { return true; }

    // Redirect to the login page
    return this.router.parseUrl('/login');
  }
}
import { Component, OnInit } from '@angular/core';
import { SessionUser } from "../../../common/tool/session-user";
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-tool',
  templateUrl: './user-tool.component.html'
})
export class UserToolComponent implements OnInit {
  sessionUser = new SessionUser();
  constructor(private router: Router) {


  }

  ngOnInit() {

  }

  logOut() {
    this.sessionUser.clear = true;
    this.router.navigateByUrl('login');
  }

}


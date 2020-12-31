import { Component, OnInit } from '@angular/core';
import { SessionUser } from "../../../common/tool/session-user";
@Component({
  selector: 'app-user-tool',
  templateUrl: './user-tool.component.html'
})
export class UserToolComponent implements OnInit {
  sessionUser = new SessionUser();

  constructor() {
  }

  ngOnInit() {
  }

  logOut() {
    this.sessionUser.clear = true;
  window.location.href = '/login'
  }

}


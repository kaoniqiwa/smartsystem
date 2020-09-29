import { Component, OnInit } from '@angular/core';
import { SessionUser } from "../../../common/tool/session-user";
import { Router } from '@angular/router';
@Component({
  selector: 'app-user-tool',
  templateUrl: './user-tool.component.html',
  styleUrls: ['./user-tool.component.styl']
})
export class UserToolComponent implements OnInit {
  sessionUser = new SessionUser();
  constructor(private router: Router) {


  }

  ngOnInit() {

  }

  checkOut() {
    this.sessionUser.clear = true;
    this.router.navigateByUrl('login');
  }

}


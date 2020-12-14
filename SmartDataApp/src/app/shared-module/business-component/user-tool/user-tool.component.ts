import { Component, OnInit } from '@angular/core';
import { SessionUser } from "../../../common/tool/session-user";
import { Router } from '@angular/router';
import { StatisticalDataBufferService } from '../../../waste-regulation-system/index/business-card-grid/buffer/statistical-data-buffer';
@Component({
  selector: 'app-user-tool',
  templateUrl: './user-tool.component.html'
})
export class UserToolComponent implements OnInit {
  sessionUser = new SessionUser();

  constructor(private router: Router,private buffer:StatisticalDataBufferService) {


  }

  ngOnInit() {

  }

  logOut() {
    this.sessionUser.clear = true;
    this.router.navigateByUrl('login');
    this.buffer.cacheReset(); 
  }

}


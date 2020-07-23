import { Component, OnInit ,ViewChild} from '@angular/core';
import { ResourceRequestService } from "../../data-core/repuest/resources.service";
import { GetResourcesParams } from '../../data-core/model/resources-params';
import { SideNavMenuComponent} from "./side-nav-menu/side-nav-menu.component";
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.styl']
})
export class IndexComponent implements OnInit {

@ViewChild('navMenu')
navMenu:SideNavMenuComponent;

maximize = true;

  constructor(private a:ResourceRequestService) { }

 async ngOnInit() {
//  const ab =await this.a.list(new GetResourcesParams());console.log(ab);
  
  
  }

  menuControl(maximize:boolean){
     this.maximize=maximize;
     this.navMenu.maximize=maximize;
     
  }

}

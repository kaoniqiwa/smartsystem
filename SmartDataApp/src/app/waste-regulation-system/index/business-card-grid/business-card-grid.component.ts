/**
 * Developer 施文斌
 * LastUpdateTime 
 */
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { RefreshTimer } from '../../../common/tool/queue/refresh-timer'; 
import { CardDirective } from '../../../common/directive/card-directive';
import { BusinessCardSlotService, BusinessViewComponetConstructor } from './business-card-slot.service';
import { BusinessViewComponetFactory } from './factory/business-view-componet-factory';
import { HeaderSquareListComponent } from "../../../shared-module/header-square-list/header-square-list.component";
import { BaseBusinessRefresh } from '../../../common/tool/base-business-refresh';
import { BusinessParameter } from "../../../common/interface/IBusiness";
import { ViewsModel } from '../../../common/abstract/base-view';
import { DivisionBusinessService } from "./division-business.service";
@Component({
  selector: 'business-card-grid',
  templateUrl: './business-card-grid.component.html',
  providers: [BusinessViewComponetFactory]
})
export class BusinessCardGridComponent implements OnInit {
  @Input() cardConfig: {
    business: string;
    cardType: string;
    dataTime: number;
    flipTime: number;
    divisionsId: string;
    border: boolean;
  }[];
  @ViewChild(CardDirective) cardHost: CardDirective;

  constructor(
    private businessViewComponetFactory: BusinessViewComponetFactory
    , private refreshTimer: RefreshTimer
    , private businessCardSlotService: BusinessCardSlotService
    ,private divisionBusinessService:DivisionBusinessService
  ) {
  }

  async ngOnInit() {
    const businessViewComponets = this.businessViewComponetFactory.create(this.cardConfig, this.cardHost);
  
    this.businessCardSlotService.addViews(businessViewComponets);
    this.divisionBusinessService.componets.push(businessViewComponets);
     this.refreshTimer.addBusiness(businessViewComponets.getBusinesses());
     this.refreshTimer.start();
  }

}

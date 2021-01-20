import { Component, OnInit, } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
@Component({
  selector: 'hw-illegal-drop-event-summary',
  templateUrl: './illegal-drop-event-summary.component.html',
  styleUrls: ['./illegal-drop-event-summary.component.styl']
})
export class IllegalDropEventSummaryComponent implements OnInit {

  viewsShow = [true, false, false,false];
  defaultSearch = false;

 
  constructor(private divisionBusinessService: DivisionBusinessService,
    private route: ActivatedRoute) {
    this.route.data.subscribe(params => { 
      this.defaultSearch = params.p !=null;
    });
  }

  ngOnInit() {
  }

  acceptOtherView(val: OtherViewEnum) { 
    for (var i = 0; i < 4; i++)
      this.viewsShow[i] = i == val;
    if (val == OtherViewEnum.chart&&this.defaultSearch==false)
      setTimeout(() => {
        this.divisionBusinessService.illegalDropChartDefault.emit(this.divisionBusinessService.divisionsId);
     
        this.defaultSearch=true;
      }, 700);
  }

}


export enum OtherViewEnum {
  history,
  analyze,
  chart,
  sumChart
}
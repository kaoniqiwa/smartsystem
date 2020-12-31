import { Component, OnInit, ViewChild ,Input,Output,EventEmitter} from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { LevelListPanelComponent } from "../level-list-panel/level-list-panel.component";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
@Component({
  selector: 'hw-illegal-drop-event-chart',
  templateUrl: './illegal-drop-event-chart.component.html',
  styleUrls: ['./illegal-drop-event-chart.component.styl'],
  providers: [BusinessService]
})
export class IllegalDropEventChartComponent implements OnInit {
  otherView =OtherViewEnum;
  @Input() changeViewFn:(index:number)=>void;
  @Input() isDefaultSearch = false;
  @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  changeView(tagIndex:number){
    this.changeViewFn(tagIndex);
  }
  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(LevelListPanelComponent)
  levelListPanelComponent:LevelListPanelComponent;

  changeDivisionFn = (id: string) => {
     
    if (id && this.businessService.garbageStations) {
      const filter = this.businessService.garbageStations.filter(x => x.DivisionId == id);
      this.businessService.search.toStationsDropList = filter;
      this.businessService.search.divisionId = id;
      this.businessService.search.stationId ='';
    }
    else if (id == '') {
      this.businessService.search.toStationsDropList = this.businessService.garbageStations;
      this.businessService.search.stationId = id;
    }

  }
  startDate = (b: Date) => { 
    this.businessService.search.formBeginDate = b;
  }
  constructor(private businessService: BusinessService
    ,private divisionBusinessService:DivisionBusinessService) { }

  async ngOnInit() {
    this.businessService.divisions = await this.businessService.divisionDao.allDivisions();
    this.businessService.garbageStations = await this.businessService.garbageStationDao.allGarbageStations();

    this.businessService.search.toStationsDropList = this.businessService.garbageStations;
    this.businessService.initDivisionListView();

    this.divisionBusinessService.illegalDropChartDefault.subscribe(id=>{
      this.levelListPanelComponent.defaultItem(id);
      this.search();
    })
 
  }

  changeTimeType() {
    const val = this.businessService.changeDatePicker();  
    this.timePicker.reInit(this.businessService.datePicker.startView
      , this.businessService.datePicker.minView
      , this.businessService.datePicker.formate, val.time, val.week); 
    this.search();
  }

  search() {
    this.businessService.requestData();
  }

  changeOtherView(val:OtherViewEnum){
    setTimeout(() => {
    this.OtherViewEvent.emit(val);
    },280);
  }
}

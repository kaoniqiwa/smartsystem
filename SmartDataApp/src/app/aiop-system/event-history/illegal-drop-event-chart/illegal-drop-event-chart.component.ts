import { Component, OnInit, ViewChild ,Input} from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DivisionBusinessService } from "../../../waste-regulation-system/index/business-card-grid/division-business.service";
import { DateTimePickerDirective } from "../../../common/directive/date-time-picker.directive";
import { LevelListPanelComponent } from "../../../shared-module/business-component/event-history/level-list-panel/level-list-panel.component";
@Component({
  selector: 'hw-illegal-drop-event-chart',
  templateUrl: './illegal-drop-event-chart.component.html',
  styleUrls: ['./illegal-drop-event-chart.component.styl'],
  providers: [BusinessService]
})
export class IllegalDropEventChartComponent implements OnInit {
  @Input() changeViewFn:(index:number)=>void;
  @Input() isDefaultSearch = false;
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

    setTimeout(() => {
      if(this.isDefaultSearch&&this.divisionBusinessService.divisionsId)
      this.levelListPanelComponent.defaultItem(this.divisionBusinessService.divisionsId);
   },1200);
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

}

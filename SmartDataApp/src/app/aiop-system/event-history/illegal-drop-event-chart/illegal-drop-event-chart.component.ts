import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../common/directive/date-time-picker.directive";
@Component({
  selector: 'app-illegal-drop-event-chart',
  templateUrl: './illegal-drop-event-chart.component.html',
  styleUrls: ['./illegal-drop-event-chart.component.styl'],
  providers: [BusinessService]
})
export class IllegalDropEventChartComponent implements OnInit {

  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  changeDivisionFn = (id: string) => {
     
    if (id && this.businessService.garbageStations) {
      const filter = this.businessService.garbageStations.filter(x => x.DivisionId == id);
      this.businessService.search.toStationsDropList = filter;
      this.businessService.search.divisionId = id;
    }
    else if (id == '') {
      this.businessService.search.toStationsDropList = this.businessService.garbageStations;
      this.businessService.search.stationId = id;
    }

  }
  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  }
  constructor(private businessService: BusinessService) { }

  async ngOnInit() {
    this.businessService.divisions = await this.businessService.divisionDao.allDivisions();
    this.businessService.garbageStations = await this.businessService.garbageStationDao.allGarbageStations();

    this.businessService.search.toStationsDropList = this.businessService.garbageStations;
    this.businessService.initDivisionListView();
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

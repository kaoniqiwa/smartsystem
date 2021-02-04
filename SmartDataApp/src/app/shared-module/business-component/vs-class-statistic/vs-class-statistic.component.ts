import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective, DateTimePickerMirrorDirective } from "../../../common/directive/date-time-picker.directive";
import { TreeDropListV2Component } from "./tree-drop-list-v2/tree-drop-list-v2.component";
import { ClassTypeEnum, TimeUnitEnum } from "./business/search";
import { MessageBar } from "../../../common/tool/message-bar";
import { setData } from "../../../common/tool/jquery-help/jquery-help";
import { SessionUser } from "../../../common/tool/session-user";
@Component({
  selector: 'vs-class-statistic',
  templateUrl: './vs-class-statistic.component.html',
  styleUrls: ['./vs-class-statistic.component.styl'],
  providers: [BusinessService]
})
export class VsClassStatisticComponent implements OnInit {
  @ViewChild(DateTimePickerDirective)
  timePicker1: DateTimePickerDirective;

  @ViewChild(DateTimePickerMirrorDirective)
  timePicker2: DateTimePickerMirrorDirective;

  @ViewChild('dtp1')
  dtp1: ElementRef;

  @ViewChild('dtp2')
  dtp2: ElementRef;

  @ViewChild('drop1')
  dropList1: TreeDropListV2Component;

  @ViewChild('drop2')
  dropList2: TreeDropListV2Component;

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
    this.businessService.requestData();
    /**时间文本显示处理 */
    const param = this.businessService.search.toSearchParam();
    this.dtp2.nativeElement.value = '';
    setData('dtp2', 'date', param.InputDateTime);
    this.timePicker2.setStartDate = null;
    this.dtp2.nativeElement.value = this.businessService.search.beginDate;
  }
  startDateV2 = (b: Date) => {
    this.businessService.search.formBeginDate = b;
    this.businessService.requestData();
    /**时间文本显示处理 */
    const param = this.businessService.search.toSearchParam();
    this.dtp1.nativeElement.value = '';
    setData('dtp1', 'date', param.InputDateTime);
    this.timePicker1.setStartDate = null;
    this.dtp1.nativeElement.value = this.businessService.search.beginDate;
  }
  msg = new MessageBar();
  vs1Class = (item: { id: string }) => {
    const param = this.businessService.search.toSearchParam();

    if (param.ClassType == ClassTypeEnum.Division) {
      this.businessService.search.divisionId1 = item ? item.id : null;
      this.businessService.search.stationId1 = null;
      if (item.id == this.businessService.search.divisionId2) {
       // this.msg.response_warning('相同居委不可比较');
        return;
      }
    }
    else if (param.ClassType == ClassTypeEnum.Station) {
      this.businessService.search.stationId1 = item ? item.id : null;
      this.businessService.search.divisionId1 = null;
      if (item.id == this.businessService.search.stationId2) {
       // this.msg.response_warning('相同投放点不可比较');
        return;
      }
    }
    this.businessService.requestData();
  }

  vs2Class = (item: { id: string }) => {
    const param = this.businessService.search.toSearchParam();

    if (param.ClassType == ClassTypeEnum.Division) {
      this.businessService.search.divisionId2 = item ? item.id : null;
      this.businessService.search.stationId2 = null;
      if (item.id == param.DivisionId1) {
        //this.msg.response_warning('相同居委不可比较');
        return;
      }
    }
    else if (param.ClassType == ClassTypeEnum.Station) {
      this.businessService.search.stationId2 = item ? item.id : null;
      this.businessService.search.divisionId2 = null;
      if (item.id == param.StationId1) {
       // this.msg.response_warning('相同投放点不可比较');
        return;
      }
    }
    this.businessService.requestData();
  }
  divisionMode = true;

  get timeArrow() {
    const s = this.businessService.search.toSearchParam();
    if (s.TimeUnit == TimeUnitEnum.Hour) return 0;
    if (s.TimeUnit == TimeUnitEnum.Day) return 50;
  }
  constructor(private businessService: BusinessService
  ) { }

  ngOnInit() {
    this.defaultTreeList();
  }

  defaultTreeList() {
    const user = new SessionUser(),
      param = this.businessService.search.toSearchParam();

    if (param.ClassType == ClassTypeEnum.Division) {
      const id = user.divisions && user.divisions.length >= 1 ? user.divisions[0] : '';
      setTimeout(() => {

        this.dropList1.defaultItem(id, (i) => {
          user.divisions = [i];
        });
      }, 100);
      setTimeout(() => {
        this.dropList2.defaultItem(id, (i) => {
          user.divisions = [i];
        });
      }, 300);
    }
    else if (param.ClassType == ClassTypeEnum.Station) { 
      const id = user.stations && user.divisions.length >= 1 ? user.stations[0] : '';
      setTimeout(() => {
        this.dropList1.defaultItem(id, (i) => {
        user.stations = [i];
        });
      }, 100);
      setTimeout(() => {
        this.dropList2.defaultItem(id, (i) => {
         user.stations = [i];
        });
      }, 300);
    }
  }

  changeClassType() {
    this.dropList1.selectedText = null;
    this.dropList2.selectedText = null;
    const param = this.businessService.search.toSearchParam();
    this.dropList1.onlyDivisionNode = param.ClassType == ClassTypeEnum.Division;
    this.dropList2.onlyDivisionNode = param.ClassType == ClassTypeEnum.Division;
    this.dropList1.clearNestedNode();
    this.dropList2.clearNestedNode();
    this.dropList1.reInit();
    this.dropList2.reInit();
    this.businessService.search.stationId1 = null;
    this.businessService.search.stationId2 = null;
    this.businessService.search.divisionId1 = null;
    this.businessService.search.divisionId2 = null;
    this.businessService.initBarOpt();
    this.defaultTreeList();
  }

  changeTimeType() {
    const val = this.businessService.changeDatePicker();
    this.timePicker1.reInit(this.businessService.datePicker.startView
      , this.businessService.datePicker.minView
      , this.businessService.datePicker.formate, val.time, val.week);
    this.timePicker2.reInit(this.businessService.datePicker.startView
      , this.businessService.datePicker.minView
      , this.businessService.datePicker.formate, val.time, val.week);

  }
}

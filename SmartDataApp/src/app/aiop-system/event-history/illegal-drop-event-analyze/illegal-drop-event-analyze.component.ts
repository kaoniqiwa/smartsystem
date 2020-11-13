import { Component, OnInit, ViewChild } from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../common/directive/date-time-picker.directive";
import { TreeDropListComponent } from "./tree-drop-list/tree-drop-list.component";
import { MessageBar } from "../../../common/tool/message-bar";
@Component({
  selector: 'app-illegal-drop-event-analyze',
  templateUrl: './illegal-drop-event-analyze.component.html',
  styleUrls: ['./illegal-drop-event-analyze.component.styl'],
  providers: [BusinessService]
})
export class IllegalDropEventAnalyzeComponent implements OnInit {

  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(TreeDropListComponent)
  dropList: TreeDropListComponent;

  classText = '居委会';

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  }
  constructor(private businessService: BusinessService) { }

  async ngOnInit() {

  }

  changeClassType() {
    this.dropList.clearSelectedTexts();
    this.businessService.changeClassType((val:boolean) => { 
      this.dropList.onlyDivisionNode=val;
      this.classText = val ?'居委会':'垃圾房';
      this.dropList.reInit();
    });
  }

  changeTimeType() {
    const val = this.businessService.changeDatePicker();
    this.timePicker.reInit(this.businessService.datePicker.startView
      , this.businessService.datePicker.minView
      , this.businessService.datePicker.formate, val.time, val.week);
    this.search();
  } 

  search() {
    const ids = new Array<string>();
    this.dropList.selectedTexts.map(x => ids.push(x.id));
    if (ids.length <= 3 && ids.length > 0) {
      this.businessService.toDivisionIdsOrStationIds(ids);
      this.businessService.requestData(this.dropList.selectedTexts);
    }
    else if (ids.length > 3)
      new MessageBar().response_warning('最大3个对象');
  }

}

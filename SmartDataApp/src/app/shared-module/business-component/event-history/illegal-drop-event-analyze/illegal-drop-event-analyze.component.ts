import { Component, OnInit, ViewChild,Input,Output,EventEmitter} from '@angular/core';
import { BusinessService } from "./business/business.service";
import { DateTimePickerDirective } from "../../../../common/directive/date-time-picker.directive";
import { TreeDropListComponent } from "./tree-drop-list/tree-drop-list.component";
import { MessageBar } from "../../../../common/tool/message-bar";
import { OtherViewEnum } from "../illegal-drop-event-summary/illegal-drop-event-summary.component";
import { DivisionBusinessService } from "../../../../waste-regulation-system/index/business-card-grid/division-business.service";
@Component({
  selector: 'hw-illegal-drop-event-analyze',
  templateUrl: './illegal-drop-event-analyze.component.html',
  styleUrls: ['./illegal-drop-event-analyze.component.styl'],
  providers: [BusinessService]
})
export class IllegalDropEventAnalyzeComponent implements OnInit { @Output() OtherViewEvent = new EventEmitter<OtherViewEnum>();
  @Input() changeViewFn:(index:number)=>void;
  @ViewChild(DateTimePickerDirective)
  timePicker: DateTimePickerDirective;

  @ViewChild(TreeDropListComponent)
  dropList: TreeDropListComponent;

  @Input() isDefaultSearch = false;

  classText = '居委会';
  otherView =OtherViewEnum;

  startDate = (b: Date) => {
    this.businessService.search.formBeginDate = b;
  }
  constructor(private businessService: BusinessService
    ,private divisionBusinessService:DivisionBusinessService) { }

  async ngOnInit() {

    setTimeout(() => {
       if(this.isDefaultSearch&&this.divisionBusinessService.divisionsId)this.defaultSearch=this.divisionBusinessService.divisionsId;
    },1200);
  }

  changeView(tagIndex:number){
    this.changeViewFn(tagIndex);
  }

  set defaultSearch(id:string){
      this.dropList.defaultSearch=id;
  }

  changeClassType() {
    this.dropList.clearSelectedTexts();
    this.businessService.changeClassType((val:boolean) => { 
      this.dropList.onlyDivisionNode=val;
      this.classText = val ?'居委会':'垃圾房';
      this.dropList.r();
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
  changeOtherView(val:OtherViewEnum){
    setTimeout(() => {
      this.OtherViewEvent.emit(val);
    },50);
   
  }
}

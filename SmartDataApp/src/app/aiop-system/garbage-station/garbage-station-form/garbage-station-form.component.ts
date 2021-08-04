import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import { FormStateEnum } from "../../../common/tool/table-form-helper";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import {
  FormField,
  GarbageStationFormService,
} from "./business/garbage-station-form";
import { DataService } from "../garbage-station-mgr/business/data.service";
import { domClick } from "../../../common/tool/jquery-help/jquery-help";
import { StationChartComponent } from "../station-chart/station-chart.component";
import { GarbageStationType } from "../../../data-core/model/waste-regulation/garbage-station-type";
@Component({
  selector: "garbage-station-form",
  templateUrl: "./garbage-station-form.component.html",
  styleUrls: ["./garbage-station-form.component.styl"],
  providers: [DataService],
})
export class GarbageStationFormComponent implements OnInit {
  formService: GarbageStationFormService;
  @Input() saveFn: (
    success: boolean,
    item: GarbageStation,
    formState: FormStateEnum
  ) => void;
  @Input() cancelFn: () => void;
  @Input() editItem: GarbageStation;
  @Input() divisionId = "";
  @ViewChild("resetBtn")
  resetBtn: ElementRef;

  @ViewChild("name_")
  name: ElementRef;

  @ViewChild("garbageChart")
  chartComponent: StationChartComponent;

  @Input() stationType: GarbageStationType[] = new Array();
  constructor(
    private dataService: DataService // , private stationTypeDataService: StationTypeDataService
  ) {
    this.formService = new GarbageStationFormService(this.dataService);
  }

  async ngOnInit() {
    this.name.nativeElement.focus();
    this.formService.defaultForm(this.editItem);
    if (this.editItem) this.changeStationType(this.editItem.StationType);

    console.log("divisionId", this.divisionId);
    console.log("stationType", this.stationType);
  }

  onSubmit() {
    const formField = this.formService.form.value as FormField;
    this.formService.saveFrom(
      formField,
      (success: boolean, item: GarbageStation, formState: FormStateEnum) => {
        if (success && this.saveFn) this.saveFn(success, item, formState);
      },
      this.divisionId
    );
  }

  changeStationType(typeVal: number) {
    const type = this.stationType.find((x) => x.Type == typeVal);
    this.chartComponent.stationChart.changeTrashNum(type.Windows.length + "");
    this.chartComponent.stationChart.changeHouseType = type;
  }

  onCancel() {
    if (this.cancelFn) this.cancelFn();
    domClick(this.resetBtn.nativeElement);
  }
}

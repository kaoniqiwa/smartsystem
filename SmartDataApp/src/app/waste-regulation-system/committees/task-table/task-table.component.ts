import { Component, Input, OnInit } from "@angular/core";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { TaskTableService } from "./task-table.service";
import { TaskTableViewModel } from "./task-table.model";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { GarbageDropEventRecord } from "src/app/data-core/model/waste-regulation/garbage-drop-event-record";
import { TaskTableConverter } from "./task-table.converter";
import { ICommitteesComponent } from "../interface/committees-component.interface";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-task-table",
  templateUrl: "./task-table.component.html",
  styleUrls: ["./task-table.component.css"],
  providers: [TaskTableService],
})
export class TaskTableComponent
  implements
    OnInit,
    ICommitteesComponent<GarbageDropEventRecord[], TaskTableViewModel[]>
{
  views?: TaskTableViewModel[];
  headWidths = ["10%", "25%", "15%", "20%", "15%", "calc(15% - 8px)", "8px"];
  bodyWidths = ["10%", "25%", "15%", "20%", "15%", "15%"];

  EventType = EventType;

  private _Committees: Division;
  public get Committees(): Division {
    return this._Committees;
  }
  @Input()
  public set Committees(v: Division) {
    this._Committees = v;
    this.onLoaded();
  }

  @Input()
  Converter: ICommitteesConverter<
    GarbageDropEventRecord[],
    TaskTableViewModel[]
  > = new TaskTableConverter();

  onLoaded() {
    this.show();
  }

  show() {
    if (this.Committees) {
      this.service.load(this.Committees.Id).then((records) => {
        this.views = this.Converter.Convert(records.Data, this.datePipe);
      });
    }
  }

  constructor(private service: TaskTableService, private datePipe: DatePipe) {}

  ngOnInit() {
    GlobalStoreService.interval.subscribe(() => {
      this.show();
    });
  }
}

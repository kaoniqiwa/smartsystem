import { DatePipe } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";
import { EventType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import { IllegalDropEventRecord } from "src/app/data-core/model/waste-regulation/illegal-drop-event-record";
import { MixedIntoEventRecord } from "src/app/data-core/model/waste-regulation/mixed-into-event-record";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { ICommitteesComponent } from "../interface/committees-component.interface";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { CommitteesHistoryTableConverter } from "./committees-history-table.converter";
import {
  CommitteesHistoryTableTypes,
  CommitteesHistoryTableViewModel,
} from "./committees-history-table.model";
import { CommitteesHistroyTableService } from "./committees-history-table.service";

@Component({
  selector: "app-histroy-table",
  templateUrl: "./committees-history-table.component.html",
  styleUrls: ["./committees-history-table.component.css"],
  providers: [CommitteesHistroyTableService],
})
export class CommitteesHistroyTableComponent
  implements
    OnInit,
    ICommitteesComponent<
      Array<IllegalDropEventRecord | MixedIntoEventRecord>,
      CommitteesHistoryTableViewModel[]
    >
{
  headWidths = ["10%", "60%", "15%", "calc(15% - 8px)", "8px"];
  bodyWidths = ["10%", "60%", "15%", "15%"];

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
  Type: EventType;

  constructor(
    private service: CommitteesHistroyTableService,
    private datePipe: DatePipe
  ) {}
  onLoaded(): void {
    this.show();
  }
  Converter: ICommitteesConverter<
    Array<IllegalDropEventRecord | MixedIntoEventRecord>,
    CommitteesHistoryTableViewModel[]
  > = new CommitteesHistoryTableConverter();

  ngOnInit() {
    GlobalStoreService.interval.subscribe(() => {
      this.show();
    });
  }

  views: CommitteesHistoryTableViewModel[];

  show() {
    EventType.IllegalDrop;
    EventType.MixedInto;
    if (this.Committees) {
      this.service.load(this.Committees.Id, this.Type).then((records) => {
        let datas = this.Converter.Convert(records, this.datePipe);
        let i = 0;
        datas
          .sort((a, b) => {
            return b.Time.localeCompare(a.Time);
          })
          .forEach((x) => {
            x.Index = ++i;
          });
        this.views = datas;
      });
    }
  }
}

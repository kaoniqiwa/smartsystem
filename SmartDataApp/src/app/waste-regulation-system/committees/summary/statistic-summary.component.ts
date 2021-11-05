import { DatePipe } from "@angular/common";
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Language } from "src/app/common/tool/language";
import { TheDayTime } from "src/app/common/tool/tool.service";
import { TimeUnit } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { EventNumberStatistic } from "src/app/data-core/model/waste-regulation/division-event-numbers";
import {
  DivisionNumberStatistic,
  DivisionNumberStatisticV2,
} from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { EventNumber } from "src/app/data-core/model/waste-regulation/event-number";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { ICommitteesComponent } from "../interface/committees-component.interface";
import { StatisticSummaryViewModel } from "./statistic-summary.model";
import { StatisticSummaryService } from "./statistic-summary.service";

@Component({
  selector: "app-statistic-summary",
  templateUrl: "./statistic-summary.component.html",
  styleUrls: ["./statistic-summary.component.css"],
  providers: [StatisticSummaryService],
})
export class StatisticSummaryComponent implements OnInit, OnChanges {
  private _date: Date = new Date();
  private _unit: TimeUnit = TimeUnit.Hour;

  TimeUnits: {
    value: TimeUnit;
    language: string;
  }[];

  divisionStatistic: DivisionNumberStatistic;
  divisionHistory: StatisticSummaryViewModel = new StatisticSummaryViewModel();
  stationStatistic: GarbageStationNumberStatistic[];
  stationHistory: EventNumberStatistic[];

  display_timeunit = false;

  @Input()
  Committees: Division;
  @Input()
  Stations: GarbageStation[];

  public set date(v: Date) {
    this._date = v;
    this.onLoaded();
  }
  public get date(): Date {
    return this._date;
  }

  public set unit(v: TimeUnit) {
    this._unit = v;
    this.onLoaded();
  }
  public get unit(): TimeUnit {
    return this._unit;
  }
  get day(): string {
    return this.datePipe.transform(this.date, "yyyy年MM月dd日");
  }
  changeDate = (date: Date) => {
    this.date = date;
  };

  constructor(
    private datePipe: DatePipe,
    private service: StatisticSummaryService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.onLoaded();
  }

  ngOnInit() {
    this.TimeUnits = [];
    for (const key in TimeUnit) {
      if (typeof TimeUnit[key] === "number") {
        const unit = TimeUnit[key] as unknown as TimeUnit;
        this.TimeUnits.push({
          value: unit,
          language: Language.TimeUnit(unit),
        });
      }
    }
  }

  onLoaded() {
    if (this.Committees && this.Stations) {
      this.service.load(this.Committees.Id).then((x) => {
        this.divisionStatistic = x;
      });
      this.service.stations(this.Committees.Id).then((x) => {
        this.stationStatistic = x;
      });

      let day = TheDayTime(this.date);
      this.service
        .divisionHistory(this.Committees.Id, day, this.unit)
        .then(async (x) => {
          let stationHistory = await this.service.stationHistory(
            this.Stations.map((x) => x.Id),
            day,
            this.unit
          );

          let sort = stationHistory.sort((a, b) => {
            return b.MaxGarbageTime - a.MaxGarbageTime;
          });
          let maxGarbageTime = 0;
          if (sort && sort.length > 0) {
            maxGarbageTime = sort[0].MaxGarbageTime;
          }
          this.divisionHistory = new StatisticSummaryViewModel(maxGarbageTime);
          this.divisionHistory = Object.assign(this.divisionHistory, x);
        });
    }
  }

  timeUnitChanging(event: Event) {
    this.display_timeunit = true;
  }
  unitChanged(event: Event, item: TimeUnit) {
    this.unit = item;
    this.display_timeunit = false;
    event.stopPropagation();
  }
}

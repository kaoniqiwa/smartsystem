import { DatePipe } from "@angular/common";
import {
  AfterViewInit,
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
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { GarbageStationNumberStatisticV2 } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { StatisticSummaryViewModel } from "./statistic-summary.model";
import { StatisticSummaryService } from "./statistic-summary.service";

@Component({
  selector: "app-statistic-summary",
  templateUrl: "./statistic-summary.component.html",
  styleUrls: ["./statistic-summary.component.css"],
  providers: [StatisticSummaryService],
})
export class StatisticSummaryComponent
  implements OnInit, OnChanges, AfterViewInit
{
  private _date: Date = new Date();
  private _unit: TimeUnit = TimeUnit.Hour;

  TimeUnits: {
    value: TimeUnit;
    language: string;
  }[] = [];

  divisionStatistic: StatisticSummaryViewModel[] = [
    new StatisticSummaryViewModel(),
  ];
  stationStatistic?: GarbageStationNumberStatisticV2[];

  divisionHistory?: EventNumberStatistic[];

  display = {
    timeunit: false,
  };

  @Input()
  Committees?: Division;
  @Input()
  Stations?: GarbageStation[];

  @Input()
  Date: Date = new Date();

  public set unit(v: TimeUnit) {
    this._unit = v;
    this.onLoaded();
  }
  public get unit(): TimeUnit {
    return this._unit;
  }

  dateView = 2;

  language = {
    format: "yyyy年MM月dd日",
    day: () => {
      return this.datePipe.transform(this.Date, this.language.format);
    },
    unit: () => {
      switch (this.unit) {
        case TimeUnit.Hour:
          this.language.format = "yyyy年MM月dd日";
          this.dateView = 2;
          break;
        case TimeUnit.Day:
          this.language.format = "yyyy年MM月";
          this.dateView = 3;
          break;
        default:
          break;
      }
      return Language.TimeUnit(this.unit);
    },
  };

  changeDate = (date: Date) => {
    this.Date = date;
    this.onLoaded();
  };

  constructor(
    private datePipe: DatePipe,
    private service: StatisticSummaryService
  ) {}
  ngAfterViewInit(): void {
    console.log("StatisticSummaryComponent ngAfterViewInit");
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log("StatisticSummaryComponent ngOnChanges");
    if (this.Committees && this.Stations && this.Date) {
      this.onLoaded();
    }
  }

  ngOnInit() {
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
      let stationIds = this.Stations.map((x) => x.Id);

      let day = TheDayTime(this.Date);

      switch (this.unit) {
        case TimeUnit.Day:
          day.begin = new Date(
            this.Date.getFullYear(),
            this.Date.getMonth(),
            1
          );
          day.end = new Date(
            this.Date.getFullYear(),
            this.Date.getMonth() + 1,
            1
          );
          day.end.setSeconds(-1);
          break;

        default:
          break;
      }

      this.service
        .stationHistory(this.Committees.Id, day, this.unit)
        .then((x) => {
          this.divisionHistory = x;
        });

      this.service
        .divisions(this.Committees.Id, day, this.unit)
        .then(async (x) => {
          let array = [];
          for (let i = 0; i < x.length; i++) {
            const divisionStatistic = x[i];

            this.stationStatistic = await this.service.stations(
              stationIds,
              day,
              this.unit
            );

            let maxGarbageTime = 0;
            let garde = 100;
            let gardeCount = 0;
            let gardeLength = 0;
            this.stationStatistic.forEach((x) => {
              maxGarbageTime = Math.max(maxGarbageTime, x.MaxGarbageTime);
              if (x.Garde) {
                gardeLength++;
                gardeCount += x.Garde;
              }
            });
            if (gardeLength > 0) {
              garde = gardeCount / gardeLength;
            }
            array[i] = new StatisticSummaryViewModel(maxGarbageTime, garde);
            array[i] = Object.assign(array[i], divisionStatistic);
          }
          this.divisionStatistic = array;
        });
    }
  }

  timeUnitChanging(event: Event) {
    this.display.timeunit = !this.display.timeunit;
    event.stopPropagation();
  }
  unitChanged(event: Event, item: TimeUnit) {
    this.unit = item;
    this.display.timeunit = false;
    event.stopPropagation();
  }
  windowClick() {
    this.display.timeunit = false;
  }
}

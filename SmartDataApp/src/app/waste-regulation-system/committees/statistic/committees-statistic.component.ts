import { Component, Input, OnInit } from "@angular/core";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { CommitteesStatisticService } from "./committees-statistic.service";
import { CommitteesStatisticViewModel } from "./committees-statistic.model";
import { ICommitteesComponent } from "../interface/committees-component.interface";
import { DivisionNumberStatistic } from "src/app/data-core/model/waste-regulation/division-number-statistic";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { CommitteesStatisticConverter } from "./committees-statistic.converter";

@Component({
  selector: "app-committees-statistic",
  templateUrl: "./committees-statistic.component.html",
  styleUrls: ["./committees-statistic.component.css"],
  providers: [CommitteesStatisticService],
})
export class CommitteesStatisticComponent
  implements
    OnInit,
    ICommitteesComponent<DivisionNumberStatistic, CommitteesStatisticViewModel>
{
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
    DivisionNumberStatistic,
    CommitteesStatisticViewModel
  > = new CommitteesStatisticConverter();

  show() {
    if (this.Committees) {
      this.service.load(this.Committees.Id).then((data) => {
        this.view = this.Converter.Convert(data);
      });
    }
  }

  view = new CommitteesStatisticViewModel();

  constructor(private service: CommitteesStatisticService) {}
  onLoaded(): void {
    this.show();
  }

  ngOnInit() {
    GlobalStoreService.interval.subscribe(() => {
      this.show();
    });
  }
}

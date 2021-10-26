import { Component, Input, OnInit } from "@angular/core";
import { Language } from "src/app/common/tool/language";
import { EventType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { GarbageStationNumberStatistic } from "src/app/data-core/model/waste-regulation/garbage-station-number-statistic";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
import { ICommitteesConverter } from "../interface/committees-converter.interface";
import { RecordRankService } from "./record-rank.service";
import {
  RecordRankItemViewModel,
  RecordRankViewModel,
} from "./record-rank.model";
import { ICommitteesComponent } from "../interface/committees-component.interface";

@Component({
  selector: "app-record-rank",
  templateUrl: "./record-rank.component.html",
  styleUrls: ["./record-rank.component.css"],
  providers: [RecordRankService],
})
export class RecordRankComponent
  implements
    OnInit,
    ICommitteesComponent<
      GarbageStationNumberStatistic,
      RecordRankItemViewModel
    >
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

  private _Type: BussinessEnumItem;
  public get Type(): BussinessEnumItem {
    return this._Type;
  }
  @Input()
  public set Type(v: BussinessEnumItem) {
    this._Type = v;
    this.onTypeChanged(v);
  }

  private _Types: IBussinessEnum;
  public get Types(): IBussinessEnum {
    return this._Types;
  }

  @Input()
  public set Types(v: IBussinessEnum) {
    this._Types = v;
  }

  get types(): BussinessEnumItem[] {
    let array = [];
    for (const key in this.Types) {
      if (Object.prototype.hasOwnProperty.call(this.Types, key)) {
        const type = this.Types[key];
        array.push(type);
      }
    }
    return array;
  }

  @Input()
  Converter: ICommitteesConverter<
    GarbageStationNumberStatistic,
    RecordRankItemViewModel
  >;

  view: RecordRankViewModel = new RecordRankViewModel();

  type_display = false;

  constructor(private business: RecordRankService) {}

  onLoaded() {
    this.show();
    this.onTypeChanged(this.Type);
  }

  onTypeChanged(t: BussinessEnumItem) {
    if (this.types.length > 0) {
      this.view.EventType = t.key;

      let type = this.types.find((x) => x.key == t.key);
      this.view.EventTypeName = type.value;
      this.show();
    }
  }

  ngOnInit() {
    GlobalStoreService.interval.subscribe(() => {
      this.show();
    });
  }

  show() {
    if (this.Committees && this.Type) {
      this.business.load(this.Committees.Id).then((datas) => {
        this.view.items = datas
          .map((data) => {
            return this.Converter.Convert(data, this.Type.key);
          })
          .sort((a, b) => {
            return b.value - a.value;
          });
        let i = 0;
        this.view.items.forEach((x) => {
          x.Index = ++i;
        });
      });
    }
  }

  typeClick(event: Event, type: BussinessEnumItem) {
    this.Type = type;
    this.type_display = false;
    event.stopPropagation();
  }
  doTypeChange() {
    this.type_display = true;
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";

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

  @Output()
  OnItemClicked: EventEmitter<GarbageStation> = new EventEmitter();

  view: RecordRankViewModel = new RecordRankViewModel();

  display = {
    type: false,
  };

  constructor(private service: RecordRankService) {}

  onLoaded() {
    this.show();
    if (this.Type) {
      this.onTypeChanged(this.Type);
    }
  }

  onTypeChanged(t: BussinessEnumItem) {
    this.view.EventType = t.key;
    if (this.types.length > 0) {
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
      this.service.load(this.Committees.Id).then((datas) => {
        this.view.items = datas
          .map((data) => {
            return this.Converter.Convert(data, this.Type.key);
          })
          .sort((a, b) => {
            return b.value - a.value;
          });
        if (this.view.items.length < 10) {
          for (let i = this.view.items.length; i < 10; i++) {
            let item = new RecordRankItemViewModel();
            this.view.items.push(item);
          }
        }
        let i = 0;
        this.view.items.forEach((x) => {
          x.Index = ++i;
        });
      });
    }
  }

  typeClick(event: Event, type: BussinessEnumItem) {
    this.Type = type;
    this.display.type = false;
    event.stopPropagation();
  }
  doTypeChange() {
    this.display.type = true;
  }

  async itemClicked(event: Event, item: RecordRankItemViewModel) {
    let station = await this.service.getItem(item.Id);
    this.OnItemClicked.emit(station);
    event.stopPropagation();
  }
}

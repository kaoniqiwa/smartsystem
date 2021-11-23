import { Component, Input, OnInit } from "@angular/core";
import { Language } from "src/app/common/tool/language";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import {
  GarbageStation,
  Member,
} from "src/app/data-core/model/waste-regulation/garbage-station";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";

@Component({
  selector: "app-station-information",
  templateUrl: "./station-information.component.html",
  styleUrls: ["./station-information.component.css"],
})
export class DivisionInformationComponent implements OnInit {
  private _Station: GarbageStation;
  public get Station(): GarbageStation {
    return this._Station;
  }

  @Input()
  Division: Division;

  @Input()
  public set Station(v: GarbageStation) {
    this._Station = v;
    this._DefaultMember = undefined;
  }

  private _DefaultMember?: Member;
  get DefaultMember() {
    if (this.Station && this.Station.Members && this.Station.Members) {
      this._DefaultMember = this.Station.Members[0];
    }
    return this._DefaultMember;
  }

  get Members() {
    if (this.Station) {
      return this.Station.Members ? this.Station.Members : [];
    }
    return [];
  }

  constructor() {}

  ngOnInit() {}
}

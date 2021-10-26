import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { GarbageStation } from "src/app/data-core/model/waste-regulation/garbage-station";

@Component({
  selector: "app-committees-navication",
  templateUrl: "./committees-navication.component.html",
  styleUrls: ["./committees-navication.component.css"],
})
export class CommitteesNavicationComponent implements OnInit {
  @Input()
  Committees: Division;
  @Input()
  Stations: GarbageStation[];

  StationSelected?: GarbageStation;

  @Output()
  OnCommitteesClicked: EventEmitter<Division> = new EventEmitter();
  @Output()
  OnStationClicked: EventEmitter<GarbageStation> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  CommitteesClicked() {
    this.StationSelected = undefined;
    this.OnCommitteesClicked.emit(this.Committees);
  }

  StationClicked(station: GarbageStation) {
    this.StationSelected = station;
    this.OnStationClicked.emit(station);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { flatten } from "@angular/core/src/render3/util";
import { WindowViewModel } from "./window.model";

@Component({
  selector: "app-window",
  templateUrl: "./window.component.html",
  styleUrls: ["./window.component.css"],
})
export class WindowComponent implements OnInit {
  @Input()
  Model: WindowViewModel = {
    show: false,
  };

  @Output()
  OnClosing: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  closeButtonClick() {
    this.Model.show = false;
    this.OnClosing.emit(true);
  }
}

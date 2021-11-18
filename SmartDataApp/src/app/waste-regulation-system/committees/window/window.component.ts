import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CssSelectorList } from "@angular/core/src/render3";
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

  @Input()
  Background = true;

  @Input()
  CloseButton = true;

  private _Style: any = {
    width: "90%",
    height: "90%",
    position: "absolute",
    transform: "translate(5%, 5%)",
  };
  public get Style(): any {
    return this._Style;
  }
  @Input()
  public set Style(v: any) {
    this._Style = Object.assign(this._Style, v);
  }

  @Output()
  OnClosing: EventEmitter<boolean> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  closeButtonClick() {
    this.Model.show = false;
    this.OnClosing.emit(true);
  }
}

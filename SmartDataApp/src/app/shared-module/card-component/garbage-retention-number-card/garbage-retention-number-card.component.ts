import { Component, OnInit } from "@angular/core";
import {
  BasisCardComponent,
  CardComponent,
  ViewsModel,
} from "src/app/common/abstract/base-view";
import { IViewEvent } from "src/app/common/interface/IViewEvent";
import { GarbageRetentionNumberCardDatas } from "./garbage-retention-number-card-data";

@Component({
  selector: "app-garbage-retention-number-card",
  templateUrl: "./garbage-retention-number-card.component.html",
  styleUrls: ["./garbage-retention-number-card.component.css"],
})
export class GarbageRetentionNumberCardComponent
  extends BasisCardComponent
  implements OnInit
{
  title: string = "垃圾滞留未处置排名";
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.loadDatas(new ViewsModel<GarbageRetentionNumberCardDatas>());
  }
  btnControl: (tag: IViewEvent) => {};

  itemClick(id: string) {
    // if (id) this.btnControl({ id: id });
  }
}

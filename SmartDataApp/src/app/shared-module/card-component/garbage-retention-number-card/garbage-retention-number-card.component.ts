import { Component, OnInit } from "@angular/core";
import {
  BasisCardComponent,
  CardComponent,
  ViewsModel,
} from "src/app/common/abstract/base-view";
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
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.loadDatas(new ViewsModel<GarbageRetentionNumberCardDatas>());

    console.log("GarbageRetentionNumberCardComponent:", this.datas);
  }

  itemClick(id: string) {
    if (id) this.btnControl({ id: id });
  }
}

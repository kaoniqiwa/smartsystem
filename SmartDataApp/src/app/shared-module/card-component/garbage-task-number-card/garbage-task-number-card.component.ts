import { Component, OnInit } from "@angular/core";
import {
  BasisCardComponent,
  CardComponent,
  ViewsModel,
} from "src/app/common/abstract/base-view";
import { GarbageTaskNumberCardDatas } from "./garbage-task-number-card-data";

@Component({
  selector: "app-garbage-task-number-card",
  templateUrl: "./garbage-task-number-card.component.html",
  styleUrls: ["./garbage-task-number-card.component.css"],
})
export class GarbageTaskNumberCardComponent
  extends BasisCardComponent
  implements OnInit
{
  constructor() {
    super();
  }
  ngOnInit(): void {
    this.loadDatas(new ViewsModel<GarbageTaskNumberCardDatas>());
  }

  itemClick(id: string) {
    if (id) this.btnControl({ id: id });
  }
}

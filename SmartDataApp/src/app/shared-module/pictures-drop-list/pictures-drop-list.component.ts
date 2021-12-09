import { Component, OnInit, Input } from "@angular/core";
import { PicturesDropList } from "./pictures-drop-list";
import { domClickFn } from "../../common/tool/jquery-help/jquery-help";
@Component({
  selector: "hw-pictures-drop-list",
  templateUrl: "./pictures-drop-list.component.html",
  styleUrls: ["./pictures-drop-list.component.styl"],
})
export class PicturesDropListComponent implements OnInit {
  @Input() model = new Array<PicturesDropList>();
  showList = false;
  constructor() {}

  ngOnInit() {
    domClickFn("body", () => {
      this.showList = false;
    });
  }
  checkedItem: PicturesDropList;

  itemClick(item: PicturesDropList) {
    this.model.map((x) => (x.checked = false));
    item.checked = !item.checked;
    this.checkedItem = this.model.find((x) => x.checked);
  }
}

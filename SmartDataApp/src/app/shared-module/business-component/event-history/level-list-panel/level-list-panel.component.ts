import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { LevelListPanel, ListNode } from "./level-list-panel";
import { domClickFn } from "../../../../common/tool/jquery-help/jquery-help";
import { GlobalStoreService } from "src/app/shared-module/global-store.service";
@Component({
  selector: "hw-level-list-panel",
  templateUrl: "./level-list-panel.component.html",
  styleUrls: ["./level-list-panel.component.styl"],
})
export class LevelListPanelComponent implements OnInit {
  @Input() model: LevelListPanel;

  @Output() selectedFn: EventEmitter<string> = new EventEmitter();
  private showBody = false;
  private nodes = new Array<ListNode>();
  private prevItem = false;
  selectedItem = "";
  constructor() {}

  ngOnInit() {
    if (this.model && this.model.listNodes) {
      const n = new ListNode();
      n.id = "";
      n.name = "请选择";
      n.parentId = "";
      this.nodes = [n];
      this.model.listNodes
        .filter((f) => f.head == true)
        .map((m) => this.nodes.push(m));
      this.selectedItem = n.name;
      if (this.selectedFn) this.selectedFn.emit(GlobalStoreService.divisionId);
    }
    domClickFn("body", () => {
      this.showBody = false;
    });
  }

  itemClick(val: ListNode) {
    if (val == null) return;
    if ((this.model.last && val.last) || (!this.model.last && !val.last))
      this.selectedItem = val.name;
    if (this.selectedFn) this.selectedFn.emit(val.id);
    const filter = this.model.listNodes.filter((x) => x.parentId == val.id);
    if (filter.length) {
      this.nodes = filter;
      this.prevItem = true;
    }
  }

  defaultItem(id: string) {
    debugger;
    const node = this.model.listNodes.find((x) => x.id == id);
    this.itemClick(node);
  }

  prevItemClick() {
    var filter = this.model.listNodes.filter((x) => x.head == true);
    if (filter.length) {
      this.prevItem = false;
      const n = new ListNode();
      n.id = "";
      n.name = "请选择";
      n.parentId = "";
      filter.push(n);
      filter = filter.reverse();
      this.nodes = filter;
    }
  }
}

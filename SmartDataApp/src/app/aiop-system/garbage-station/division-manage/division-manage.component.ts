import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatTreeNestedDataSource } from "@angular/material";
import { DivisionType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { FlatNode } from "src/app/shared-module/custom-tree/custom-tree";
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import { NestedDivisionTreeNode } from "./model/division-manage.model";
import { DivisionManageService } from "./service/division-manage.service";

@Component({
  selector: "app-division-manage",
  templateUrl: "./division-manage.component.html",
  styleUrls: ["./division-manage.component.less"],
  providers: [DivisionManageService],
})
export class DivisionManageComponent implements OnInit {
  @ViewChild("divisionStationTree")
  divisionStationTree: DivisionStationTreeComponent;

  title = "区划详情";

  // 当前选中的区划
  currentNode: FlatNode<Division>;

  // 默认当前区划阶级别为省级,可添加子级 区级
  currentLevel: DivisionType = DivisionType.Province;

  // 三个按钮的状态
  canAdd: boolean = true;
  canDelete: boolean = false;
  canEdit: boolean = false;

  // 表单控件
  divisionForm = new FormGroup({
    Name: new FormControl({
      value: "",
      disabled: true,
    }),
    ParentName: new FormControl({
      value: "",
      disabled: true,
    }),
    Description: new FormControl({
      value: "",
      disabled: true,
    }),
  });

  _data: NestedDivisionTreeNode[] = [];
  treeControl = new NestedTreeControl<NestedDivisionTreeNode>(
    (node) => node.children
  );
  dataSource = new MatTreeNestedDataSource<NestedDivisionTreeNode>();
  hasChild = (level: number, node: NestedDivisionTreeNode) =>
    !!node.children && node.children.length > 0;

  constructor(private _divisionManageService: DivisionManageService) {}

  async ngOnInit() {
    this._data = await this._divisionManageService.loadData();
    this.dataSource.data = this._data;
  }
  clickTreeNode(node: FlatNode) {
    console.log(node);
  }

  selectDivisionClick = (item: FlatNode, lastNode: boolean) => {
    console.log(item, lastNode);
    this.currentNode = item;

    this.update();
  };
  update() {
    if (this.currentNode) {
      let parentNode = this.divisionStationTree.findNode(
        this.currentNode.data.ParentId
      );
      console.log(parentNode);
      this.divisionForm.patchValue({
        Name: this.currentNode.data.Name,
        ParentName: parentNode ? parentNode.name : "",
        Description: this.currentNode.data.Description,
      });
    }
  }
  onSubmit() {}
  onCancel() {}
}

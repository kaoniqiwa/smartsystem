import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { DivisionType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { FlatNode } from "src/app/shared-module/custom-tree/custom-tree";
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";

@Component({
  templateUrl: "./division-manage.component.html",
  styleUrls: ["./division-manage.component.less"],
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
  constructor() {}

  ngOnInit() {}

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

import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { AppCaChe } from "src/app/common/tool/app-cache/app-cache";
import { Language } from "src/app/common/tool/language";
import { MessageBar } from "src/app/common/tool/message-bar";
import { DivisionType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import {
  FlatNode,
  TreeNode,
} from "src/app/shared-module/custom-tree/custom-tree";
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import { DivisionManageService } from "./business/division-manage.service";
import { DivisionFormData, FormState } from "./model/division-manage.model";

@Component({
  selector: "app-division-manage",
  templateUrl: "./division-manage.component.html",
  styleUrls: ["./division-manage.component.less"],
  providers: [DivisionManageService],
})
export class DivisionManageComponent implements OnInit {
  /*** private ***/

  /*** public ***/

  title = Language.DivisionType(DivisionType.City) + "详情";

  // 当前区划级别(居委会区划没有权限添加新区划)
  divisionType: DivisionType = DivisionType.Province;

  // 当前表单状态
  state: FormState = FormState.none;

  // 表单控件
  divisionForm = new FormGroup({
    Name: new FormControl({
      value: "",
      disabled: true,
    }),
    Id: new FormControl({
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
  holdStatus = false;

  @ViewChild("stationTree")
  stationTree: DivisionStationTreeComponent;

  // 当前树节点
  private currentNode?: FlatNode<Division>;

  constructor(private _divisionManageService: DivisionManageService) {}

  async ngOnInit() {}

  addBtnClick() {
    if (this.state == FormState.add) {
      return;
    }
    console.log("添加");
    console.log("division type", this.divisionType);
    this.state = FormState.add;
    this._operateForm();
    this.divisionForm.reset();

    if (this.currentNode) this.holdStatus = true;
    console.log(this.stationTree.garbageStationTree.dataSource);
    console.log(this.stationTree.garbageStationTree.flatNodeMap);
    console.log(this.currentNode);
    console.log(
      this.stationTree.garbageStationTree.getChildNodes(this.currentNode)
    );
  }
  editBtnClick() {
    if (this.state == FormState.edit) {
      return;
    }
    console.log("编辑");
    this.state = FormState.edit;
    this._operateForm();

    this.holdStatus = true;
  }
  async delBtnClick() {
    console.log("删除");
    let divisionId = this.currentNode && this.currentNode.id;
    let res = await this._divisionManageService.deleteDivision(divisionId);
    if (res) {
      this.stationTree.garbageStationTree.delItem(this.currentNode);
      this.currentNode = null;
      this.divisionType = DivisionType.Province;
      this._updateForm();
      this.state = FormState.none;
    }
    let cache = new AppCaChe(1000 * 60 * 30);
  }

  /**
   * 点击树节点
   * @param item FlatNode
   */
  itemChangeHandler(item: FlatNode<Division>) {
    console.log(item);
    if (this.currentNode) {
      if (this.currentNode.id == item.id) {
        if (!this.holdStatus) {
          this.currentNode = null;
          this.divisionType = DivisionType.Province;
          this._updateForm();
          this.state = FormState.none;
          return;
        } else {
          if (this.state == FormState.edit || this.state == FormState.add) {
            return;
          }
        }
      } else {
        this.holdStatus = false;
      }
    }
    this.currentNode = item;
    this.divisionType = this.currentNode.data.DivisionType;
    this._updateForm();
    this.state = FormState.none;
  }

  /*** private ***/

  /**
   * 点击树节点后，更新表单字段信息(可读)
   */
  private _updateForm(disable = true) {
    if (this.currentNode) {
      let data = this.currentNode && this.currentNode.data;

      let parent = this.currentNode && this.currentNode.parent;

      this.title = Language.DivisionType(this.divisionType) + "详情";
      let divisionFormData: DivisionFormData = {
        Name: data.Name,
        Id: data.Id,
        ParentName: parent && parent.name,
        Description: data.Description,
      };
      this.divisionForm.patchValue(divisionFormData);
    } else {
      this.divisionForm.reset();
      this.title = Language.DivisionType(DivisionType.City) + "详情";
    }

    if (disable) {
      this._disableForm();
    } else {
      this._enableForm();
    }
  }
  private _operateForm() {
    if (this.state == FormState.add) {
      this.title = "添加" + Language.DivisionType(this.divisionType + 1);
    } else if (this.state == FormState.edit) {
      this.title = "编辑" + Language.DivisionType(this.divisionType);
    }
    this._enableForm();
  }
  private _disableForm() {
    this.divisionForm.get("Name").disable();
    this.divisionForm.get("Id").enable();
    this.divisionForm.get("ParentName").disable();
    this.divisionForm.get("Description").disable();
  }
  private _enableForm() {
    this.divisionForm.get("Name").enable();
    this.divisionForm.get("Id").enable();
    this.divisionForm.get("Description").enable();
  }

  async onSubmit() {
    let division = new Division();

    if (this.state == FormState.add) {
      division.Id = this.divisionForm.value.Id;
      division.Name = this.divisionForm.value.Name;
      division.DivisionType = this.divisionType + 1; // 新节点是当前区划的下一子节点
      division.IsLeaf = true; // 新添加的节点一定是叶节点
      division.ParentId = this.currentNode ? this.currentNode.id : null;
      division.CreateTime = new Date();
      division.UpdateTime = new Date();
      let res = await this._divisionManageService.addDivision(division);
      if (res) {
        console.log(res);
        let parentTreeNode = this.stationTree.garbageStationTree.getChildNodes(
          this.currentNode
        );
        let treeNode = new TreeNode();

        treeNode.name = res.Name;
        treeNode.checked = false;
        treeNode.id = res.Id;
        treeNode.data = res;
        // treeNode.iconClass = this.nodeIconType.get(item.type);
        treeNode.parent = parentTreeNode ? parentTreeNode : null;

        this.stationTree.garbageStationTree.addNewItem(
          this.currentNode,
          treeNode
        );
        this.onCancel();
        MessageBar.response_success();
      }
    } else if (this.state == FormState.edit) {
      division.Id = this.currentNode.id;
      division.Name = this.divisionForm.value.Name;
      division.Description = this.divisionForm.value.Description;
      division.ParentId = this.currentNode.data.ParentId;
      division.DivisionType = this.currentNode.data.DivisionType;
      division.IsLeaf = this.currentNode.data.IsLeaf;
      division.CreateTime = new Date(this.currentNode.data.CreateTime);
      division.UpdateTime = new Date();
      let res = await this._divisionManageService.editDivision(division);
      if (res) {
        this.currentNode.name = res.Name;
        this.stationTree.garbageStationTree.editNode(
          this.currentNode,
          res.Name,
          res
        );
        this.onCancel();
        MessageBar.response_success();
      }
    }
  }
  onCancel() {
    this._updateForm();
    this.state = FormState.none;
    this.holdStatus = false;
  }
}

// 310113000000
// 宝山区

// 310113102000
// 大场镇

// 310113102002
// 大华一村二居委会

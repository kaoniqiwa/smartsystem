import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { map } from "rxjs/operators";
import { AppCaChe } from "src/app/common/tool/app-cache/app-cache";
import { Language } from "src/app/common/tool/language";
import { MessageBar } from "src/app/common/tool/message-bar";
import { DivisionType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { ConfirmDialog } from "src/app/shared-module/confirm-dialog/confirm-dialog.component";
import {
  FlatNode,
  TreeNode,
} from "src/app/shared-module/custom-tree/custom-tree";
import { DivisionTreeComponent } from "../division-tree/division-tree.component";
import { DivisionManageService } from "./business/division-manage.service";
import { DivisionFormData, FormState } from "./model/division-manage.model";

@Component({
  selector: "app-division-manage",
  templateUrl: "./division-manage.component.html",
  styleUrls: ["./division-manage.component.less"],
  providers: [DivisionManageService],
})
export class DivisionManageComponent implements OnInit {
  // 当前树节点
  private currentNode?: FlatNode<Division>;

  /*** public ***/

  // 点击删除按钮弹窗
  showDialog = false;

  confirmDialog = new ConfirmDialog();

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
  cancleWhenClose = true;

  get enableAddBtn() {
    return this.divisionType < 4 && this.divisionType > 0;
  }
  get enableDelBtn() {
    return !!this.currentNode && this.divisionType;
  }

  get enableEditBtn() {
    return !!this.currentNode && this.divisionType;
  }
  @ViewChild("stationTree")
  stationTree: DivisionTreeComponent;

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
  }
  editBtnClick() {
    // 如果当前是添加状态，则需要清空输入内容，填入编辑状态的内容
    if (this.state == FormState.add) {
      this._updateForm();
    }

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
    this.showDialog = true;
  }

  searchChangeHandler(searchText: string) {
    console.log("search", searchText);
    this.currentNode = null;
    this.divisionType = DivisionType.Province;
    this._updateForm();
    this.state = FormState.none;
    this.holdStatus = false;
  }
  itemExpandHandler(node: FlatNode<any>) {
    if (this.cancleWhenClose) {
      if (!node.expanded) {
        console.log("当前节点", this.currentNode);
        console.log("关闭的节点", node);
        let parentNode = this.currentNode.parent;
        while (parentNode) {
          if (parentNode.id == node.id) break;
          parentNode = parentNode.parent;
        }
        // console.log(parentNode);
        if (parentNode) {
          this.currentNode = null;
          this.divisionType = DivisionType.Province;
          this._updateForm();
          this.state = FormState.none;
          this.holdStatus = false;
        }
      }
    }
  }
  /**
   * 点击树节点
   * @param item FlatNode
   */
  itemChangeHandler(item: FlatNode<Division>) {
    console.log("节点", item);
    if (this.currentNode) {
      if (this.currentNode.id == item.id) {
        if (!this.holdStatus) {
          this.currentNode = null;
          this.divisionType = DivisionType.Province;
          this._updateForm();
          this.state = FormState.none;
          this.holdStatus = false;
          return;
        } else {
          if (this.state == FormState.edit || this.state == FormState.add) {
            this.holdStatus = true;
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

  async onSubmit() {
    if (!this.divisionType) return;
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
        // console.log(res);

        this.stationTree.addItem(this.currentNode, res);
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
        this.currentNode.data = res;

        this.stationTree.editItem(this.currentNode, res);
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
  async dialogMsg(msg: string) {
    console.log(msg);
    this.showDialog = false;

    if (msg == "ok") {
      let divisionId = this.currentNode && this.currentNode.id;
      let res = await this._divisionManageService.deleteDivision(divisionId);
      if (res) {
        this.stationTree.deleteItem(this.currentNode, res);
        this.currentNode = null;
        this.divisionType = DivisionType.Province;
        this._updateForm();
        this.state = FormState.none;
      }
    }
  }

  /*** private ***/

  /**
   * 点击树节点后，更新表单字段信息(可读)
   */
  private _updateForm(disable = true) {
    if (this.currentNode) {
      let data = this.currentNode && this.currentNode.data;

      let parent = this.currentNode && this.currentNode.parent;

      if ("DivisionType" in this.currentNode.data) {
        this.title = Language.DivisionType(this.divisionType) + "详情";
      } else if ("DivisionId" in this.currentNode.data) {
        this.title = "垃圾厢房详情";
      }

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
    this.divisionForm.get("Id").disable();
    this.divisionForm.get("ParentName").disable();
    this.divisionForm.get("Description").disable();
  }
  private _enableForm() {
    this.divisionForm.get("Name").enable();

    this.divisionForm.get("Description").enable();
    if (this.state == FormState.edit) return;
    this.divisionForm.get("Id").enable();
  }
}

// 310113000000
// 宝山区

// 310113102000
// 大场镇

// 310113102002
// 大华一村二居委会

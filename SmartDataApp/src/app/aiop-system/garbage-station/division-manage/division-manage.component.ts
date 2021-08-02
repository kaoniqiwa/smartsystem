import { NestedTreeControl } from "@angular/cdk/tree";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, FormsModule } from "@angular/forms";
import { MatTree, MatTreeNestedDataSource } from "@angular/material";
import { Language } from "src/app/common/tool/language";
import { MessageBar } from "src/app/common/tool/message-bar";
import { DivisionType } from "src/app/data-core/model/enum";
import {
  Division,
  GetDivisionsParams,
} from "src/app/data-core/model/waste-regulation/division";
import { DivisionStationTreeComponent } from "../division-station-tree/division-station-tree.component";
import {
  FormState,
  NestedDivisionTreeNode,
} from "./model/division-manage.model";
import { DivisionManageService } from "./service/division-manage.service";

@Component({
  selector: "app-division-manage",
  templateUrl: "./division-manage.component.html",
  styleUrls: ["./division-manage.component.less"],
  providers: [DivisionManageService],
})
export class DivisionManageComponent implements OnInit {
  // 默认当前区划阶级别为省级,可添加子级 区级
  private _divisionType: DivisionType = DivisionType.Province;
  private _messageBar = new MessageBar();

  @ViewChild("matTree")
  divisionStationTree: MatTree<NestedDivisionTreeNode>;

  title = Language.DivisionType(DivisionType.City) + "详情";

  // 当前选中的区划
  currentNode: NestedDivisionTreeNode | null = null;

  _currentElement: HTMLElement | null = null;

  state = FormState.none;

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
  /*
    树节点的点击事件不会冒泡上来，则容器click事件触发时，一定不是点击 mat-tree
  */
  divisionTreeContainerClick() {
    // this.currentNode = null;
    // this.update();
  }

  clickTreeNode(node: NestedDivisionTreeNode, e: Event) {
    /**
     *  如果当前节点是选中状态
     *    1. 不在编辑，添加界面，点击则取消选中
     *    2. 在编辑，添加界面，点击则保持编辑，添加界面
     *
     */
    if (this.currentNode && this.currentNode.id == node.id) {
      if (this.state == FormState.edit || this.state == FormState.add) return;
      else this.currentNode = null;
    } else {
      this.currentNode = node;
    }
    this.state = FormState.none;
    if (this.currentNode) {
      this.title =
        Language.DivisionType(this.currentNode.divisionType) + "详情";
    }
    this.update();

    e.stopPropagation();
  }

  update(disabled: boolean = true) {
    let parentNode = null;
    if (this.currentNode) {
      parentNode = this._divisionManageService.findNode(
        this.currentNode.parentId,
        this.currentNode.divisionType - 1
      );
    }
    if (this.state == FormState.add) {
      this.divisionForm.patchValue({
        Name: "",
        ParentName: "",
        Description: "",
        Id: "",
      });
    } else {
      this.divisionForm.patchValue({
        Name: this.currentNode ? this.currentNode.name : "",
        Id: this.currentNode ? this.currentNode.id : "",
        ParentName: parentNode ? parentNode.name : "",
        Description: this.currentNode ? this.currentNode.description : "",
      });
    }

    if (disabled) {
      this.disableForm();
    } else {
      this.enableForm();
    }
  }

  addBtnClick(node: NestedDivisionTreeNode, e: Event) {
    this.operateForm(node, e, FormState.add);
  }
  editBtnClick(node: NestedDivisionTreeNode, e: Event) {
    this.operateForm(node, e, FormState.edit);
  }
  operateForm(node: NestedDivisionTreeNode, e: Event, state: FormState) {
    if (e) {
      e.stopPropagation();
    }
    if (node) {
      this._divisionType = node.divisionType;
      this.treeControl.expand(node);
    } else {
      this._divisionType = DivisionType.Province;
      this.treeControl.collapseAll();
    }
    if (state == FormState.add) {
      if (this.state == FormState.add && this.currentNode == node) {
        return;
      }
      this.title = "添加" + Language.DivisionType(this._divisionType + 1);
      this.state = FormState.add;
    } else if (state == FormState.edit) {
      if (this.state == FormState.edit && this.currentNode == node) {
        return;
      }
      this.title = "编辑" + Language.DivisionType(this._divisionType);
      this.state = FormState.edit;
    }
    this.currentNode = node;
    this.update(false);
    console.log("division type", this._divisionType);
  }
  deleteBtnClick(node: NestedDivisionTreeNode, e: Event) {
    let res = this._divisionManageService.deleteDivision(node.id);
    console.log("删除区划", res);
  }
  async onSubmit() {
    console.log(this.divisionForm.value);
    let division = new Division();
    if (this.state == FormState.add) {
      division.Id = this.divisionForm.value.Id;
      division.Name = this.divisionForm.value.Name;
      division.DivisionType = this._divisionType + 1; // 新节点是当前区划的下一子节点
      division.IsLeaf = true; // 新添加的节点一定是叶节点
      division.ParentId = this.currentNode ? this.currentNode.id : null;
      division.CreateTime = new Date().toISOString();
      division.UpdateTime = new Date().toISOString();

      let res = this._divisionManageService.addDivision(division);
      console.log("add", res);
    } else if (this.state == FormState.edit) {
      division.Id = this.currentNode.id;
      division.Name = this.divisionForm.value.Name;
      division.Description = this.divisionForm.value.Description;
      division.ParentId = this.currentNode.parentId;
      division.DivisionType = this.currentNode.divisionType;
      division.IsLeaf = this.currentNode.isLeaf;
      division.CreateTime = this.currentNode.createTime;
      division.UpdateTime = new Date().toISOString();
      let res = await this._divisionManageService.editDivision(division);
      if (res instanceof Division) {
        this._messageBar.response_success();
        const params = new GetDivisionsParams();
        params.PageSize = 9999;
        this._data = await this._divisionManageService.loadData(params);
        this.dataSource.data = this._data;
        // this.clickTreeNode()
      }
    }
    console.log(division);
  }
  onCancel() {
    console.log("取消");
    this.state = FormState.none;
    this._divisionType = DivisionType.Province;
    this.title = "行政区划详情";
    this.update();
  }
  disableForm() {
    this.divisionForm.get("Name").disable();
    this.divisionForm.get("Id").enable();
    this.divisionForm.get("ParentName").disable();
    this.divisionForm.get("Description").disable();
  }
  enableForm() {
    this.divisionForm.get("Name").enable();
    this.divisionForm.get("Id").enable();
    this.divisionForm.get("Description").enable();
  }
}

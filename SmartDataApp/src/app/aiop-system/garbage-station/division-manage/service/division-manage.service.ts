import { Injectable } from "@angular/core";
import { noSideEffects } from "@angular/core/src/util";
import { plainToClass } from "class-transformer";
import { filter } from "rxjs/operators";
import { DivisionType } from "src/app/data-core/model/enum";
import {
  Division,
  GetDivisionsParams,
} from "src/app/data-core/model/waste-regulation/division";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import {
  IconType,
  NestedDivisionTreeNode,
} from "../model/division-manage.model";

@Injectable()
export class DivisionManageService {
  private _divisionMap = new Map<number, NestedDivisionTreeNode[]>();
  private _filteredMap = new Map<number, NestedDivisionTreeNode[]>();

  private _data: Division[] = [];

  constructor(private _divisionRequestService: DivisionRequestService) {}

  async loadData(params?: GetDivisionsParams) {
    this._divisionMap.clear();

    this._data = await this._requestDivision(params);
    console.log("区划数据", this._data);

    return this._parseData(this._data);
  }
  private async _requestDivision(params?: GetDivisionsParams) {
    const response = await this._divisionRequestService.list(params);
    return response.Data;
  }
  /**
   *
   * @param data Division[]
   * @description 将 Division[] 转换为  NestedDivisionTreeNode[]
   */
  private _parseData(data: Division[]) {
    // 根据 DivisionType 来创建不同层级的 NestedDivisionTreeNode

    let len = data.length;
    for (let i = 0; i < len; i++) {
      // Division
      let item = data[i];

      let node: NestedDivisionTreeNode = {
        id: item.Id,
        name: item.Name,
        parentId: item.ParentId,
        divisionType: item.DivisionType,
        isLeaf: item.IsLeaf,
        createTime: item.CreateTime,
        UpdateTime: item.UpdateTime,
        hide: false,
        iconClass: item.DivisionType > 2 ? IconType.map : IconType.earth,

        description: item.Description,
      };
      // 当前层级还未保存节点
      if (!this._divisionMap.get(item.DivisionType)) {
        this._divisionMap.set(item.DivisionType, []);
      }
      let divisionArr = this._divisionMap.get(item.DivisionType)!;

      // 将节点保存到对应的层级数组中
      divisionArr.push(node);

      // 处理父子关系
      let parendDivisionArr = this._divisionMap.get(item.DivisionType - 1);
      if (parendDivisionArr) {
        let parentNode = parendDivisionArr.find((p) => {
          return p.id == item.ParentId;
        });
        if (parentNode) {
          if (!parentNode.children) {
            parentNode.children = [];
          }
          parentNode.children.push(node);
        }
      }
    }
    console.log("树状数据", this._divisionMap);

    // 返回最高层级
    return this._divisionMap.get(DivisionType.City);
  }
  findNode(id: string, type: DivisionType) {
    let divisionArr = this._divisionMap.get(type);
    // console.log(divisionArr);
    if (divisionArr) {
      return divisionArr.find((node) => node.id == id);
    }
    return null;
  }
  // 添加节点，仅需要parseData(division)
  private _addNode(division: Division) {
    this._parseData([division]);
  }
  /*
      loadData()返回的是对象类型，可以在 deleteNode()中修改外部 treeData的值
  */
  private _deleteNode(node: NestedDivisionTreeNode) {
    let divisionArr = this._divisionMap.get(node.divisionType);
    let index = divisionArr.findIndex((item) => item.id == node.id);
    if (index > -1) {
      divisionArr.splice(index, 1);
    }
    let parentNode = this.findNode(node.parentId, node.divisionType - 1);
    if (parentNode && parentNode.children) {
      let index = parentNode.children.findIndex((item) => item.id == node.id);
      console.log(index);
      if (index > -1) {
        parentNode.children.splice(index, 1);
      }
    }
  }

  private _editNode(division: Division) {
    let node = this.findNode(division.Id, division.DivisionType);
    console.log(node);
    node.name = division.Name;
    node.description = division.Description;
  }
  /**
   *
   * @param val  搜索字段
   * @param depth 搜索深度
   */
  searchByText(val: string, depth: DivisionType) {
    this._filteredMap.clear();
    let level = depth;
    let n = depth;

    // 初步筛选出所有包含条件的节点
    while (depth > DivisionType.Province) {
      this._searchInDeepth(val, depth--);
    }

    // 根据这些节点构造出树
    while (level > DivisionType.Province) {
      this._buildTree(level--);
    }
  }
  private _searchInDeepth(val: string, depth: DivisionType) {
    let allData = this._divisionMap.get(depth);
    let filteredData = allData.filter((data) => data.name.includes(val));
    if (!this._filteredMap.get(depth)) {
      this._filteredMap.set(depth, []);
    }
    this._filteredMap.get(depth).push(...filteredData);
  }
  private _buildTree(depth: DivisionType) {
    // 当前深度的所有数据
    let currentData = this._filteredMap.get(depth);

    // 上个深度的所有数据
    let parentData = this._filteredMap.get(depth - 1);

    if (parentData) {
      currentData.forEach((item) => {
        // 如果父数组没有当前节点的父节点，则需要添加到父数组中
        let parentNode = parentData.find((node) => node.id == item.parentId);
        if (!parentNode) {
          parentNode = this._divisionMap
            .get(depth - 1)
            .find((m) => m.id == item.parentId);
          if (parentNode) {
            parentData.push(parentNode);
          }
        }
      });
    }

    let allData = this._divisionMap.get(depth);
    allData.forEach((item) => (item.hide = true));
    currentData.forEach((item) => (item.hide = false));
  }
  private _buildTree2(depth: DivisionType) {
    // console.log(depth);
    // 当前深度的所有数据
    let currentData = this._filteredMap.get(depth);

    // 上个深度的所有数据
    let parentData = this._filteredMap.get(depth - 1);
    // 区没有上级，在while()循环中已经有控制
    if (!parentData) return;

    // 先清空父节点的 children，后面再添加搜索到的子节点
    parentData.forEach((parentNode) => (parentNode.children = []));

    currentData.forEach((item) => {
      // 如果父数组没有当前节点的父节点，则需要添加到父数组中
      let parentNode = parentData.find((node) => node.id == item.parentId);
      if (!parentNode) {
        parentNode = this._divisionMap
          .get(depth - 1)
          .find((m) => m.id == item.parentId);
        if (parentNode) {
          parentNode.children = [];
          parentData.push(parentNode);
        }
      }
      parentNode.children.push(item);
    });
  }
  addDivision(divison: Division) {
    this._addNode(divison);
    this._divisionRequestService.create(divison);
    return this.findNode(divison.Id, divison.DivisionType);
  }
  deleteDivision(node: NestedDivisionTreeNode) {
    this._deleteNode(node);
    return this._divisionRequestService.del(node.id);
  }
  editDivision(divison: Division) {
    this._editNode(divison);
    return this._divisionRequestService.set(divison);
  }
}

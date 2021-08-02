import { Injectable } from "@angular/core";
import { DivisionType } from "src/app/data-core/model/enum";
import {
  Division,
  GetDivisionsParams,
} from "src/app/data-core/model/waste-regulation/division";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { NestedDivisionTreeNode } from "../model/division-manage.model";

@Injectable()
export class DivisionManageService {
  private _divisionMap = new Map<number, NestedDivisionTreeNode[]>();

  constructor(private _divisionRequestService: DivisionRequestService) {}
  async loadData(params?: GetDivisionsParams) {
    this._divisionMap = new Map<number, NestedDivisionTreeNode[]>();
    let data = await this._requestDivision(params);
    console.log("区划数据", data);

    return this._parseData(data);
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
    return [...this._divisionMap.get(DivisionType.City)];
  }
  findNode(id: string, type: DivisionType) {
    let divisionArr = this._divisionMap.get(type);
    // console.log(divisionArr);
    if (divisionArr) {
      return divisionArr.find((node) => node.id == id);
    }
    return null;
  }

  addDivision(divison: Division) {
    return this._divisionRequestService.create(divison);
  }
  deleteDivision(id: string) {
    return this._divisionRequestService.del("华阳路一居委会");
  }
  editDivision(divison: Division) {
    return this._divisionRequestService.set(divison).catch((e) => {});
  }
}

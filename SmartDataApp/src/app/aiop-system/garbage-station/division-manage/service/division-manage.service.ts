import { Injectable } from "@angular/core";
import { DivisionType } from "src/app/data-core/model/enum";
import { Division } from "src/app/data-core/model/waste-regulation/division";
import { DivisionRequestService } from "src/app/data-core/repuest/division.service";
import { NestedDivisionTreeNode } from "../model/division-manage.model";

@Injectable()
export class DivisionManageService {
  constructor(private _divisionRequestService: DivisionRequestService) {}
  async loadData() {
    let data = await this._requestDivision();
    console.log(data);

    return this._parseData(data);
  }
  private async _requestDivision() {
    const response = await this._divisionRequestService.list();
    return response.Data;
  }
  /**
   *
   * @param data Division[]
   * @description 将 Division[] 转换为  NestedDivisionTreeNode[]
   */
  private _parseData(data: Division[]) {
    // 根据 DivisionType 来创建不同层级的 NestedDivisionTreeNode
    let divisionMap = new Map<number, NestedDivisionTreeNode[]>();
    let len = data.length;
    for (let i = 0; i < len; i++) {
      // Division
      let item = data[i];

      let node: NestedDivisionTreeNode = {
        id: item.Id,
        name: item.Name,
      };
      // 当前层级还未保存节点
      if (!divisionMap.get(item.DivisionType)) {
        divisionMap.set(item.DivisionType, []);
      }
      let divisionArr = divisionMap.get(item.DivisionType)!;

      // 将节点保存到对应的层级数组中
      divisionArr.push(node);

      // 处理父子关系
      let parendDivisionArr = divisionMap.get(item.DivisionType - 1);
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
    console.log(divisionMap);

    // 返回最高层级
    return divisionMap.get(DivisionType.City);
  }
}

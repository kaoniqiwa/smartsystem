import { Division } from "../../../data-core/model/waste-regulation/division";
import { GarbageStation } from "../../../data-core/model/waste-regulation/garbage-station";
import { LevelListPanel, ListNode } from "./level-list-panel/level-list-panel";
import { DivisionTypeEnum } from "../../../common/tool/enum-helper";
export class DivisionListView {
    dataSource: LevelListPanel;
    constructor() {
        this.dataSource = new LevelListPanel();
        this.dataSource.listNodes = new Array();
    }

    toLevelListPanel(list: Division[]) {
        const county = list.filter(l => l.DivisionType == DivisionTypeEnum.County)
            , committees = list.filter(l => l.DivisionType == DivisionTypeEnum.Committees);
        var headType: DivisionTypeEnum;
        if (county.length > 0)
            headType = DivisionTypeEnum.County;
        else if (committees.length > 0)
            headType = DivisionTypeEnum.Committees;
        for (const t of list) {
            const node = new ListNode();
            node.id = t.Id;
            node.name = t.Name;
            node.parentId = t.ParentId;
            node.head = t.DivisionType == headType;
            this.dataSource.listNodes.push(node);
        }
    }

    toStationList(station:Array<GarbageStation>){
        this.dataSource.last=true;
        for (const t of station) {
            const node = new ListNode();
            node.id = t.Id;
            node.last=true;
            node.name = t.Name;
            node.parentId = t.DivisionId; 
            this.dataSource.listNodes.push(node);
        }
    }
}
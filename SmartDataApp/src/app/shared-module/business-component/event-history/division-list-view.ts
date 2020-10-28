import { Division } from "../../../data-core/model/waste-regulation/division";
import {  LevelListPanel,ListNode} from "./level-list-panel/level-list-panel";
export class DivisionListView{
    dataSource:LevelListPanel;
    constructor(){
        this.dataSource  = new LevelListPanel();
        this.dataSource.listNodes = new Array();
    }
    
    toLevelListPanel(list:Division[]){
        for(const t of list){
            const node =new ListNode();
            node.id=t.Id;
            node.name=t.Name;
            node.parentId=t.ParentId;
            this.dataSource.listNodes.push(node);
        }
    }
}
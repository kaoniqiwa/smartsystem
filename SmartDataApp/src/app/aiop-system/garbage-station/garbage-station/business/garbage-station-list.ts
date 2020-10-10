import { DataService } from "./data.service";
import { DivisionTreeNode, TreeService } from "../../../common/tree.service";
import { GarbageStationTypes, GarbageStationTypeMini } from "../../../common/tree.service";
import { GarbageStationType } from "../../../../data-core/model/waste-regulation/garbage-station-type";
import { MessageBar } from "../../../../common/tool/message-bar";
export class GarbageStationList extends TreeService {
    dataSource = new Array<StationTypeTree>();
    selectedNode: DivisionTreeNode;
    subTitle = '创建垃圾厢房';
    msg = new MessageBar();
    firstWindowNumText = 4;
    firstNameText = '';
    constructor(private dataService: DataService) {
        super();
    }


    async loadList() {
        await this.getGarbageStationType();
        this.getTreeNode();
        this.firstNode();
    }

    getTreeNode() {
        const types = new GarbageStationTypes();
        types.items = new Array<GarbageStationTypeMini>();

        for (const x of this.dataService.types) {
            const mini = new GarbageStationTypeMini();
            mini.id = x.Type + '';
            mini.isLeaf = false;
            mini.name = x.Name;
            types.items.push(mini);
        }

        const nodes = this.convertTreeNode(types);
        for(var n of nodes)        
             (n as StationTypeTree).show = true;
        
        this.dataSource = nodes as StationTypeTree[];

    }

    firstNode() {
        /**初始化 第一 */
        if (this.dataSource.length) {
            this.selectedNode = this.dataSource[0];
            this.subTitle = this.dataSource[0].name;
            this.firstNameText = this.dataSource[0].name;
            this.firstWindowNumText = this.dataService.types[0].Windows.length;
        }
    }

    selectNode(node: DivisionTreeNode){
        this.selectedNode = node;
        this.subTitle = node.name;
        this.firstNameText = node.name;
        this.firstWindowNumText =this.dataService.types.find(x=>x.Type+'' == node.id).Windows.length;
    }

    clearFirsNode(){
        this.selectedNode = null;
        this.subTitle = '创建垃圾厢房';
        this.firstNameText = ''
        this.firstWindowNumText = 4;
    }

    addTreeNode(item: GarbageStationType) {
        const types = new GarbageStationTypes();
        types.items = new Array<GarbageStationTypeMini>();
        const mini = new GarbageStationTypeMini();
        mini.id = item.Type + '';
        mini.isLeaf = false;
        mini.name = item.Name;
        types.items.push(mini);
        const nodes = this.convertTreeNode(types);
        for(var n of nodes)        
            (n as StationTypeTree).show = true;
        this.dataSource = [...this.dataSource, ...nodes as StationTypeTree[]];
    }

    async delTreeNode(id: string) {
        const success = await this.dataService.delGarbageStationType(id);
        if (success) {
            this.msg.response_success();
            const index = this.dataSource.findIndex(x => x.id == id);
            this.dataSource.splice(index);
            if (this.dataSource.length) this.selectedNode = this.dataSource[0];
        }
    }

    async getGarbageStationType() {
        const types = await this.dataService.requestGarbageStationType(); console.log(types);

        this.dataService.types = types;
    }
}

export class StationTypeTree  extends DivisionTreeNode{
    show=true;
}
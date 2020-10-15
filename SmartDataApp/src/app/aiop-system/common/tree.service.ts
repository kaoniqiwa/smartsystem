import { Injectable } from "@angular/core";
import { ListAttribute } from "../../common/tool/table-form-helper";
import { TreeNode ,RightBtn} from "../../shared-module/custom-tree/custom-tree";
@Injectable()
export class TreeService extends ListAttribute {
    public dataSource = new Array<DivisionTreeNode>();

    nodeIconType = new Map<number,string>();
    constructor() {
        super();
        this.nodeIconType.set(1,'howell-icon-earth');
        this.nodeIconType.set(2,'howell-icon-map5');
        this.nodeIconType.set(3,'howell-icon-video');
        this.nodeIconType.set(4,'howell-icon-garbage');
    } 

    convertTreeNode<GarbageStationTypes>(input: GarbageStationTypes): DivisionTreeNode[];
    convertTreeNode<Regions>(input: Regions): DivisionTreeNode[];
    convertTreeNode<Cameras>(input: Cameras): DivisionTreeNode[];
    convertTreeNode<GarbageStations>(input: GarbageStations): DivisionTreeNode[];
    convertTreeNode<Divisions>(input: Divisions): DivisionTreeNode[];
    convertTreeNode(input: Divisions|GarbageStations|Cameras|Regions|GarbageStationTypes) {
        const nodes = new Array<DivisionTreeNode>();
        if (input instanceof Divisions ||input instanceof Regions) {
            for (const item of input.items) {
                const node = new DivisionTreeNode();
                node.id = item.id;
                node.name = item.name;
                node.parentId = item.parentId;
                node.isLeaf = item.isLeaf;  
                node.type=item.isLeaf ? NodeTypeEnum.map: NodeTypeEnum.root;
                nodes.push(node);
            }
        } 
        else  if (input instanceof GarbageStationTypes) {
            for (const item of input.items) {
                const node = new DivisionTreeNode();
                node.id = item.id;
                node.name = item.name; 
                node.isLeaf = true;                 
                node.type= NodeTypeEnum.map;
                nodes.push(node);
            }
        }
        else  if (input instanceof GarbageStations) {
            for (const item of input.items) {
                const node = new DivisionTreeNode();
                node.id = item.id;
                node.name = item.name;
                node.type=NodeTypeEnum.station;
                node.parentId = item.divisionId;
                node.isLeaf = true;   
                nodes.push(node);
            }
        }
        else  if (input instanceof Cameras) {
            for (const item of input.items) {
                const node = new DivisionTreeNode();
                node.id = item.id;
                node.name = item.name;
                node.parentId = item.regionId; 
                node.type=NodeTypeEnum.camera;
                node.isLeaf = true; 
                nodes.push(node);
            }
        }
        return nodes;
    }

    loadTree(items: DivisionTreeNode[]) { 
    
        const dataSource = new Array<TreeNode>();
        const addItems = (node: TreeNode, items: DivisionTreeNode[]) => {
            for (const item of items) {
                if (node.id == item.parentId) {
                    const node_ = new TreeNode();
                    node_.name = item.name;
                    node_.checked = false;
                    node_.id = item.id;
                    node_.iconClass = this.nodeIconType.get(item.type);
                    node_.rightClassBtn =item.type == NodeTypeEnum.camera? [new RightBtn('howell-icon-Link','1')]:[];
                    node.children = node.children || new Array<TreeNode>();
                    node.children.push(node_);
                    addItems(node_, items); 
                    console.log(node_);
                    
                }
            }
        }
        for (const item of items) {
            if (!item.parentId) {
                const node = new TreeNode();
                node.name = item.name;
                node.checked = false;
                node.rightClassBtn = item.type == NodeTypeEnum.camera? [new RightBtn('howell-icon-Link','1')]:[];
                node.id = item.id;
                node.iconClass = this.nodeIconType.get(item.type);
                dataSource.push(node);
                addItems(node, items);
            }
        } 
        
        return dataSource;
    }

    allLastChilds(treeNode: TreeNode[]) {
        var lastchildren = new Array<TreeNode>();
        const forxh = (treeNodes: TreeNode[]) => {
            for (var i = 0; i < treeNodes.length; i++) {
                var chlist = treeNodes[i];
                if (chlist.children && chlist.children.length > 0)
                    forxh(chlist.children);
                else
                    lastchildren.push(chlist);
            }
        }
        forxh(treeNode);
        return lastchildren;

    }


    filterNodes(text: string,nodeType:NodeTypeEnum) {
        const filterList = this.dataSource.filter(x => x.name.indexOf(text) > -1 && x.parentId && x.type == nodeType)
            , list = new Array<DivisionTreeNode>(); 
        const findParent = (item: DivisionTreeNode) => { 
        
            /**去除重复 */
            const find = this.dataSource.find(x => x.id == item.parentId);
            if (find&&find.parentId) {
                const f = filterList.find(g => g.id == find.id);
                if (f == null) {
                    const index = list.findIndex(c => c.id == find.id);
                    if (index == -1)
                        list.push(find);
                    findParent(find);
                }
            }
        }
        filterList.map(x => findParent(x));


        const parentList = this.dataSource.filter(x => !x.parentId); 
        return this.loadTree([...filterList, ...parentList, ...list]);
    } 

    noChildNodes(id: string, len: number) {
        return this.dataSource.filter(x => x.parentId == id).length == len;
    }
    
}

export enum NodeTypeEnum{
    root=1,
    map,
    camera,
    station
}
 
export class DivisionTreeNode {
    id: string;
    name: string;
    parentId: string;
    isLeaf: boolean; 
    type:NodeTypeEnum;
}

export class DivisionMini extends DivisionTreeNode{ 
    divisionType:number;
}

export class  GarbageStationTypeMini extends DivisionTreeNode{ }

export class RegionMini extends DivisionTreeNode{ 
    regionType:number;
}


export class GarbageStationMini { 
    id: string; 
    name: string;
    /**
     * 垃圾房类型(可选)，默认：0
     * 暂时无效，之后会用于高度，形状，室内、室外等区分
     */
    stationType: number; 
    /**所属区划ID(可选) */
    divisionId: string; 
}

export class CameraMini{
    id: string; 
    name: string;
    regionId:string;
}

export class Divisions {
    items: DivisionMini[];
}

export class Regions{
    items: RegionMini[];
}


export class GarbageStations {
    items: GarbageStationMini[];
}

export class Cameras {
    items: CameraMini[];
}


export class GarbageStationTypes{
    items: GarbageStationTypeMini[];
}
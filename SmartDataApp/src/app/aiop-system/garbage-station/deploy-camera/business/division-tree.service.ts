import { Injectable } from "@angular/core";
import { ListAttribute } from "../../../../common/tool/table-form-helper";
import { GetDivisionsParams ,Division} from "../../../../data-core/model/waste-regulation/division";
import { DivisionRequestService } from "../../../../data-core/repuest/division.service";
import { TreeNode } from "../../../../shared-module/custom-tree/custom-tree";
@Injectable()
export class DivisionTreeService extends ListAttribute {
    public dataSource = new Array<DivisionTreeNode>();
    constructor(private divisionRequestService: DivisionRequestService) {
        super();
    }

    async requestDivision() {
        const param = new GetDivisionsParams();
        param.PageIndex = 1;
        param.PageSize = this.maxSize;
        const response = await this.divisionRequestService.list(param).toPromise();
        return response.Data.Data;
    }

    convertTreeNode<DeviceStatus, ViewsModel>(input: DeviceStatus, output: ViewsModel): ViewsModel;
    convertTreeNode(){

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
                    node_.iconClass = 'howell-icon-map5';
                    node.children = node.children || new Array<TreeNode>();
                    node.children.push(node_);
                    addItems(node_, items);
                }
            }
        }
        for (const item of items) {
            if (!item.parentId) {
                const node = new TreeNode();
                node.name = item.name;
                node.checked = false;
                node.id = item.id;
                node.iconClass = 'howell-icon-earth';
                dataSource.push(node);
                addItems(node, items);
            }
        }
        return dataSource;
    }

    filterNodes(text: string) {
        const filterList = this.dataSource.filter(x => x.name.indexOf(text) > -1 && x.parentId)
            , list = new Array<DivisionTreeNode>();
        const findParent = (item: DivisionTreeNode) => {
            /**去除重复 */
            const find = this.dataSource.find(x => x.id == item.parentId && x.isLeaf);
            if (find) {
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


}

export class DivisionTreeNode {
    id: string;
    name: string;
    parentId: string;
    isLeaf: boolean;
    divisionType: number;
}


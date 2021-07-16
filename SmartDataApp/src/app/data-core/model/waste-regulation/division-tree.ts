import { Type } from "class-transformer";
/**区划树形结构 */
export class DivisionTree {
  /**根名称，默认：根区划 */
  Name: string;
  /**子区划节点(可选) */
  @Type(() => DivisionNode)
  Nodes: DivisionNode[];
}
/**区划节点 */
export class DivisionNode {
  /**区划ID */
  Id: string;
  /**区划名称 */
  Name: string;
  /**区划类型 */
  DivisionType: number;
  /**描述信息(可选) */
  Description: string;
  /**子区划节点(可选) */
  @Type(() => DivisionNode)
  Nodes: DivisionNode[];
}

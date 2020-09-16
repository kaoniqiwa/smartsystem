import { IBusinessData } from "../../../../../common/interface/IBusiness";
export class  Specification implements IBusinessData {
    /**投放点 */
    garbagePushNumber: number;
    /**垃圾桶 */
    garbageBarrelNumber: number;
    /**满溢 */
    fullPushNumber: number;
    /**乱扔行为 */
    illegalDropNumber: number;
    /**混合行为 */
    hybridPushNumber: number;
}

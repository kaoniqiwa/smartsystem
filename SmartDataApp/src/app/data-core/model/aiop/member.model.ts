import { Gender } from "./gender.model";

//垃圾房管理人员
interface Member {
  /**成员ID */
  Id: string;

  /**姓名 */
  Name: string;

  /**性别 */
  Gender?: Gender;

  /**手机号码 */
  MobileNo?: string;

  /**描述信息 */
  Note?: string;

  /**人员类型 */
  MemberType: number;

  /**微信OpenId */
  WeChatOpenId?: string;

  /**所属区划ID */
  DivisionId?: string;

  /**所属网格ID */
  GridCellId?: string;

  /**创建时间 */
  CreateTime: string | Date;

  /**更新事件 */
  UpdateTime: string | Date;
}

export { Member };

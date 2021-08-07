// 平台关联信息
interface PlatformAssociation {
  /**所属平台ID */
  PlatformId: string;

  /**平台关联ID */
  PlatformAccessId: string;

  /** 平台关联名称*/
  PlatformAccessName?: string;
}

export { PlatformAssociation };

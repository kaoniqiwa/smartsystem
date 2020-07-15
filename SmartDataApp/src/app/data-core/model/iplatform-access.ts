
    /**
     * 平台接入信息接口
     */
export interface PlatformAccess {
    platformAssociation: PlatformAssociation;
}

    /**
     *  平台接入信息
     */
export interface PlatformAssociation {
    PlatformId: string;
    /**
     * 平台关联ID
     */
    PlatformAccessId: string;
    /**
     * 平台关联名称
     */
    PlatformAccessName: string;
}
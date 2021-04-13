export interface Member {
    Id: string;//	成员ID
    Name: string;//	姓名
    Gender: number;	//性别，1-男性，2-女性
    MobileNo: string;//	手机号码
    Note: string;//	描述信息
    MemberType: number;	//人员类型
    WeChatOpenId: string;	//微信OpenId
    DivisionId: string;//	所属区划ID
    GridCellId: string;	//所属网格ID 
    CreateTime: Date | string;//创建时间
    UpdateTime: Date | string;//	更新事件
}
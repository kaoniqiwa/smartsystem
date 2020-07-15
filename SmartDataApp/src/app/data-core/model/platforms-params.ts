
    /**
     * 获取平台信息请求参数
     */
export class GetPlatformsParams {
    PageIndex: number | null;
    PageSize: number | null;
    PlatformIds: string[];
    Name: string;
    ProtocolType: string;
    State: number | null;
}
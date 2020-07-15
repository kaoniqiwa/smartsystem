
    /**
     * 
     */
export class Platform {
    Id: string;
    Name: string;
    Username: string;
    Password: string;
    /**
     * 
     */
    ProtocolType: string;
    Url: string;
    SoftwareVersion: string|number; 
    CreateTime: string;
    UpdateTime: string;
    /**
     * 
     */
    EventRecvPort: number | null;
    /**
     * 
     */
    EventRecvIPAddress: string;
    /**
     * 
     */
    EventCodes: number[];
}
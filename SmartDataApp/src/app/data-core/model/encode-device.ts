import { Resource } from "./Resource";

    /**
     * 
     */
export class EncodeDevice extends Resource {
  
    /**
     * 
     */
    TransType: number | null;
    /**
     * 
     */
    ProtocolType: string;
    /**
     * 
     */
    OnlineStatus: number | null;
    /**
     * 
     */
    Model: string;
    /**
     * 
     */
    SerialNumber: string;
    /**
     * 
     */
    Manufactory: string;
    /**
     * 
     */
    Url: string;
    Username: string;
    Password: string;
    /**
     * 能力(可选)
     */
    CapabilitySet: string[];
    /**
     *  能力名称(可选)
     */
    CapabilitySetName: string[];
    /**
     *  固件版本号(可选)
     */
    FirmwareVersion: string;
    /**
     * 
     */
    SoftwareVersion: string;
    /**
     * 
     */
    HardwareVersion: string;
    /**
     * 设备类型(可选) NVR，IPC，DVS
     */
    DeviceType: string;
}
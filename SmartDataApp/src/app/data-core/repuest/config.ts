declare interface Config {
    EntranceApiUrl: string;
    ParkingLotApiUrl: string;
    VillageApiUrl: string;
    AnnounciatorLotApiUrl: string;
    UserApiUrl: string;
    ImgApiUrl: string;
    MqttHost: string;
    MqttPort: number;
    MqttPageSize: { gismsg: number };
    StringDic: object;
    FaceUrl: string;
    Menus: object;

    ElevatorApiUrl: string;


    LinkageApiUrl: string;

    GisMapId: string;

    MediumPort: number;
}
export class EnumHelper {
    cameraType: Map<number, string>;
    cameraState: Map<number, string>;
    constructor() {
        this.cameraState = new Map();
        this.cameraType = new Map();
        this.cameraType.set(1, '枪机');
        this.cameraType.set(2, '球机');
        this.cameraType.set(3, '半球');
        this.cameraType.set(4, '一体机');

        this.cameraState.set(1, '设备故障');
        this.cameraState.set(2, '平台故障');


    }
}

export enum EventTypeEnum {
    IllegalDrop = 1,
    MixedInto,
    GarbageVolume
}
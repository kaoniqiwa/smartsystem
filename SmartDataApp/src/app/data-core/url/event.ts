import { BaseUrl, GarbageBaseUrl } from "./IUrl";

export class EventRecord extends GarbageBaseUrl{
    list() {
        return this.garbage+'Events/Records/CameraAI/List';
    }
}

export class WasteRegulationEvent extends GarbageBaseUrl{
    infoList() {
        return this.garbage+`Events/Infos/List`;
    }

    infoEventType() {
        return this.garbage+`Events/Infos/<EventType>`;
    }

    illegalDrop() {
        return this.garbage+ `Events/Records/IllegalDrop/List`;
    }

    mixedIntoList() {
        return this.garbage+`Events/Records/MixedInto/List`;
    }
}


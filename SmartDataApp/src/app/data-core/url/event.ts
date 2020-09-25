import { BaseUrl } from "./IUrl";

export class EventRecord extends BaseUrl{
    list() {
        return this.aiop+'Events/Records/CameraAI/List';
    }
}

export class WasteRegulationEvent extends BaseUrl{
    infoList() {
        return this.aiop+`Events/Infos/List`;
    }

    infoEventType() {
        return this.aiop+`Events/Infos/<EventType>`;
    }

    illegalDrop() {
        return this.aiop+ `Events/Records/IllegalDrop/List`;
    }

    mixedIntoList() {
        return this.aiop+`Events/Records/MixedInto/List`;
    }
}


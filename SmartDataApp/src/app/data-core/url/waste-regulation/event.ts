import { GarbageBaseUrl } from "../IUrl";

export class EventRecord extends GarbageBaseUrl{
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

    garbageFullList(){
        return this.garbage+'Events/Records/GarbageFull/List';
    }

    garbageDropList(){
        return this.garbage+'Events/Records/GarbageDrop/List';
    }
}
 
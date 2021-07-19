import { BaseUrl, GarbageBaseUrl } from "./IUrl";

export class EventRecordUrl extends GarbageBaseUrl {
  static list() {
    return this.garbage + "Events/Records/CameraAI/List";
  }
}

export class WasteRegulationEventUrl extends GarbageBaseUrl {
  static infoList() {
    return this.garbage + `Events/Infos/List`;
  }

  static infoEventType() {
    return this.garbage + `Events/Infos/<EventType>`;
  }

  static illegalDrop() {
    return this.garbage + `Events/Records/IllegalDrop/List`;
  }

  static mixedIntoList() {
    return this.garbage + `Events/Records/MixedInto/List`;
  }
}

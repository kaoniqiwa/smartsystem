
export class EventRecord {
    list() {
        return 'Events/Records/CameraAI';
    }
}

export class WasteRegulationEvent {
    infoList() {
        return `Events/Infos/List`;
    }

    infoEventType() {
        return `Events/Infos/<EventType>`;
    }

    illegalDrop() {
        return `Events/Records/IllegalDrop/List`;
    }

    mixedIntoList() {
        return `Events/Records/MixedInto/List`;
    }
}


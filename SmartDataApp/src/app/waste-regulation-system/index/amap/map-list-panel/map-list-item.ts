export class MapListItem<T> {
    constructor(id: string, name: string, type: MapListItemType, data: T) {
        this.Id = id;
        this.Name = name;
        this.type = type;
        this.Data = data;
    }
    Id: string;
    Name: string;
    type: MapListItemType;
    Data: T;
}

export enum MapListItemType {
    Parent,
    Division,
    GarbageStation
}

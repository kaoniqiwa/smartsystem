export class AIOPGisMapUrl {
  static create(): string {
    throw new Error("Method not implemented.");
  }
  static edit(id: string): string {
    return `Maps/${id}`;
  }
  static del(id: string): string {
    return `Maps/${id}`;
  }
  static get(id: string): string {
    return `Maps/${id}`;
  }
  static list(...param: string[]): string {
    throw new Error("Method not implemented.");
  }
}

export class AIOPGisMapElementUrl {
  static create(mapId: string): string {
    return `Maps/${mapId}/Elements`;
  }
  static edit(mapId: string, eleId: string): string {
    return `Maps/${mapId}/Elements/${eleId}`;
  }
  static del(mapId: string, eleId: string): string {
    return `Maps/${mapId}/Elements/${eleId}`;
  }
  static get(mapId: string, eleId: string): string {
    return `Maps/${mapId}/Elements/${eleId}`;
  }
  static list(...param: string[]): string {
    return ``;
  }
}

export class AIOPGisMapElementResourceUrl {
  static create(mapId: string, eleId: string, sourceId: string): string {
    return `Maps/${mapId}/Elements/${eleId}/Resources/${sourceId}`;
  }
  static edit(): string {
    return ``;
  }
  static del(mapId: string, eleId: string, sourceId: string): string {
    return `Maps/${mapId}/Elements/${eleId}/Resources/${sourceId}`;
  }
  static get(mapId: string, eleId: string, sourceId: string): string {
    return `Maps/${mapId}/Elements/${eleId}/Resources/${sourceId}`;
  }
  static list(mapId: string, eleId: string): string {
    return `Maps/${mapId}/Elements/${eleId}/Resources`;
  }
}

import { BaseUrl } from "../IUrl";

export class AIOPRegionUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "Regions";
  }
  static edit(id: string): string {
    return this.aiop + `Regions/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `Regions/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `Regions/${id}`;
  }
  static list(): string {
    return this.aiop + "Regions/List";
  }
}

export class AIOPRegionsResourcesUrl extends BaseUrl {
  static batch(id: string): string {
    return this.aiop + `Regions/${id}/Resources`;
  }

  static create(regionId: string, resourceId: string): string {
    return this.aiop + `Regions/${regionId}/Resources/${resourceId}`;
  }

  static del(regionId: string, resourceId: string): string {
    return this.aiop + `Regions/${regionId}/Resources/${resourceId}`;
  }
  static get(regionId: string, resourceId: string): string {
    return this.aiop + `Regions/${regionId}/Resources/${resourceId}`;
  }
}

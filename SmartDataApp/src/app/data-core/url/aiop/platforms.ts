import { BaseUrl } from "../IUrl";

export class AIOPPlatformUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "Platforms";
  }
  static edit(id: string): string {
    return this.aiop + `Platforms/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `Platforms/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `Platforms/${id}`;
  }
  static list(): string {
    return this.aiop + "Platforms/List";
  }
  static sync(id: string): string {
    return this.aiop + `Platforms/${id}/Sync`;
  }

  static protocols() {
    return this.aiop + `Platforms/Protocols`;
  }
}

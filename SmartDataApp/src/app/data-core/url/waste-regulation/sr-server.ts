import { GarbageBaseUrl } from "../IUrl";

export class SRServiceUrl extends GarbageBaseUrl {
  static create(): string {
    return this.garbage + "SRServers";
  }
  static edit(id: string): string {
    return this.garbage + `SRServers/${id}`;
  }
  static del(id: string): string {
    return this.garbage + `SRServers/${id}`;
  }
  static get(id: string): string {
    return this.garbage + `SRServers/${id}`;
  }
  static list(): string {
    return this.garbage + "SRServers";
  }
  static sync(id: string): string {
    return this.garbage + `SRServers/${id}/Sync`;
  }

  static preview() {
    return this.garbage + `SRServers/PreviewUrls`;
  }

  static vod() {
    return this.garbage + `SRServers/VodUrls`;
  }
}

import { BaseUrl } from "../IUrl";

export class AIOPSRServiceUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "SRServers";
  }
  static edit(id: string): string {
    return this.aiop + `SRServers/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `SRServers/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `SRServers/${id}`;
  }
  static list(): string {
    return this.aiop + "SRServers";
  }
  static sync(id: string): string {
    return this.aiop + `SRServers/${id}/Sync`;
  }

  static preview() {
    return this.aiop + `SRServers/PreviewUrls`;
  }

  static vod() {
    return this.aiop + `SRServers/VodUrls`;
  }
}

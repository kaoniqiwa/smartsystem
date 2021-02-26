import { IUrl, GarbageBaseUrl } from "../IUrl";

export class SRService extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.aiop + 'SRServers';
    }
    edit(id: string): string {
        return this.aiop + `SRServers/${id}`;
    }
    del(id: string): string {
        return this.aiop + `SRServers/${id}`;
    }
    get(id: string): string {
        return this.aiop + `SRServers/${id}`;
    }
    list(): string {
        return this.aiop + 'SRServers';
    }
    sync(id: string): string {
        return this.aiop + `SRServers/${id}/Sync`;
    }

    preview() {
        return this.aiop + `SRServers/PreviewUrls`; 
    }

    vod() {
        return this.aiop + `SRServers/VodUrls`;
    }
}
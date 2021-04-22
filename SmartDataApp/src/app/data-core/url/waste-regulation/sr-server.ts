import { IUrl, GarbageBaseUrl } from "../IUrl";

export class SRService extends GarbageBaseUrl implements IUrl {
    create(): string {
        return this.garbage + 'SRServers';
    }
    edit(id: string): string {
        return this.garbage + `SRServers/${id}`;
    }
    del(id: string): string {
        return this.garbage + `SRServers/${id}`;
    }
    get(id: string): string {
        return this.garbage + `SRServers/${id}`;
    }
    list(): string {
        return this.garbage + 'SRServers';
    }
    sync(id: string): string {
        return this.garbage + `SRServers/${id}/Sync`;
    }

    preview() {
        return this.garbage + `SRServers/PreviewUrls`; 
    }

    vod() {
        return this.garbage + `SRServers/VodUrls`;
    }
}
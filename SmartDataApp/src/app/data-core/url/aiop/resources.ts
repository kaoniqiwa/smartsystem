import { BaseUrl } from "../IUrl";

export class AIOPResourceUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "Resources";
  }
  static edit(id: string): string {
    return this.aiop + `Resources/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `Resources/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `Resources/${id}`;
  }
  static list(): string {
    return this.aiop + "Resources/List";
  }
}

export class AIOPMediumPictureUrl extends BaseUrl {
  static add() {
    return this.aiop + `Medium/Pictures`;
  }

  static binary() {
    return this.aiop + "Medium/Pictures/Binary";
  }

  static getData(id: string) {
    return this.aiop + `Medium/Pictures/${id}/Data`;
  }

  static getJPG(id: string) {
    return this.aiop + `Medium/Pictures/${id}.jpg`;
  }
}

export class AIOPResourceEncodeDeviceUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "Resources/EncodeDevices";
  }
  static edit(devId: string): string {
    return this.aiop + `Resources/EncodeDevices/${devId}`;
  }
  static del(devId: string): string {
    return this.aiop + `Resources/EncodeDevices/${devId}`;
  }
  static get(devId: string): string {
    return this.aiop + `Resources/EncodeDevices/${devId}`;
  }
  static list(): string {
    return this.aiop + "Resources/EncodeDevices/List";
  }

  static protocol() {
    return this.aiop + "Resources/EncodeDevices/Protocols";
  }
}

export class AIOPResourceCameraUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "Resources/Cameras";
  }
  static edit(id: string): string {
    return this.aiop + `Resources/Cameras/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `Resources/Cameras/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `Resources/Cameras/${id}`;
  }
  static list(): string {
    return this.aiop + "Resources/Cameras/List";
  }
}

export class AIOPResourceCameraAIModelUrl extends BaseUrl {
  static create(cameraId: string, modelId: string): string {
    return this.aiop + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
  }
  static edit(cameraId: string, modelId: string): string {
    return ``;
  }
  static del(cameraId: string, modelId: string): string {
    return this.aiop + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
  }
  static get(cameraId: string, modelId: string): string {
    return this.aiop + `Resources/Cameras/${cameraId}/AIModels/${modelId}`;
  }
  static list(cameraId: string): string {
    return this.aiop + `Resources/Cameras/${cameraId}/AIModels`;
  }
  static copy(cameraId: string) {
    return this.aiop + `Resources/Cameras/${cameraId}/AIModels/CopyTo`;
  }
}

export class AIOPLabelUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "Resources/Labels";
  }
  static edit(id: string): string {
    return this.aiop + `Resources/Labels/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `Resources/Labels/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `Resources/Labels/${id}`;
  }
  static list(): string {
    return this.aiop + "Resources/Labels/List";
  }
}

export class AIOPResourceLabelUrl extends BaseUrl {
  static create(sourceId: string, labelId: string): string {
    return this.aiop + `Resources/${sourceId}/Labels/${labelId}`;
  }
  static edit(id: string): string {
    return ``;
  }
  static del(sourceId: string, labelId: string): string {
    return this.aiop + `Resources/${sourceId}/Labels/${labelId}`;
  }
  static get(sourceId: string, labelId: string): string {
    return this.aiop + `Resources/${sourceId}/Labels/${labelId}`;
  }
  static list(id: string): string {
    return this.aiop + `Resources/${id}/Labels`;
  }
}

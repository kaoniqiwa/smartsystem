import { GarbageBaseUrl } from "../IUrl";

export class GarbageStationsUrl extends GarbageBaseUrl {
  garbagestations = "garbage_management/";
  static create(): string {
    return this.garbage + "GarbageStations";
  }
  static edit(id: string): string {
    return this.garbage + `GarbageStations/${id}`;
  }
  static del(id: string): string {
    return this.garbage + `GarbageStations/${id}`;
  }
  static get(id: string): string {
    return this.garbage + `GarbageStations/${id}`;
  }
  static list(): string {
    return this.garbage + `GarbageStations/List`;
  }

  static volumesHistory(id: string): string {
    return this.garbage + `GarbageStations/${id}/Volumes/History/List`;
  }

  static eventNumbersHistory(id: string): string {
    return this.garbage + `GarbageStations/${id}/EventNumbers/History/List`;
  }

  static statisticNumber(id: string): string {
    return this.garbage + `GarbageStations/${id}/Statistic/Number`;
  }

  static statisticNumberList(): string {
    return this.garbage + `GarbageStations/Statistic/Number/List`;
  }

  static manualCapture(id: string) {
    return this.garbage + `GarbageStations/${id}/ManualCapture`;
  }

  static cameraFile(
    stationId: string,
    cameraId: string,
    beginTime: string,
    endTime: string
  ) {
    return (
      this.garbage +
      `GarbageStations/${stationId}/Cameras/${cameraId}/Files?BeginTime=${beginTime}&EndTime=${endTime}`
    );
  }

  static statisticNumberHistoryList(): string {
    return this.garbage + `GarbageStations/Statistic/Number/History/List`;
  }

  static statisticGarbageCountHistoryList() {
    return this.garbage + "GarbageStations/Statistic/GarbageCount/History/List";
  }
}

export class CameraUrl extends GarbageBaseUrl {
  static create(stationId: string): string {
    return this.garbage + `GarbageStations/${stationId}/Cameras`;
  }
  static edit(stationId: string, cameraId: string): string {
    return this.garbage + `GarbageStations/${stationId}/Cameras/${cameraId}`;
  }
  static del(stationId: string, cameraId: string): string {
    return this.garbage + `GarbageStations/${stationId}/Cameras/${cameraId}`;
  }
  static get(stationId: string, cameraId: string): string {
    return this.garbage + `GarbageStations/${stationId}/Cameras/${cameraId}`;
  }
  static list(): string {
    return this.garbage + `GarbageStations/Cameras/List`;
  }
}

export class CameraTrashCansUrl extends GarbageBaseUrl {
  static create(stationId: string, cameraId: string): string {
    return (
      this.garbage +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`
    );
  }
  static edit(
    stationId: string,
    cameraId: string,
    trashCansId: string
  ): string {
    return (
      this.garbage +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`
    );
  }
  static del(stationId: string, cameraId: string, trashCansId: string): string {
    return (
      this.garbage +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`
    );
  }
  static get(stationId: string, cameraId: string, trashCansId: string): string {
    return (
      this.garbage +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans/${trashCansId}`
    );
  }
  static list(stationId: string, cameraId: string): string {
    return (
      this.garbage +
      `GarbageStations/${stationId}/Cameras/${cameraId}/TrashCans`
    );
  }
}

export class GarbageStationTrashCansUrl extends GarbageBaseUrl {
  static create(stationId: string): string {
    return this.garbage + `GarbageStations/${stationId}/TrashCans`;
  }
  static edit(stationId: string, trashCansId: string): string {
    return (
      this.garbage + `GarbageStations/${stationId}/TrashCans/${trashCansId}`
    );
  }
  static del(stationId: string, trashCansId: string): string {
    return (
      this.garbage + `GarbageStations/${stationId}/TrashCans/${trashCansId}`
    );
  }
  static get(stationId: string, trashCansId: string): string {
    return (
      this.garbage + `GarbageStations/${stationId}/TrashCans/${trashCansId}`
    );
  }
  static postList(): string {
    return this.garbage + `GarbageStations/TrashCans/List`;
  }
  static list(stationId: string): string {
    return this.garbage + `GarbageStations/${stationId}/TrashCans`;
  }
}

export class GarbageStationTypeUrl extends GarbageBaseUrl {
  static create(): string {
    return this.garbage + "GarbageStations/Types";
  }
  static edit(id: string): string {
    return this.garbage + `GarbageStations/Types/${id}`;
  }
  static del(id: string): string {
    return this.garbage + `GarbageStations/Types/${id}`;
  }
  static get(id: string): string {
    return this.garbage + `GarbageStations/Types/${id}`;
  }
  static list() {
    return this.garbage + "GarbageStations/Types";
  }
}

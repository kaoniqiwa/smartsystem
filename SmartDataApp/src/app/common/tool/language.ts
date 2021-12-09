import { assert } from "console";
import {
  CameraState,
  CameraType,
  DivisionType,
  EventType,
  ResourceType,
  StationState,
  TimeUnit,
} from "../../data-core/model/enum";

import { Flags } from "../../data-core/model/flags";

import language from "./language.json";

export class Language {
  static StationState(state: StationState) {
    switch (state) {
      case StationState.Full:
        return Language.json.full;
      case StationState.Error:
        return Language.json.error;
      default:
        return Language.json.normal;
    }
  }

  static TimeUnit(unit: TimeUnit) {
    switch (unit) {
      case TimeUnit.Hour:
        return Language.json.Date.day + Language.json.report;
      case TimeUnit.Day:
        return Language.json.Date.month + Language.json.report;
      default:
        return "";
    }
  }

  static StationStateFlags(flags: Flags<StationState>) {
    if (flags.contains(StationState.Error)) {
      return Language.StationState(StationState.Error);
    } else if (flags.contains(StationState.Full)) {
      return Language.StationState(StationState.Full);
    } else {
      return Language.StationState(0);
    }
  }

  static CameraType(type: CameraType) {
    switch (type) {
      case CameraType.Gun:
        return Language.json.CameraType.Gun;
      case CameraType.Ball:
        return Language.json.CameraType.Ball;
      case CameraType.HalfBall:
        return Language.json.CameraType.HalfBall;
      case CameraType.AIO:
        return Language.json.CameraType.AIO;
      default:
        return "";
    }
  }

  static EventType(type: EventType) {
    switch (type) {
      case EventType.IllegalDrop:
        return Language.json.EventType.IllegalDrop;
      case EventType.MixedInto:
        return Language.json.EventType.MixedInto;
      case EventType.GarbageVolume:
        return Language.json.EventType.GarbageVolume;
      case EventType.GarbageFull:
        return Language.json.EventType.GarbageFull;
      case EventType.GarbageDrop:
        return Language.json.EventType.GarbageDrop;
      case EventType.GarbageDropTimeout:
        return Language.json.EventType.GarbageDropTimeout;
      case EventType.GarbageDropHandle:
        return Language.json.EventType.GarbageDropHandle;
      default:
        return "";
    }
  }

  static GarbageDropEventType(type: EventType, isTimeout?: boolean) {
    switch (type) {
      case EventType.GarbageDrop:
        return Language.json.did + Language.json.handle;
      case EventType.GarbageDropTimeout:
        return (
          Language.json.timeout + Language.json.wait + Language.json.handle
        );

      case EventType.GarbageDropHandle:
        if (isTimeout) {
          return Language.json.timeout + Language.json.handle;
        } else {
          return Language.json.did + Language.json.handle;
        }
      case EventType.GarbageDropTimeoutHandle:
        return Language.json.timeout + Language.json.handle;
      default:
        return "";
    }
  }

  static GarbageDropEventTypeClassName(type: EventType, isTimeout?: boolean) {
    switch (type) {
      case EventType.GarbageDrop:
        return "orange-text";
      case EventType.GarbageDropTimeout:
        return "powder-red-text";
      case EventType.GarbageDropHandle:
        if (isTimeout) {
          return "sky-blue-text2";
        } else {
          return "green-text";
        }

      default:
        return "";
    }
  }

  static CameraState(state: CameraState) {
    switch (state) {
      case CameraState.DeviceError:
        return Language.json.device + Language.json.fault;
      case CameraState.PlatformError:
        return Language.json.platform + Language.json.fault;
      default:
        return "";
    }
  }

  static ResourceType(type: ResourceType) {
    switch (type) {
      case ResourceType.Camera:
        return Language.json.monitor + Language.json.point;
      case ResourceType.EncodeDevice:
        return Language.json.encode + Language.json.device;

      case ResourceType.IoTSensor:
        return Language.json.IoT + Language.json.sensor;
      case ResourceType.GarbageStation:
        return Language.json.garbage + Language.json.room;
      default:
        return "";
    }
  }
  static DivisionType(type: DivisionType) {
    switch (type) {
      case DivisionType.Province:
        return Language.json.DivisionType.Province;
      case DivisionType.City:
        return Language.json.DivisionType.City;
      case DivisionType.County:
        return Language.json.DivisionType.County;
      case DivisionType.Committees:
        return Language.json.DivisionType.Committees;
    }
  }

  static Time(time: Date | number) {
    let result = "";
    if (typeof time === "number") {
      const hours = parseInt((time / 60).toString());
      const minutes = parseInt((Math.ceil(time) % 60).toString());

      result = hours ? hours + Language.json.Time.hour : "";
      result += minutes ? minutes + Language.json.Time.minute : "";
    } else {
      if (time.getHours() > 0) {
        result = `${time.getHours()}${Language.json.Time.hour}${result}`;
      }
      let minutes = time.getMinutes();
      if (time.getSeconds() > 0) {
        minutes++;
      }
      result = `${result}${minutes}${Language.json.Time.minute}`;
    }

    return result;
  }

  static json = language;
}

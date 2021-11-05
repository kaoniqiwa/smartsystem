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

export class Language {
  static StationState(state: StationState) {
    switch (state) {
      case StationState.Full:
        return "满溢";
      case StationState.Error:
        return "异常";
      default:
        return "正常";
    }
  }

  static TimeUnit(unit: TimeUnit) {
    switch (unit) {
      case TimeUnit.Hour:
        return "日报表";
      case TimeUnit.Day:
        return "月报表";
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
        return "枪机";
      case CameraType.Ball:
        return "球机";
      case CameraType.HalfBall:
        return "半球";
      case CameraType.AIO:
        return "一体机";
      default:
        return "";
    }
  }

  static EventType(type: EventType) {
    switch (type) {
      case EventType.IllegalDrop:
        return "乱丢垃圾";
      case EventType.MixedInto:
        return "混合投放";
      case EventType.GarbageVolume:
        return "垃圾容量";
      case EventType.GarbageFull:
        return "垃圾满溢";
      case EventType.GarbageDrop:
        return "小包垃圾待处置";
      case EventType.GarbageDropTimeout:
        return "小包垃圾超时待处置";
      case EventType.GarbageDropHandle:
        return "小包垃圾已处置";
      default:
        return "";
    }
  }

  static GarbageDropEventType(type: EventType) {
    switch (type) {
      case EventType.GarbageDrop:
        return "待处置";
      case EventType.GarbageDropTimeout:
        return "超时处置";
      case EventType.GarbageDropHandle:
        return "已处置";
      default:
        return "";
    }
  }

  static GarbageDropEventTypeClassName(type: EventType) {
    switch (type) {
      case EventType.GarbageDrop:
        return "orange-text";
      case EventType.GarbageDropTimeout:
        return "powder-red-text";
      case EventType.GarbageDropHandle:
        return "green-text";
      default:
        return "";
    }
  }

  static CameraState(state: CameraState) {
    switch (state) {
      case CameraState.DeviceError:
        return "设备故障";
      case CameraState.PlatformError:
        return "平台故障";

      default:
        return "";
    }
  }

  static ResourceType(type: ResourceType) {
    switch (type) {
      case ResourceType.Camera:
        return "监控点";
      case ResourceType.EncodeDevice:
        return "编码设备";
      case ResourceType.IoTSensor:
        return "物联网传感器";
      case ResourceType.GarbageStation:
        return "垃圾房";

      default:
        return "";
    }
  }
  static DivisionType(type: DivisionType) {
    switch (type) {
      case DivisionType.Province:
        return "省";
      case DivisionType.City:
        return "行政区划";
      case DivisionType.County:
        return "街道";
      case DivisionType.Committees:
        return "居委会";
    }
  }

  static Time(time: Date | number) {
    let result = "";
    if (typeof time === "number") {
      const hours = parseInt((time / 60).toString());
      const minutes = parseInt((Math.ceil(time) % 60).toString());

      result = hours ? hours + "小时" : "";
      result += minutes ? minutes + "分钟" : "";
    } else {
      if (time.getHours() > 0) {
        result = `${time.getHours()}小时${result}`;
      }
      let minutes = time.getMinutes();
      if (time.getSeconds() > 0) {
        minutes++;
      }
      result = `${result}${minutes}分钟`;
    }

    return result;
  }
}

import { StationState } from "src/app/data-core/model/waste-regulation/garbage-station";
import { Flags } from "./flags";

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

  static StationStateFlags(flags: Flags<StationState>) {
    if (flags.contains(StationState.Error)) {
      return Language.StationState(StationState.Error);
    } else if (flags.contains(StationState.Full)) {
      return Language.StationState(StationState.Full);
    } else {
      return Language.StationState(0);
    }
  }
}

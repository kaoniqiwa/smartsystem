import { EventEmitter } from "@angular/core";

export interface IEventTrigger<T> {
  /** 触发器 */
  EventTrigger: EventEmitter<void>;
  /** 执行方法 */
  OnTriggerEvent: EventEmitter<T>;
}

import { Point } from "../point";

/** 事件规则 */
export class EventRule {
  /**	String	规则ID	M */
  RuleId!: string;
  /**	Int32	触发类型(保留)	O */
  TriggerType?: number;
  /**	Int32	方向(保留)	O */
  Direction?: number;
  /**	Point[]	规则的归一化多边形	O */
  Polygon?: Point[];
  /**	String[]	触发规则的对象ID，可以在EventDataObject的Objects中找到	O */
  ObjectIds?: string[];
}

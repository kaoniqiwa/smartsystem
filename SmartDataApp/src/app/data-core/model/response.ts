export interface HowellResponse<T> {
  FaultCode: number;
  FaultReason: string;
  InnerException: ExceptionData;
  Data: T;
}

export interface ExceptionData {
  Message: string;
  ExceptionType: string;
  InnerException: ExceptionData;
}

export interface HttpResponse<T> {
  data: HowellResponse<T>;
  status: number;
  statusText: string;
}

export class Fault {
  /// <signature>
  /// <summary>Fault</summary>
  /// <field name='FaultCode' type='Int32'>错误码间附录3.3 M</field>
  /// <field name='FaultReason' type='String '>错误原因 M</field>
  /// <field name='Exception' type='ExceptionData'>异常信息 O</field>
  /// <field name='Id' type='String'>在创建对象时服务器返回的唯一标示符 O</field>
  /// </signature>
  FaultCode: number;
  FaultReason: string;
  Exception: ExceptionData;
  Id: string;
}

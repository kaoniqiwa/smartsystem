// export interface IUrl {
//   create(...param: string[]): string;
//   edit(...param: string[]): string;
//   del(...param: string[]): string;
//   get(...param: string[]): string;
//   list(...param: string[]): string;
// }

export class BaseUrl {
  static aiop = "/api/howell/ver10/aiop_service/";
  static user = "/howell/ver10/data_service/user_system/";
}
export class GarbageBaseUrl {
  static garbage = "/api/howell/ver10/aiop_service/garbage_management/";
  static user = "/howell/ver10/data_service/user_system/";
  static sms = "/howell/ver10/data_service/short_message/sms/";
}

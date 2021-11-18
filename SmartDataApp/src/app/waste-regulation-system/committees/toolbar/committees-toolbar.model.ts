export enum NotifyStatus {
  normal = "normal",
  remind = "remind",
  warning = "warning",
}

export class CommitteesToolbarNotifyViewModel {
  status: NotifyStatus = NotifyStatus.normal;
  text: string = "";
  onClick: () => void;
}

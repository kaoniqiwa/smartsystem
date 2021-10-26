import { RecordRankViewModel } from "../record-rank/record-rank.model";

export interface ICommitteesConverter<T, R> {
  Convert(input: T, ...args: any[]): R;
}

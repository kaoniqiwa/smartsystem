export interface ICommitteesService<T> {
  load(...params: any[]): Promise<T>;
}

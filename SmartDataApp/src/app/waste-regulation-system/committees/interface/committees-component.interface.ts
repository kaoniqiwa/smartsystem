import { ICommitteesConverter } from "./committees-converter.interface";

export interface ICommitteesComponent<IModel, IViewModel> {
  Converter: ICommitteesConverter<IModel, IViewModel>;
  onLoaded(): void;
}

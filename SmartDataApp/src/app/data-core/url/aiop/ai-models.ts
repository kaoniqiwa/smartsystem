import { BaseUrl } from "../IUrl";
export class AIOPAIModelUrl extends BaseUrl {
  static create(): string {
    return this.aiop + "AIModels";
  }
  static edit(id: string): string {
    return this.aiop + `AIModels/${id}`;
  }
  static del(id: string): string {
    return this.aiop + `AIModels/${id}`;
  }
  static get(id: string): string {
    return this.aiop + `AIModels/${id}`;
  }
  static list(): string {
    return this.aiop + `AIModels/List`;
  }

  static parse() {
    return this.aiop + `AIModels/Parse`;
  }
}

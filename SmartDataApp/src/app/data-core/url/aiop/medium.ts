export class AIOPMediumPictureUrl {
  add() {
    return `Medium/Pictures`;
  }

  getData(id: string) {
    return `Medium/Pictures/${id}/Data`;
  }

  getJPG(id: string) {
    return `Medium/Pictures/${id}.jpg`;
  }
}

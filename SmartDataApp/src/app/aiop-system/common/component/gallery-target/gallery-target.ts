import { Point } from "../../../../data-core/model/Point";

export class GalleryTarget {
    enlargeId: string;
    enlargeConfidence: string;
    enlargeImage: string;
    polygon: Point[];
    constructor(id: string,
        confidence: string,
        imgSrc: string,
        polygon: Point[]) {
        this.enlargeId = id;
        this.enlargeConfidence = confidence;
        this.enlargeImage = imgSrc;
        this.polygon = polygon;
    }
}
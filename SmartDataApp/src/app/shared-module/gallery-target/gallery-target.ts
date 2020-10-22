import { Point } from "../../data-core/model/Point";

export class GalleryTarget {
    enlargeId: string;
    enlargeConfidence: string;
    enlargeImage: string;
    polygon: Point[];
    id:string;
    imgPrev:boolean;
    imgNext:boolean;
    constructor(enlargeId: string,
        confidence: string,
        imgSrc: string,
        polygon: Point[],
        id:string) {
        this.enlargeId = enlargeId;
        this.enlargeConfidence = confidence;
        this.enlargeImage = imgSrc;
        this.id=id;
        this.polygon = polygon;
        this.imgNext=true;
        this.imgPrev=true;
    }
}

export enum ImageEventEnum{
    prev,
    next,
    none
}
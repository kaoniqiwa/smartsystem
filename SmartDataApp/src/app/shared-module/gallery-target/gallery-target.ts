import { Point } from "../../data-core/model/Point";
import { EventDataObject } from "../../data-core/model/waste-regulation/event-data-object";

export class GalleryTarget {
    enlargeId: string;
    enlargeConfidence: string;
    enlargeImage: string;
    polygon: EventDataObject[];
    id:string;
    downloadImgName:string;
    imgPrev:boolean;
    imgNext:boolean;
    constructor(enlargeId: string,
        confidence: string,
        imgSrc: string,
        polygon: EventDataObject[],
        id:string,
        downloadImgName:string) {
        this.enlargeId = enlargeId;
        this.enlargeConfidence = confidence;
        this.enlargeImage = imgSrc;
        this.id=id;
        this.polygon = polygon;
        this.imgNext=true;
        this.imgPrev=true;
        this.downloadImgName=downloadImgName;
    }
}

export enum ImageEventEnum{
    prev,
    next,
    none
}
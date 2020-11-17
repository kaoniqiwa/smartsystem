import { DatePipe } from "@angular/common";
import { IllegalDropEventRecord } from "../../../data-core/model/waste-regulation/illegal-drop-event-record";
import { MediumPicture } from "../../../data-core/url/aiop/resources";
import { GalleryTarget, ImageEventEnum } from "../../gallery-target/gallery-target";

export class GalleryTargetView {
    galleryTarget: GalleryTarget;
    galleryTargetBox = false;

    constructor(public datePipe: DatePipe) {

    }

    neighborEventFn: (id: string, e: ImageEventEnum) => {
        prev: boolean,
        next: boolean,
        item: IllegalDropEventRecord
    };

    showImagePage(id: string, e: ImageEventEnum) {
        const event = this.neighborEventFn(id, e);
        return {
            prev: {
                show: event.prev,
                item: event.item
            },
            next: {
                show: event.next,
                item: event.item
            }
        }
    }

    galleryTargetPageFn = (e: ImageEventEnum, id: string) => {
        const page = this.showImagePage(id, e);
        if (e == ImageEventEnum.next && page.next.item) {
            const enlargeImage = new MediumPicture().getJPG(page.next.item.ImageUrl);
            this.galleryTarget = new GalleryTarget(page.next.item.Data.Objects[0].Id
                , page.next.item.Data.Objects[0].Confidence + '', enlargeImage, page.next.item.Data.Objects
                , page.next.item.EventId,this.toDownLoadImgName(page.next.item));

        }
        else if (e == ImageEventEnum.prev && page.prev.item) {
            const enlargeImage = new MediumPicture().getJPG(page.prev.item.ImageUrl);
            this.galleryTarget = new GalleryTarget(page.prev.item.Data.Objects[0].Id
                , page.prev.item.Data.Objects[0].Confidence + '', enlargeImage, page.prev.item.Data.Objects
                , page.prev.item.EventId,this.toDownLoadImgName(page.prev.item));

        }

        this.galleryTarget.imgNext = page.next.show;
        this.galleryTarget.imgPrev = page.prev.show;
    }


    initGalleryTarget(event: IllegalDropEventRecord) {
        const enlargeImage = new MediumPicture().getJPG(event.ImageUrl)
            , page = this.showImagePage(event.EventId, ImageEventEnum.none);
        this.galleryTarget = new GalleryTarget(event.Data.Objects[0].Id
            , event.Data.Objects[0].Confidence + '', enlargeImage, event.Data.Objects
            , event.EventId,this.toDownLoadImgName(event));
        this.galleryTarget.imgNext = page.next.show;
        this.galleryTarget.imgPrev = page.prev.show;
    }


    toDownLoadImgName(item: IllegalDropEventRecord) {
        var name = '';
        name += item.ResourceName + ' ';
        name += this.datePipe.transform(item.EventTime,'yyyy年MM月dd日 hh点mm分')+ ' '; 
        for (const x of item.Data.Objects)
            for (const a of x.Polygon) {
                name += a.X + ',' + a.Y + ' ';
            }
        return name;
    }
    enlargeImageSize = {
        width: 0,
        height: 0
    }
}
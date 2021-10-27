export interface IGalleryRollPageConfig {
  closeButtonVisibility?: boolean;
  refreshButtonVisibility?: boolean;
  intervalButtonVisibility?: boolean;
  fullscreenButtonVisibility?: boolean;
  titleVisibility?: boolean;
  statusBarVisibility?: boolean;
  videoControlPlayVisibility?: boolean;
  videoControlFullscreenVisibility?: boolean;
}
export class GalleryRollPageConfig implements IGalleryRollPageConfig {
  closeButtonVisibility?: boolean = true;
  refreshButtonVisibility?: boolean = true;
  intervalButtonVisibility?: boolean = true;
  fullscreenButtonVisibility?: boolean = true;
  titleVisibility?: boolean = true;
  statusBarVisibility?: boolean = true;
  videoControlPlayVisibility?: boolean = true;
  videoControlFullscreenVisibility?: boolean = true;
}

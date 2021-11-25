export interface IGalleryRollPageConfig {
  closeButtonVisibility?: boolean;
  refreshButtonVisibility?: boolean;
  autoRefreshVisibility?: boolean;
  intervalButtonVisibility?: boolean;
  fullscreenButtonVisibility?: boolean;
  titleVisibility?: boolean;
  statusBarVisibility?: boolean;
  videoControlPlayVisibility?: boolean;
  videoControlFullscreenVisibility?: boolean;
  playVideoToBig?: boolean;
  autoGetPicture?: boolean;
  playbackButtonVisibility?: boolean;
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
  playVideoToBig?: boolean = false;
  autoRefreshVisibility?: boolean = true;
  autoGetPicture?: boolean = true;
  playbackButtonVisibility?: boolean = false;
}

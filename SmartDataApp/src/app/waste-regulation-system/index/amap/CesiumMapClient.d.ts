declare namespace CesiumMap {

    interface ExtendWindow {
        Register: (element: HTMLElement, boxId: string, css_urls: string[], events: any) => void;
        Remove: (id: string) => void;
    }
    interface AlarmPoint {

        /// <summary>添加报警点位</summary>
        /// <param name="lon" type="Position">位置信息</param>
        /// <param name="color" type="EventColor">报警等级</param>
        /// <returns type="string">报警点位Id</returns>
        Add: (position: CesiumDataController.Position, color: CesiumDataController.AlarmColor, callback: any) => string
        /// <summary>删除报警点位</summary>
        /// <param name="alarmId" type="string">报警点位Id</param>    
        Remove: (alarmId, isInWindow?: boolean) => string;
        /// <summary>聚焦报警点位</summary>
        /// <param name="alarmId" type="string">报警点位Id</param>
        Focus: (alarmId) => string;
    }

    interface AlarmLine {
        Start: (id: string, color: CesiumDataController.AlarmColor) => boolean;
        Stop: (id: string) => boolean;
    }

    interface Alarm {
        Point: AlarmPoint;
        Line: AlarmLine;
    }

    interface Map {
        SetStyle: (style: CesiumDataController.ModelStyle) => boolean;
        SetFloorModel: (floorModel: CesiumDataController.ModelType) => boolean;
    }


    interface Viewer {
        /// <summary>移动视角</summary>
        /// <param name="position" type="Position">纬度</param>
        MoveTo: (position: CesiumDataController.Position) => void;
        SetViewMode: (mode: CesiumDataController.ViewMode) => void;
        FullScreen: () => void;
        SetDateTime: (datetime: Date) => void;
    }

    interface Overlay {
        /// <summary>创建覆盖物</summary>
        /// <param name="html" type="string">html内容</param>
        /// <param name="position" type="Position">位置信息</param>
        /// <param name="style" type="json">样式</param>
        /// <returns type="string">覆盖物Id</returns>
        Create: (html: string, position: CesiumDataController.Position, style: any, events: any) => string;
        /// <summary>删除气泡</summary>
        /// <param name="id" type="string">编号</param>
        Remove: (id: string) => string;
    }

    interface Village {
        /// <summary>选中小区</summary>
        /// <param name="villageId" type="string">小区ID</param>
        Select: (villageId: string) => string;
    }
    interface PointNameController {
        Show: (id: string, style: CesiumDataController.GuideboardStyle) => void;
        Hide: (id: string, style: CesiumDataController.GuideboardStyle) => void;
    }
    enum PointStatus{
        normal = 0,
        alarm = 1
    }
    interface PointStatusOptions {
        id: string;
        status: PointStatus;
    }
    
    interface PointVisibilityOptions {
        camera?: boolean,
        entrance?: boolean,
        annunciator?: boolean,
        sensor?: boolean,
        person?: boolean,
        vehicle?: boolean,
        missionPoint?: boolean,
        parkingLot?: boolean
    }
    interface Point {
        Name: PointNameController;

        /// <summary>创建点位信息</summary>
        /// <param name="point" type="CesiumMapClient.Point">点位信息</param>
        Create: (point: CesiumDataController.Point) => CesiumDataController.Point;

        Set: (opts: CesiumDataController.Point) => CesiumDataController.Point;

        /// <summary>设置点位状态</summary>
        /// <param name="status" type="{id:string, status:number}">点位状态</param>
        Status: (status: PointStatusOptions[]) => void;
        Remove: (pointId: string) => boolean;
        Display: (id: string, visibility: PointVisibilityOptions) => boolean;
        /// <summary>元素点位筛选</summary>
        /// <param name="filter" type="json">筛选参数 (camera, entrance, annunciator, sensor)</param>
        Filter: (filter: PointVisibilityOptions) => void;
    }


    interface EventTriggers {
        OnLoading: () => void;
        OnLoaded: () => void;
        OnBuildingClicked: (building: CesiumDataController.Building) => void;
        OnFloorClicked: (floor: CesiumDataController.Floor) => void;
        OnElementsClicked: <T extends CesiumDataController.Element>(elements: Array<T>) => void;
        OnElementsDoubleClicked: <T extends CesiumDataController.Element> (elements: Array<T>) => void;
        OnVillageClicked: (village: CesiumDataController.Village) => void;
        GetCoordinate: (lng: number, lat: number) => void;
        OnMouseMoving: (lng: number, lat: number) => void;
        OnError: (sender: any, error: any) => void;
        OnShapesDisplayed: (shapes: any[]) => void;
        OnCameraMoveEnd: () => void;
    }



    class Client {
        constructor(iframeId: string);

        ExtendWindow: ExtendWindow;
        AlarmPoint: AlarmPoint;
        Alarm: Alarm;
        Map: Map;
        Viewer: Viewer;
        Overlay: Overlay;
        Village: Village;
        Point: Point;
        DataController: CesiumDataController.Controller;

        Events: EventTriggers;
    }
}



declare class CesiumMapClient extends CesiumMap.Client {
    constructor(iframeId: string|HTMLElement);
}
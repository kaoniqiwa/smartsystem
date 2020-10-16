

var MapTools = {
    isShowCoordinate: false,

    getMapType(type) {
        if (type) {
            for (var key in this.MapType) {
                if (key.toLowerCase() == type.toLowerCase())
                    return this.MapType[key];
            }
        }
        else {
            return this.MapType.AMapOffline;
        }
    },
    Events: {
        OnElementsSelected: null,
        OnBuildingSelected: null,
        OnFloorSelected: null,
        GetCoordinate: null,
        OnMapClicked: null,
        OnMouseMoving: null,
        OnVillageClicked: null,
        OnError: null,
        OnElementsDoubleClick: null,
        OnShapesDisplayed: null,
        OnLoaded: null,
        OnLoading: null,
        OnCameraMoveEnd: null,
        OnPointDragend: null,
        OnMouseClick: null,
        OnMouseDoubleClick: null
    },
    MapType: {

    },
}
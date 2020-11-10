'use strict';

var CesiumMapClient = function (iframe) {

    var that = this;

    if (typeof (iframe) == 'string')
        iframe = document.getElementById(iframe);

    function doing(fn) {
        try {
            iframe.contentWindow.MapController.RequestRenderMode(false);
            return fn();
        } catch (ex) {
            that.Events.OnError(ex);
        }
        finally {
            setTimeout(function () {
                iframe.contentWindow.MapController.RequestRenderMode(true);
            }, 50);
        }
    }


    this.ExtendedWindow = {
        Register: function (element, boxId, css_urls, events) {
            iframe.contentWindow.MapController.ExtendedWindow.Register(element, boxId);

            if (css_urls)
                iframe.contentWindow.ExtendedWindow.LoadCss(css_urls);
            if (events)
                iframe.contentWindow.ExtendedWindow.RegisterEvents(element, events);

        },
        Remove: function (id) {
            iframe.contentWindow.ExtendedWindow.Element.removeById(id);
        }
    }


    this.AlarmPoint = {
        Add: function (position, color, callback) {
            /// <summary>添加报警点位</summary>
            /// <param name="lon" type="Position">位置信息</param>
            /// <param name="color" type="EventColor">报警等级</param>
            /// <returns type="string">报警点位Id</returns>
            return doing(function () {
                return iframe.contentWindow.MapController.Alarm.Point.Add(position, color);
            });
        },
        Remove: function (alarmId) {
            /// <summary>删除报警点位</summary>
            /// <param name="alarmId" type="string">报警点位Id</param>
            return doing(function () {
                iframe.contentWindow.MapController.Alarm.Point.Remove(alarmId);
            });
        },
        Focus: function (alarmId) {
            /// <summary>聚焦报警点位</summary>
            /// <param name="alarmId" type="string">报警点位Id</param>
            return doing(function () {
                iframe.contentWindow.MapController.Alarm.Point.Focus(alarmId);
            });
        }
    }

    this.Alarm = {
        Point: {
            Add: function (position, color, isInWindow) {
                /// <summary>添加报警点位</summary>
                /// <param name="lon" type="Position">位置信息</param>
                /// <param name="color" type="EventColor">报警等级</param>
                /// <returns type="string">报警点位Id</returns>
                return doing(function () {
                    return iframe.contentWindow.MapController.Alarm.Point.Add(position, color, isInWindow);
                });
            },
            Remove: function (alarmId, isInWindow) {
                /// <summary>删除报警点位</summary>
                /// <param name="alarmId" type="string">报警点位Id</param>
                return doing(function () {
                    iframe.contentWindow.MapController.Alarm.Point.Remove(alarmId, isInWindow);
                });
            },
            Focus: function (alarmId) {
                /// <summary>聚焦报警点位</summary>
                /// <param name="alarmId" type="string">报警点位Id</param>
                return doing(function () {
                    iframe.contentWindow.MapController.Alarm.Point.Focus(alarmId);
                });
            }
        },
        Line: {
            Start: function (id, color) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Alarm.Line.Start(id, color);
                });
            },
            Stop: function (id) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Alarm.Line.Stop(id);
                });
            }
        }
    }

    this.Map = {
        SetStyle: function (style) {
            return doing(function () {
                return iframe.contentWindow.MapController.ImageryLayer.SetStyle(style);
            });
        },
        SetFloorModel: function (floorModel) {
            return doing(function () {
                return iframe.contentWindow.MapController.SetFloorModel(floorModel);
            });
        }
    }





    this.CoordinateLabel = {
        Show: function () {
            /// <summary>显示坐标面板</summary>
            return doing(function () {
                iframe.contentWindow.MapController.ShowCoordinateLabel();
            });
        },
        Hide: function () {
            /// <summary>隐藏坐标面板</summary>
            return doing(function () {
                iframe.contentWindow.MapController.HideCoordinateLabel();
            });
        }
    }

    this.Viewer = {
        MoveTo: function (position) {
            /// <summary>移动视角</summary>
            /// <param name="position" type="Position">纬度</param>
            return doing(function () {
                iframe.contentWindow.MapController.MoveTo(parseFloat(position.lon), parseFloat(position.lat), parseFloat(position.height));
            });
        },
        SetViewMode: function (mode) {
            return doing(function () {
                iframe.contentWindow.MapController.SetViewMode(mode);
            });
        },
        FullScreen: function () {
            return doing(function () {
                iframe.contentWindow.MapController.FullScreen();
            });
        },
        SetDateTime: function (datetime) {
            return doing(function () {
                iframe.contentWindow.MapController.SetDateTime(datetime);
            });
        }
    }
    this.Overlay = {
        Create: function (html, position, style, events) {
            /// <summary>创建覆盖物</summary>
            /// <param name="html" type="string">html内容</param>
            /// <param name="position" type="Position">位置信息</param>
            /// <param name="style" type="json">样式</param>
            /// <returns type="string">覆盖物Id</returns>
            return doing(function () {
                return iframe.contentWindow.MapController.Overlay.Create(html, position, style, events);
            });
        },
        Remove: function (id) {
            /// <summary>删除气泡</summary>
            /// <param name="id" type="string">编号</param>
            return doing(function () {
                iframe.contentWindow.MapController.Overlay.Remove(id);
            });
        }
    }

    this.Building = {
        Select: function (buildingId) {
            /// <summary>选中建筑</summary>
            /// <param name="buildingId" type="string">建筑Id</param>
            return doing(function () {
                return iframe.contentWindow.MapController.SelectBuilding(buildingId);
            });
        },
        SelectFloor: function (floorId) {
            /// <summary>选中楼层</summary>
            /// <param name="floorId" type="string">楼层Id</param>
            return doing(function () {
                return iframe.contentWindow.MapController.SelectFloor(floorId);
            });
        },
        LookFor: function (buildingId) {
            /// <summary>聚焦</summary>
            /// <param name="lat" type="float">聚焦建筑ID</param>
            return doing(function () {
                iframe.contentWindow.MapController.LookFor(buildingId);
            });
        },
        Alpha: {
            Set: function (buildingId, alpha) {
                /// <summary>设置模型透明度</summary>
                /// <param name="buildingId" type="string">建筑Id</param>
                /// <param name="alpha" type="float">透明度(0-1)</param>
                return doing(function () {
                    iframe.contentWindow.MapController.SetModelAlpha(buildingId, alpha);
                });
            },
            Restore: function (buildingId) {
                /// <summary>还原建筑透明度</summary>
                /// <param name="buildingId" type="string">建筑Id</param>
                return doing(function () {
                    var model = that.GetData(buildingId);
                    iframe.contentWindow.MapController.ResetModelAlpha(model);
                });
            }
        },
        SetPosition: function (id, position) {
            return doing(function () {
                iframe.contentWindow.MapController.Model.SetPosition(id, position);
            });
        },
        SetRadian: function (id, radian) {
            return doing(function () {
                iframe.contentWindow.MapController.Model.SetRadian(id, radian);
            });
        },
        SetScale: function (id, scale) {
            return doing(function () {
                iframe.contentWindow.MapController.Model.SetScale(id, scale);
            });
        },
        SetLight: function (id, lightColor, level) {
            return doing(function () {
                iframe.contentWindow.MapController.Model.SetLight(id, lightColor, level);
            });
        }
        // HideFloors: function () {
        //     /// <summary>隐藏楼层</summary>
        //     iframe.contentWindow.MapController.HideFloors();
        // }
    }
    this.Point = {
        Name: {
            Show: function (id, style) {
                /// <summary>显示点位名称</summary>
                iframe.contentWindow.MapController.RequestRenderMode(false);
                iframe.contentWindow.MapController.ShowPointListName(id, style);

            },
            Hide: function (id, style) {
                /// <summary>隐藏点位名称</summary>
                return doing(function () {
                    iframe.contentWindow.MapController.HidePointListName(id, style);
                });
            }
        },
        Create: function (point) {
            /// <summary>创建点位信息</summary>
            /// <param name="point" type="CesiumMapClient.Point">点位信息</param>
            return doing(function () {
                iframe.contentWindow.MapController.CreatePoint(point);
            });
        },
        Set: function (opts) {
            return doing(function () {
                iframe.contentWindow.MapController.SetPoint(opts);
            });
        },
        Status: function (status) {
            /// <summary>设置点位状态</summary>
            /// <param name="status" type="{id:string, status:number}">点位状态</param>
            return doing(function () {
                iframe.contentWindow.MapController.SetPointStatus(status)
            });
        },
        Remove: function (pointId) {
            /// <summary>删除点位信息</summary>
            /// <param name="pointId" type="string">点位Id</param>
            return doing(function () {
                iframe.contentWindow.MapController.RemovePoint(pointId);
            });
        },
        Visibility: {
            camera: true,
            entrance: true,
            annunciator: true,
            sensor: true,
            person: true,
            vehicle: true,
            missionPoint: true,
            parkingLot: true
        },
        Display: function (id, visibility) {
            return doing(function () {
                iframe.contentWindow.MapController.DisplayPoint(id, visibility);
            });
        },
        Filter: function (filter) {
            /// <summary>元素点位筛选</summary>
            /// <param name="filter" type="json">筛选参数 (camera, entrance, annunciator, sensor)</param>
            return doing(function () {
                var current = {};
                if (filter) {
                    for (var key in filter) {
                        current[key.toLowerCase()] = filter[key];
                    }
                }
                for (var key in that.Point.Visibility) {
                    if (current[key])
                        that.Point.Visibility[key] = true;
                    else
                        that.Point.Visibility[key] = false;
                }
                iframe.contentWindow.MapController.PointFilter(that.Point.Visibility);
            });
        },
        Draggable: function (draggable) {
            return doing(function () {
                return iframe.contentWindow.MapController.PointDraggable(draggable);
            });
        }

    }

    this.Village = {
        Select: function (villageId) {
            /// <summary>选中小区</summary>
            /// <param name="villageId" type="string">小区ID</param>
            return doing(function () {
                iframe.contentWindow.MapController.Village.Select(villageId);
            });
        }
    }

    this.Operation = {
        Show: function () {
            /// <summary>显示操作栏</summary>
            return doing(function () {
                iframe.contentWindow.MapController.Panel.Operation.Show();
            });
        },
        Hide: function () {
            /// <summary>隐藏操作栏</summary>
            return doing(function () {
                iframe.contentWindow.MapController.Panel.Operation.Hide();
            });
        }
    };

    this.Element = {
        Description: {
            Set: function (elementId, html) {
                return doing(function () {
                    iframe.contentWindow.MapController.Element.SetDescription(elementId, html);
                });
            },
            EnableVisiblity: function (enbale) {
                return doing(function () {
                    iframe.contentWindow.MapController.Panel.InfoBox.Visibility = enbale;
                });
            }
        },
        SetPosition: function (elementId, position) {
            return doing(function () {
                iframe.contentWindow.MapController.Element.SetPosition(elementId, position);
            });
        },
        SetColor: function (elementId, color) {
            return doing(function () {
                return iframe.contentWindow.MapController.Element.SetColor(elementId, color);
            });
        },
        SetTitle: function (elementId, title, opts) {
            return doing(function () {
                iframe.contentWindow.MapController.Element.SetTitle(elementId, title, opts);
            });
        },
        HideTitle: function (id) {
            return doing(function () {
                iframe.contentWindow.MapController.Element.TitleVisibility(false, id);
            });
        },
        ShowTitle: function (id) {
            return doing(function () {
                iframe.contentWindow.MapController.Element.TitleVisibility(true, id);
            });
        },
        GetById: function (elementId) {
            return doing(function () {
                return iframe.contentWindow.MapController.Element.GetById(elementId);
            });
        }
    }

    this.Shape = {
        HideTitle: function () {
            return doing(function () {
                iframe.contentWindow.MapController.Element.TitleVisibility(false);
            });
        },
        ShowTitle: function () {
            return doing(function () {
                iframe.contentWindow.MapController.Element.TitleVisibility(true);
            });
        },
        GetById: function (elementId) {
            return doing(function () {
                iframe.contentWindow.MapController.Shape.GetById(elementId);
            });
        },
        SetTitle: function (elementId, title, font) {
            return doing(function () {
                iframe.contentWindow.MapController.Element.SetTitle(elementId, title, font);
            });
        }
    }

    this.Draw = {
        Line: {
            Drawing: function (begin, end, opts, over) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Line.Draw(begin, end, opts, over);
                });
            },
            Redraw: function (id, begin, end, opts, over) {
                return doing(function () {
                    //color, alpha, width, extrudedHeight
                    return iframe.contentWindow.MapController.Draw.Line.Redraw(id, begin, end, opts, over);
                });
            },
            Remove: function (id) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Line.Remove(id);
                });
            }
        },
        Ellipsoid: {
            Drawing: function (begin, end, opts, over) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Ellipsoid.Draw(begin, end, opts, over);
                });
            },
            Redraw: function (id, begin, end, opts, over) {
                return doing(function () {
                    //color, alpha, width, extrudedHeight
                    return iframe.contentWindow.MapController.Draw.Ellipsoid.Redraw(id, begin, end, opts, over);
                });
            },
            Remove: function (id) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Ellipsoid.Remove(id);
                });
            }
        },
        Polyline: {
            Drawing: function (positions, opts, over) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Polyline.Draw(positions, opts, over);
                });
            },
            Redraw: function (id, positions, opts, over) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Polyline.Redraw(id, positions, opts, over);
                });
            },
            Remove: function (id) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Polyline.Remove(id);
                });
            }
        },
        Polygon: {
            Drawing: function (positions, opts, over) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Polygon.Draw(positions, opts, over);
                });
            },
            Redraw: function (id, positions, opts, over) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Polygon.Redraw(id, positions, opts, over);
                });
            },
            Remove: function (id) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Polygon.Remove(id);
                });
            }
        },
        Heatmap: {
            Draw: function (datas, max) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Heatmap.Draw(datas, max);
                });
            }
        },
        Routing: {
            Draw: function (positions, type) {
                return doing(function () {
                    return iframe.contentWindow.MapController.Draw.Routing.Draw(positions, type);
                });
            },
            Remove: function(id)
            {
                return doing(function(){
                    return iframe.contentWindow.MapController.Draw.Routing.Remove(id);
                });
            }
        }
    }


    var _dataController;
    this.__defineGetter__("DataController", function () { return _dataController; });
    this.__defineSetter__("DataController", function (val) { _dataController = val; });

    function initDataController() {
        try {
            if (iframe.contentWindow.MapController) {
                that.DataController = iframe.contentWindow.MapController.DataController;
                try {
                    that.Events.OnLoading();
                } catch (ex) { }
                return;
            }

        }
        catch (ex) {
            //console.error(ex);
        }


        setTimeout(initDataController, 1);
    }


    function EventTriggers() {

        var queue = new Object();

        var _onLoading;
        this.__defineGetter__("OnLoading", function () { return _onLoading; });
        this.__defineSetter__("OnLoading", function (val) { _onLoading = val; });

        var _onLoaded;
        this.__defineGetter__("OnLoaded", function () { return _onLoaded; });
        this.__defineSetter__("OnLoaded", function (val) {
            _onLoaded = val;
            try {
                iframe.contentWindow.MapTools.Events.OnLoaded = _onLoaded;
            }
            catch (ex) {
                queue.OnLoaded = _onLoaded;
                lazy_loading();
            }
        });



        var _onBuildingClicked;
        this.__defineGetter__("OnBuildingClicked", function () { return _onBuildingClicked; });
        this.__defineSetter__("OnBuildingClicked", function (val) {
            _onBuildingClicked = val;
            try {
                iframe.contentWindow.MapTools.Events.OnBuildingSelected = _onBuildingClicked;
            }
            catch (ex) {
                queue.OnBuildingSelected = _onBuildingClicked;
                lazy_loading();
            }
        });


        var _onFloorClicked;
        this.__defineGetter__("OnFloorClicked", function () { return _onFloorClicked; });
        this.__defineSetter__("OnFloorClicked", function (val) {
            _onFloorClicked = val;
            try {
                iframe.contentWindow.MapTools.Events.OnFloorSelected = _onFloorClicked;
            }
            catch (ex) {
                queue.OnFloorSelected = _onFloorClicked;
                lazy_loading();
            }
        });


        var _onElementsClicked;
        this.__defineGetter__("OnElementsClicked", function () { return _onElementsClicked; });
        this.__defineSetter__("OnElementsClicked", function (val) {
            _onElementsClicked = val;
            try {
                iframe.contentWindow.MapTools.Events.OnElementsSelected = _onElementsClicked;
            }
            catch (ex) {
                queue.OnElementsSelected = _onElementsClicked;
                lazy_loading();
            }
        });


        var _onElementsDoubleClicked;
        this.__defineGetter__("OnElementsDoubleClicked", function () { return _onElementsDoubleClicked; });
        this.__defineSetter__("OnElementsDoubleClicked", function (val) {
            _onElementsDoubleClicked = val;
            try {
                iframe.contentWindow.MapTools.Events.OnElementsDoubleClick = _onElementsDoubleClicked;
            }
            catch (ex) {
                queue.OnElementsDoubleClick = _onElementsDoubleClicked;
                lazy_loading();
            }
        });


        var _onVillageClicked;
        this.__defineGetter__("OnVillageClicked", function () { return _onVillageClicked; });
        this.__defineSetter__("OnVillageClicked", function (val) {
            _onVillageClicked = val;
            try {
                iframe.contentWindow.MapTools.Events.OnVillageClicked = _onVillageClicked;
            }
            catch (ex) {
                queue.OnVillageClicked = _onVillageClicked;
                lazy_loading();
            }
        });


        var _getCoordinate;
        this.__defineGetter__("GetCoordinate", function () { return _getCoordinate; });
        this.__defineSetter__("GetCoordinate", function (val) {
            _getCoordinate = val;
            try {
                iframe.contentWindow.MapTools.Events.GetCoordinate = _getCoordinate;
            }
            catch (ex) {
                queue.GetCoordinate = _getCoordinate;
                lazy_loading();
            }
        });


        var _onMouseMoving;
        this.__defineGetter__("OnMouseMoving", function () { return _onMouseMoving; });
        this.__defineSetter__("OnMouseMoving", function (val) {
            _onMouseMoving = val;
            try {
                iframe.contentWindow.MapTools.Events.OnMouseMoving = _onMouseMoving;
            }
            catch (ex) {
                queue.OnMouseMoving = _onMouseMoving;
                lazy_loading();
            }
        });


        var _onError = function (sender, error) {
            console.error(error, sender);
        }
        this.__defineGetter__("OnError", function () { return _onError; });
        this.__defineSetter__("OnError", function (val) {
            _onError = val;
            try {
                iframe.contentWindow.MapTools.Events.OnError = _onError;
            }
            catch (ex) {
                queue.OnError = _onError;
                lazy_loading();
            }
        });


        var _onShapesDisplayed;
        this.__defineGetter__("OnShapesDisplayed", function () { return _onShapesDisplayed; });
        this.__defineSetter__("OnShapesDisplayed", function (val) {
            _onShapesDisplayed = val;
            try {
                iframe.contentWindow.MapTools.Events.OnShapesDisplayed = _onShapesDisplayed;
            }
            catch (ex) {
                queue.OnShapesDisplayed = _onShapesDisplayed;
                lazy_loading();
            }
        });


        var _onCameraMoveEnd;
        this.__defineGetter__("OnCameraMoveEnd", function () { return _onCameraMoveEnd; });
        this.__defineSetter__("OnCameraMoveEnd", function (val) {
            _onCameraMoveEnd = val;
            try {
                iframe.contentWindow.MapTools.Events.OnCameraMoveEnd = _onCameraMoveEnd;
            }
            catch (ex) {
                queue.OnCameraMoveEnd = _onCameraMoveEnd;
                lazy_loading();
            }
        });


        var _onElementDragend;
        this.__defineGetter__("OnElementDragend", function () { return _onElementDragend; });
        this.__defineSetter__("OnElementDragend", function (val) {
            _onElementDragend = val;
            try {
                iframe.contentWindow.MapTools.Events.OnElementDragend = _onElementDragend;
            }
            catch (ex) {
                queue.OnElementDragend = _onElementDragend;
                lazy_loading();
            }
        });


        var _onMouseClick;
        this.__defineGetter__("OnMouseClick", function () { return _onMouseClick; });
        this.__defineSetter__("OnMouseClick", function (val) {
            _onMouseClick = val;
            try {
                iframe.contentWindow.MapTools.Events.OnMouseClick = _onMouseClick;
            }
            catch (ex) {
                queue.OnMouseClick = _onMouseClick;
                lazy_loading();
            }
        });

        var _onMouseDoubleClick;
        this.__defineGetter__("OnMouseDoubleClick", function () { return _onMouseDoubleClick; });
        this.__defineSetter__("OnMouseDoubleClick", function (val) {
            _onMouseDoubleClick = val;
            try {
                iframe.contentWindow.MapTools.Events.OnMouseDoubleClick = _onMouseDoubleClick;
            }
            catch (ex) {
                queue.OnMouseDoubleClick = _onMouseDoubleClick;
                lazy_loading();
            }
        });




        function lazy_loading() {
            try {
                for (var key in queue) {
                    iframe.contentWindow.MapTools.Events[key] = queue[key];
                    delete queue[key];
                }
            } catch (ex) {
                setTimeout(lazy_loading, 5);
            }
        }


    }

    this.Events = new EventTriggers();

    // this.Events = {
    //     OnLoaded: function () {

    //     },
    //     OnBuildingClicked: function (obj) {
    //         /// <summary>选中建筑事件</summary>
    //         /// <param name="obj" type="建筑"></param>
    //     },
    //     OnFloorClicked: function (floor) {
    //         /// <summary>选中建筑事件</summary>
    //         /// <param name="obj" type="建筑"></param>
    //     },
    //     OnElementsClicked: function (objs) {
    //         /// <summary>选中建筑事件</summary>
    //         /// <param name="obj" type="array"></param>
    //     },
    //     OnElementsDoubleClicked: function (objs) {

    //     },
    //     OnVillageClicked: function (obj) {

    //     },
    //     GetCoordinate: function (lon, lat) {
    //         /// <summary>获取坐标点位</summary>
    //         /// <param name="lon" type="float">经度</param>
    //         /// <param name="lat" type="float">纬度</param>
    //     },
    //     OnMouseMoving: function (lon, lat) {
    //         /// <summary>鼠标移动</summary>
    //         /// <param name="lon" type="float">经度</param>
    //         /// <param name="lat" type="float">纬度</param>
    //     },
    //     OnError: function (sender, error) {
    //         /// <summary>报错</summary>
    //         /// <param name="error" type="Error">错误信息</param>
    //         console.error(error, sender);
    //     },
    //     OnShapesDisplayed: function (objs) { }
    // }


    this.Tools = {
        PreviewGeoJson: function (obj, clean) {
            return doing(function () {
                iframe.contentWindow.MapController.Tools.PreviewGeoJson(obj, clean);
            });
        },
        RemovePreview: function () {
            return doing(function () {
                iframe.contentWindow.MapController.Tools.RemovePreview();
            });
        },
        Image: {
            Load: function (id, img) {
                return doing(function () {
                    iframe.contentWindow.MapController.Tools.Image.Load(id, img);
                });
            },
            ChangeRotation: function (id, radians) {
                return doing(function () {
                    iframe.contentWindow.MapController.Tools.Image.ChangeRotation(id, radians);
                });
            }
        },
        Model: {
            Load: function (radian, scale) {
                return doing(function () {
                    iframe.contentWindow.MapController.Tools.Model.Load(radian, scale);
                });
            },
            SetRadian: function (radian) {
                return doing(function () {
                    iframe.contentWindow.MapController.Tools.Model.SetRadian(radian);
                });
            },
            SetScale: function (scale) {
                return doing(function () {
                    iframe.contentWindow.MapController.Tools.Model.SetScale(scale);
                });
            },
            Clear: function () {
                return doing(function () {
                    iframe.contentWindow.MapController.Tools.Model.Clear();
                });
            }
        }
    }






    iframe.addEventListener("load", function () {


    });

    initDataController();
}

CesiumMapClient.EventArgs = function () {
    this.className;
    this.type;
    this.listener;
}

CesiumMapClient.Create = function (iframeId) {
    return new CesiumMapClient(iframeId);
}
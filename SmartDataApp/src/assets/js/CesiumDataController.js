'use strict';


function inherits(Child, Parent) {
    var F = function () { };
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
}



function CesiumDataController(host, port, onloaded) {

    if (!port)
        port = 80;



    var start = new Date();

    var that = this;

    var timeout = 0 * 1000;
    var isInit = true;
    //等待所有协议都已发出（）
    //等待时常：timeout
    //如果有消息发出就clearTimeout(waiter)
    //收到消息回复就等待执行onloaded
    var waiter;

    function Contract(baseUrl) {
        var _this = this;
        this.baseUrl = baseUrl;

        this.village = {
            root: function () {
                return _this.baseUrl + "/villages";
            },
            ids: function () {
                return _this.getJson(_this.village.root());
            },
            basic: function (villageId) {
                return _this.village.root() + "/" + villageId;
            },
            get: function (villageId) {
                return _this.getJson(_this.village.basic(villageId));
            },
            point: {
                root: function (villageId) {
                    return _this.village.basic(villageId) + "/points";
                },
                ids: function (villageId) {
                    return _this.getJson(_this.village.point.root(villageId));
                },
                basic: function (villageId, pointId) {
                    return _this.village.point.root(villageId) + "/" + pointId;
                },
                get: function (villageId, pointId) {
                    return _this.getJson(_this.village.point.basic(villageId, pointId));
                }
            },
            polyline: {
                root: function (villageId) {
                    return _this.village.basic(villageId) + "/polylines";
                },
                ids: function (villageId) {
                    return _this.getJson(_this.village.polyline.root(villageId));
                },
                basic: function (villageId, polylineId) {
                    return _this.village.polyline.root(villageId) + "/" + polylineId;
                },
                get: function (villageId, polylineId) {
                    return _this.getJson(_this.village.polyline.basic(villageId, polylineId));
                }
            },
            ellipsoid: {
                root: function (villageId) {
                    return _this.village.basic(villageId) + "/ellipsoids";
                },
                ids: function (villageId) {
                    return _this.getJson(_this.village.ellipsoid.root(villageId));
                },
                basic: function (villageId, ellipsoidId) {
                    return _this.village.ellipsoid.root(villageId) + "/" + ellipsoidId;
                },
                get: function (villageId, ellipsoidId) {
                    return _this.getJson(_this.village.ellipsoid.basic(villageId, ellipsoidId));
                }
            },
            polygon: {
                root: function (villageId) {
                    return _this.village.basic(villageId) + "/polygons";
                },
                ids: function (villageId) {
                    return _this.getJson(_this.village.polygon.root(villageId));
                },
                basic: function (villageId, polygonId) {
                    return _this.village.polygon.root(villageId) + "/" + polygonId;
                },
                get: function (villageId, polygonId) {
                    return _this.getJson(_this.village.polygon.basic(villageId, polygonId));
                }
            },
            building: {
                root: function (villageId) {
                    return _this.village.basic(villageId) + "/buildings";
                },
                ids: function (villageId) {
                    return _this.getJson(_this.village.building.root(villageId));
                },
                basic: function (villageId, buildingId) {
                    return _this.village.building.root(villageId) + "/" + buildingId;
                },
                get: function (villageId, buildingId) {
                    return _this.getJson(_this.village.building.basic(villageId, buildingId))
                },
                floor: {
                    root: function (villageId, buildingId) {
                        return _this.village.building.basic(villageId, buildingId) + "/floors";
                    },
                    ids: function (villageId, buildingId) {
                        return _this.getJson(_this.village.building.floor.root(villageId, buildingId));
                    },
                    basic: function (villageId, buildingId, floorId) {
                        return _this.village.building.floor.root(villageId, buildingId) + "/" + floorId;
                    },
                    get: function (villageId, buildingId, floorId) {
                        return _this.getJson(_this.village.building.floor.basic(villageId, buildingId, floorId));
                    },
                    point: {
                        get: function (villageId, buildingId, floorId, pointId) {
                            return _this.getJson(_this.village.point.root(villageId) + "/" + buildingId + "_" + floorId + "_" + pointId)
                        }
                    },
                    polyline: {
                        get: function (villageId, buildingId, floorId, polylineId) {
                            return _this.getJson(_this.village.polyline.root(villageId) + "/" + buildingId + "_" + floorId + "_" + polylineId);
                        }
                    },
                    ellipsoid: {
                        get: function (villageId, buildingId, floorId, ellipsoidId) {
                            return _this.getJson(_this.village.ellipsoid.root(villageId) + "/" + buildingId + "_" + floorId + "_" + ellipsoidId);
                        }
                    },
                    polygon: {
                        get: function (villageId, buildingId, floorId, polygonId) {
                            return _this.getJson(_this.village.polygon.root(villageId) + "/" + buildingId + "_" + floorId + "_" + polygonId);
                        }
                    }
                }
            }
        }

    }
    Contract.prototype.getJson = function (url) {
        return url + ".json";//?v=" + Guid.NewGuid().ToString("N");
    };
    //http获取协议
    var http_contract = new Contract("http://" + host + ":" + port + "/amap/models");
    //服务器写入协议
    var dir_contract = new Contract("../models");

    var AsynService = {
        count: 0,
        OnError: function (status, text) {
            //console.log(this.opts);            
            console.error(text, status);
        },
        Get: function (url, opts, callback, onerror) {

            var fun = callback;
            var service = new AsynHttpService(ContentType.Json, 5 * 1000);
            opts.state = "in function";
            opts.url = url;
            //console.log(opts);
            service.OnError = onerror ? function () {
                this.opts.state = "on error";

                onerror(this.opts);
            } : AsynService.OnError;
            service.opts = opts;
            service.callback = callback;
            service.OnLoading = function () {

                this.opts.state = "on OnLoading";
                //console.log(this.opts);
            }
            service.OnCanceled = function () {

                this.opts.state = "on OnCanceled";
                //console.log(this.opts);
            }
            service.OnComplete = function (text, html) {

                this.opts.state = "on complete";
                //console.log(this.opts);
                try {
                    var result = JSONDeserialization(text);
                    this.callback(this.opts, result);
                } catch (ex) {
                    console.error(ex);
                }
            }
            service.OnLoaded = function () {
                this.opts.state = "on OnLoaded";
                //console.log(this.opts);

                if (isInit)
                    clearTimeout(waiter);
            }
            service.OnInteractive = function () {
                this.opts.state = "on OnInteractive";
                //console.log(this.opts);
                if (isInit) {
                    if (waiter)
                        clearTimeout(waiter);

                    waiter = setTimeout(that.OnLoaded, timeout);
                }
            }
            service.httpGet(url);
        },
        Post: function (entity, filename, opts, callback, onerror) {
            var str = JSONstringify(entity);
            var url = "http://" + host + ":" + port + "/node/";
            var service = new AsynHttpService(ContentType.Json);
            service.opts = opts;
            service.callback = callback;
            service.onerror = onerror;
            service.addHeaders("filename", filename);
            service.OnError = onerror ? function () {
                this.onerror(this.opts);
            } : AsynService.OnError;
            service.OnComplete = function () {
                try {
                    this.callback(this.opts);
                }
                catch (ex) {
                    console.error(ex);
                }
            };
            service.httpPost(url, str);
        },
        Delete: function (filename, callback, onerror) {
            var url = "http://" + host + ":" + port + "/node/";
            var service = new AsynHttpService(ContentType.Json);
            service.addHeaders("filename", filename);
            service.OnError = onerror ? onerror : AsynService.OnError;
            service.OnComplete = callback;
            service.httpDelete(url);
        }
    }
    var Service = {
        Get: function (url, dntUseCache) {
            var service = new HttpService(ContentType.Json, !dntUseCache);
            var str = service.httpGet(url);
            if (!dntUseCache)
                console.warn("sync:" + url);
            return JSONDeserialization(str);
        },
        Post: function (entity, filename) {
            var str = JSONstringify(entity);
            var url = "http://" + host + ":" + port + "/node/";
            var service = new HttpService(ContentType.Json);
            service.addHeaders("filename", filename);

            service.httpPost(url, str);
        },
        Delete: function (filename) {
            var url = "http://" + host + ":" + port + "/node/";
            var service = new HttpService(ContentType.Json);
            service.addHeaders("filename", filename);
            service.httpDelete(url);
        }
    }

    //小区
    var VillageController = function () {
        var _this = this;

        this.GetIds = function () {
            return Service.Get(http_contract.village.ids(), true);
        }

        this.List = function () {
            var villageIds = _this.GetIds();
            var villages = {};
            for (var i = 0; i < villageIds.length; i++) {
                var id = villageIds[i]
                try {
                    villages[id] = _this.Get(id);
                } catch (ex) {
                    console.error(id, ex);
                }
            }
            Cache.Village = villages;
            return villages;
        }
        this.Get = function (villageId, isNew) {
            if (!isNew && Cache.Village[villageId])
                return Cache.Village[villageId];

            var village = Service.Get(http_contract.village.get(villageId));
            village = new CesiumDataController.Village().Instantiate(village);
            village.that = that;
            Cache.Village[villageId] = village;
            return village;
        }
        this.Create = function (villageId, village) {
            //清理一下对象，把不必要的属性过滤掉
            village = new CesiumDataController.Village().Instantiate(village);
            //创建对象文件
            Service.Post(village, dir_contract.village.get(villageId));
            //获取id列表并修改
            var ids = _this.GetIds();
            ids.push(villageId);
            Service.Post(ids, dir_contract.village.ids());
            //把对象写入本地缓存
            Cache.Village[villageId] = village;
            return true;
        }
        this.Update = function (villageId, village) {
            //清理一下对象，把不必要的属性过滤掉
            village = new CesiumDataController.Village().Instantiate(village);
            Service.Post(village, http_contract.village.get(villageId));
            //修改本地缓存
            Cache.Village[villageId] = village;
            return true;
        }
        this.Remove = function (villageId) {
            //获取id列表并判断有无
            var ids = _this.GetIds();
            var index = ids.indexOf(villageId);
            if (index < 0) return;
            //删除内部信息和文件
            that.Village.Point.Clear(villageId);
            that.Building.Clear(villageId);
            Service.Delete(http_contract.village.get(villageId));
            //修改id列表
            ids.splice(index, 1);
            Service.Post(ids, dir_contract.village.ids());
            //删除缓存
            delete Cache.Village[villageId];
            return true;
        }
        this.GetByBuildingId = function (buildingId) {
            var building = that.Building.GetById(buildingId)
            if (building)
                return _this.Get(building.villageId);
            return null;
        }

        function AsynController() {
            var __this = this;
            this.GetIds = function (callback) {
                AsynService.Get(http_contract.village.ids(), {}, callback);
            };
            this.List = function (callback) {
                _this.Asyn.GetIds(function (opts, villageIds) {
                    for (var i = 0; i < villageIds.length; i++) {
                        var id = villageIds[i];
                        try {
                            __this.Get(id, function (village) {
                                Cache.Village[village.id] = village;
                                callback(village);
                            });
                        } catch (ex) {
                            console.error(id, ex);
                        }
                    }
                });
            };
            this.Get = function (villageId, callback) {
                AsynService.Get(http_contract.village.get(villageId), { villageId: villageId }, function (opts, village) {
                    village = new CesiumDataController.Village().Instantiate(village);
                    village.that = that;
                    Cache.Village[opts.villageId] = village;
                    callback(village);
                });
            };
            this.GetByBuildingId = function (buildingId, callback) {
                that.Building.Asyn.GetById(buildingId, function (building) {
                    __this.Get(building.villageId, callback);
                })

            }
        }

        this.Asyn = new AsynController();
    }

    //建筑
    function BuildingController() {
        var _this = this;

        this.GetIds = function (villageId) {
            var ids = new Array();
            if (villageId) {
                var url = http_contract.village.building.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.building.ids(villageId));
        }

        this.List = function (villageId) {

            var ids = _this.GetIds(villageId);
            var buildings = {};
            if (ids) {
                for (var i = 0; i < ids.length; i++) {
                    try {
                        var building = _this.Get(villageId, ids[i]);
                        buildings[ids[i]] = building;
                        Cache.Building[ids[i]] = building;
                    } catch (ex) {
                        console.error(ids[i], ex);
                    }
                }
            }
            return buildings;
        }
        this.All = function () {
            return Cache.Building;
        }
        this.GetById = function (buildingId) {
            return Cache.Building[buildingId];
        }
        this.RemoveById = function (buildingId) {
            var building = _this.GetById(buildingId);
            if (building) {
                _this.Remove(building.villageId, buildingId);
                return true;
            }
            return false;
        }
        this.Get = function (villageId, buildingId, isNew) {
            if (!isNew && Cache.Building[buildingId])
                return Cache.Building[buildingId];
            var building = Service.Get(http_contract.village.building.get(villageId, buildingId));
            building = new CesiumDataController.Building().Instantiate(building);
            building.that = that;
            Cache.Building[buildingId] = building;
            return building;

        }
        this.Create = function (villageId, buildingId, building) {
            building = new CesiumDataController.Building().Instantiate(building);
            building.parentId = villageId;
            var ids = _this.GetIds(villageId);
            ids.push(buildingId);
            setIds(villageId, ids);
            Service.Post(building, dir_contract.village.building.get(villageId, buildingId));
            Cache.Building[buildingId] = building;
            return true;
        }
        this.Update = function (villageId, buildingId, building) {
            building = new CesiumDataController.Building().Instantiate(building);
            Service.Post(building, dir_contract.village.building.get(villageId, buildingId));
            Cache.Building[buildingId] = building;
            return true;
        }
        this.Remove = function (villageId, buildingId) {
            var ids = _this.GetIds(villageId);
            var index = ids.indexOf(buildingId);
            if (index < 0) return;
            that.Floor.Clear(villageId, buildingId);
            Service.Delete(dir_contract.village.building.get(villageId, buildingId));
            ids.splice(index, 1);
            setIds(villageId, ids);

            delete Cache.Building[buildingId];
            return true;
        }
        this.Clear = function (villageId) {
            var ids = _this.GetIds(villageId);
            for (var i = 0; i < ids.length; i++) {
                _this.Remove(villageId, ids[i]);
            }
        }
        this.Children = {
            Create: function (villageId, buildingId, childId, child) {
                var building = _this.Get(villageId, buildingId);
                if (!building.children)
                    building.children = {};
                building.children[childId] = child;
                _this.Update(villageId, buildingId, building);
                return true;
            },
            Remove: function (villageId, buildingId, childId) {
                var building = _this.Get(villageId, buildingId);
                if (!building.children) return;
                delete building.children[childId];
                _this.Update(villageId, buildingId, building);
                return true;
            },
            Update: function (villageId, buildingId, childId, child) {
                var building = _this.Get(villageId, buildingId);
                building.children[childId] = child;
                _this.Update(villageId, buildingId, building);
                return true;
            },
            List: function (villageId, buildingId) {
                var building = _this.Get(villageId, buildingId);
                return building.children;
            },
            Get: function (villageId, buildingId, childId) {
                return this.List(villageId, buildingId)[childId];
            }
        }


        function AsynController() {
            var __this = this;

            this.GetIds = function (villageId, callback) {
                if (villageId) {
                    var url = http_contract.village.building.ids(villageId);
                    AsynService.Get(url, { villageId: villageId }, callback, function (opts) {
                        setIds(opts.villageId, new Array(), function (opts) {
                            callback(opts, new Array());
                        })
                    });
                }
            }
            function setIds(villageId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.building.ids(villageId), { villageId: villageId }, callback);
            }

            this.Get = function (villageId, buildingId, callback) {
                AsynService.Get(http_contract.village.building.get(villageId, buildingId), {
                    villageId: villageId, buildingId: buildingId
                }, function (opts, building) {
                    building = new CesiumDataController.Building().Instantiate(building);
                    building.that = that;
                    Cache.Building[opts.buildingId] = building;
                    callback(building);
                });
            }
            this.List = function (villageId, callback) {
                __this.GetIds(villageId, function (opts, ids) {
                    if (ids) {
                        for (var i = 0; i < ids.length; i++) {
                            __this.Get(opts.villageId, ids[i], callback);
                        }
                    }
                });
            }
        }

        this.Asyn = new AsynController();


    }

    function FloorController() {
        var _this = this;


        this.GetIds = function (villageId, buildingId) {
            var ids = new Array();
            var url = http_contract.village.building.floor.ids(villageId, buildingId);
            try {
                ids = Service.Get(url, true);
            } catch (ex) {
                setIds(villageId, buildingId, ids);
            }
            return ids;
        }
        var setIds = function (villageId, buildingId, ids) {
            Service.Post(ids, dir_contract.village.building.floor.ids(villageId, buildingId));
        }


        this.List = function (villageId, buildingId) {
            var ids = _this.GetIds(villageId, buildingId);
            var floors = {};
            for (var i = 0; i < ids.length; i++) {
                var id = ids[i];
                try {
                    var floor = _this.Get(villageId, buildingId, id);
                    floors[id] = floor;
                    Cache.Floor[id] = floor;
                } catch (ex) {
                    console.error(ids[i], ex);
                }
            }
            return floors;
        }
        this.All = function () {
            return Cache.Floor;
        }
        this.GetById = function (floorId) {
            if (Cache.Floor[floorId])
                return Cache.Floor[floorId];

            var villages = that.Village.List();
            for (var villageId in villages) {
                var buildingIds = that.Building.GetIds(villageId);
                for (var i = 0; i < buildingIds.length; i++) {
                    var buildingId = buildingIds[i];
                    var floorIds = that.Floor.GetIds(villageId, buildingId);
                    if (floorIds.indexOf(floorId) >= 0)
                        return that.Floor.Get(villageId, buildingId, floorId);
                }
            }
            return null;


        }
        this.RemoveById = function (floorId) {
            var floor = _this.GetById(floorId);
            if (floor) {
                if (floor.villageId && floor.buildingId) {
                    _this.Remove(floor.villageId, floor.buildingId, floorId);
                    return true;
                }
            }
            return false;
        }
        this.Get = function (villageId, buildingId, floorId, isNew) {
            if (!isNew && Cache.Floor[floorId])
                return Cache.Floor[floorId];
            var floor = Service.Get(http_contract.village.building.floor.get(villageId, buildingId, floorId));
            floor = new CesiumDataController.Floor().Instantiate(floor);
            floor.that = that;
            Cache.Floor[floorId] = floor;
            return floor;
        }

        this.GetGeoJson = function (floor) {
            if (!floor ||
                floor.model != CesiumDataController.ModelType.Json ||
                !floor.url)
                return null;
            return Service.Get(floor.url);
        }


        this.Create = function (villageId, buildingId, floorId, floor) {
            floor = new CesiumDataController.Floor().Instantiate(floor);
            floor.parentId = buildingId;
            var ids = _this.GetIds(villageId, buildingId);
            ids.push(floorId);
            setIds(villageId, buildingId, ids);

            Service.Post(floor, dir_contract.village.building.floor.get(villageId, buildingId, floorId));
            Cache.Floor[floorId] = floor;
            return true;
        }
        this.Update = function (villageId, buildingId, floorId, floor) {
            floor = new CesiumDataController.Floor().Instantiate(floor);
            Service.Post(floor, dir_contract.village.building.floor.get(villageId, buildingId, floorId));
            Cache.Floor[floorId] = floor;
            return true;
        }
        this.Remove = function (villageId, buildingId, floorId) {

            var ids = _this.GetIds(villageId, buildingId);
            var index = ids.indexOf(floorId);
            if (index < 0) return;
            //清空子项
            that.Point.Clear(villageId, buildingId, floorId);
            Service.Delete(dir_contract.village.building.floor.get(villageId, buildingId, floorId));
            //删除当前结构信息
            ids.splice(index, 1);
            //修改父结构信息
            setIds(villageId, buildingId, ids);
            //删除物理结构

            delete Cache.Floor[floorId];
            return true;
        }
        this.Clear = function (villageId, buildingId) {
            var ids = _this.GetIds(villageId, buildingId);
            for (var i = 0; i < ids.length; i++) {
                _this.Remove(villageId, buildingId, ids[i]);
            }
        }

        function AsynController() {
            var __this = this;
            this.GetIds = function (villageId, buildingId, callback) {
                var url = http_contract.village.building.floor.ids(villageId, buildingId);
                AsynService.Get(url,
                    { villageId: villageId, buildingId: buildingId },
                    callback,
                    function (opts) {
                        setIds(opts.villageId, opts.buildingId, new Array(), function (opts) {
                            callback(opts, new Array());
                        })
                    });
            }
            var setIds = function (villageId, buildingId, ids, callback) {
                AsynService.Post(
                    ids,
                    dir_contract.village.building.floor.ids(villageId, buildingId),
                    { villageId: villageId, buildingId: buildingId },
                    callback
                );
            }

            this.Get = function (villageId, buildingId, floorId, callback) {
                AsynService.Get(http_contract.village.building.floor.get(villageId, buildingId, floorId), {
                    villageId: villageId, buildingId: buildingId, floorId: floorId
                },
                    function (opts, floor) {
                        floor = new CesiumDataController.Floor().Instantiate(floor);
                        floor.that = that;
                        Cache.Floor[opts.floorId] = floor;
                        callback(floor);
                    });
            }

            this.List = function (villageId, buildingId, callback) {
                __this.GetIds(villageId, buildingId,
                    function (opts, ids) {
                        for (var i = 0; i < ids.length; i++) {
                            var id = ids[i];
                            __this.Get(opts.villageId, opts.buildingId, id, callback);
                        }
                    });
            }
        }

        this.Asyn = new AsynController();

    }

    function PointController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() };
            if (villageId) {
                var url = http_contract.village.point.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.point.ids(villageId));
        }



        this.List = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            var points = {};
            if (!ids[buildingId]) return points;
            if (!ids[buildingId][floorId]) return points;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {

                var id = ids[buildingId][floorId][i];
                try {
                    var point = _this.Get(villageId, buildingId, floorId, id);
                    points[id] = point;
                    Cache.Point[id] = point;
                } catch (ex) {
                    console.error(id, ex);
                }
            }
            return points;
        }

        this.All = function () {
            return Cache.Point;
        }
        this.GetById = function (pointId) {
            if (Cache.Point[pointId])
                return Cache.Point[pointId];
            var villages = that.Village.List();
            for (var villageId in villages) {
                var buildingIds = that.Building.GetIds(villageId);
                for (var i = 0; i < buildingIds.length; i++) {
                    var buildingId = buildingIds[i];
                    var floorIds = that.Floor.GetIds(villageId, buildingId);
                    for (var j = 0; j < floorIds.length; j++) {
                        var floorId = floorIds[j];
                        var pointIds = that.Point.GetIds(villageId, buildingId, floorId);
                        if (!pointIds[buildingId] || !pointIds[buildingId][floorId] || pointIds[buildingId][floorId].indexOf(pointId) < 0)
                            continue;
                        return that.Point.Get(villageId, buildingId, floorId, pointId);
                    }
                }
            }
            return null;
        }
        this.RemoveById = function (pointId) {
            var point = _this.GetById(pointId);
            if (point) {
                if (point.villageId && point.buildingId && point.floorId) {
                    _this.Remove(point.villageId, point.buildingId, point.floorId, pointId);
                    return true;
                }
                else if (point.villageId) {
                    that.Village.Point.Remove(point.villageId, pointId);
                    return true;
                }
                else { }
            }
        }
        this.Get = function (villageId, buildingId, floorId, pointId, isNew) {
            if (!isNew && Cache.Point[pointId])
                return Cache.Point[pointId];

            var point = Service.Get(http_contract.village.building.floor.point.get(villageId, buildingId, floorId, pointId));
            point = new CesiumDataController.Point().Instantiate(point);
            point.that = that;
            Cache.Point[pointId] = point;
            return point;
        }
        this.Create = function (villageId, buildingId, floorId, pointId, point) {
            point = new CesiumDataController.Point().Instantiate(point);
            point.parentId = floorId;
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId])
                ids[buildingId] = {};
            if (!ids[buildingId][floorId])
                ids[buildingId][floorId] = new Array();
            ids[buildingId][floorId].push(pointId);
            setIds(villageId, ids);
            Service.Post(point, dir_contract.village.building.floor.point.get(villageId, buildingId, floorId, pointId));
            Cache.Point[pointId] = point;
            return true;
        }
        this.Update = function (villageId, buildingId, floorId, pointId, point) {
            point = new CesiumDataController.Point().Instantiate(point);
            Service.Post(point, dir_contract.village.building.floor.point.get(villageId, buildingId, floorId, pointId));
            Cache.Point[pointId] = point;
            return true;
        }
        this.Remove = function (villageId, buildingId, floorId, pointId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            var index = ids[buildingId][floorId].indexOf(pointId);
            if (index < 0) return;
            Service.Delete(dir_contract.village.building.floor.point.get(villageId, buildingId, floorId, pointId));

            ids[buildingId][floorId].splice(index, 1);

            setIds(villageId, ids);

            delete Cache.Point[pointId];
            return true;
        }
        this.Clear = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                _this.Remove(villageId, buildingId, floorId, ids[buildingId][floorId][i]);
            }

        }

        function AsynController() {
            var __this = this;

            this.GetIds = function (villageId, buildingId, floorId, callback) {
                var url = http_contract.village.point.ids(villageId);
                AsynService.Get(url,
                    { villageId: villageId, buildingId: buildingId, floorId: floorId },
                    callback,
                    function (opts) {
                        setIds(opts.villageId, opts.buildingId, opts.floorId, { current: new Array() }, function (opts) {
                            callback(opts, new Array());
                        })
                    });
            }
            function setIds(villageId, buildingId, floorId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.point.ids(villageId), { villageId: villageId, buildingId: buildingId, floorId: floorId }, callback);
            }

            this.Get = function (villageId, buildingId, floorId, pointId, callback) {
                AsynService.Get(http_contract.village.building.floor.point.get(villageId, buildingId, floorId, pointId),
                    {
                        villageId: villageId, buildingId: buildingId, floorId: floorId, pointId: pointId
                    },
                    function (opts, point) {
                        point = new CesiumDataController.Point().Instantiate(point);
                        point.that = that;
                        Cache.Point[opts.pointId] = point;
                        callback(point);
                    });
            }


            this.List = function (villageId, buildingId, floorId, callback) {
                __this.GetIds(villageId, buildingId, floorId, function (opts, ids) {
                    if (!ids[opts.buildingId]) {
                        return;
                    }
                    if (!ids[opts.buildingId][opts.floorId]) {
                        return;
                    }
                    for (var i = 0; i < ids[opts.buildingId][opts.floorId].length; i++) {
                        var id = ids[opts.buildingId][opts.floorId][i];
                        __this.Get(opts.villageId, opts.buildingId, opts.floorId, id, callback);
                    }
                });
            }
        }


        this.Asyn = new AsynController();

    }


    function VillagePointController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() }
            if (villageId) {
                var url = http_contract.village.point.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.point.ids(villageId));
        }


        this.List = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            var points = {};

            for (var i = 0; i < ids.current.length; i++) {
                var id = ids.current[i];
                try {
                    var point = _this.Get(villageId, id);
                    points[id] = point;
                    Cache.Point[id] = point;
                } catch (ex) {
                    console.error(id, ex);
                }
            }

            return points;
        }
        this.Get = function (villageId, pointId, isNew) {
            if (!isNew && Cache.Point[pointId])
                return Cache.Point[pointId];

            var point = Service.Get(http_contract.village.point.get(villageId, pointId));
            point = new CesiumDataController.Point().Instantiate(point);
            point.that = that;
            Cache.Point[pointId] = point;
            return point;
        }
        this.Create = function (villageId, pointId, point) {
            point = new CesiumDataController.Point().Instantiate(point);
            point.parentId = villageId;
            var ids = _this.GetIds(villageId);
            if (!ids.current)
                ids.current = new Array();
            ids.current.push(pointId);
            setIds(villageId, ids);
            Service.Post(point, dir_contract.village.point.get(villageId, pointId));
            Cache.Point[pointId] = point;
            return true;
        }
        this.Update = function (villageId, pointId, point) {
            point = new CesiumDataController.Point().Instantiate(point);
            Service.Post(point, dir_contract.village.point.get(villageId, pointId));
            Cache.Point[pointId] = point;
            return true;
        }
        this.Remove = function (villageId, pointId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return false;
            var index = ids.current.indexOf(pointId);
            if (index < 0) return;

            Service.Delete(dir_contract.village.point.get(villageId, pointId));

            ids.current.splice(index, 1);
            setIds(villageId, ids);

            delete Cache.Point[pointId];
            return true;
        }
        this.Clear = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            for (var i = 0; i < ids.current.length; i++) {
                _this.Remove(villageId, ids.current[i]);
            }
        }

        function AsynController() {
            var __this = this;
            this.GetIds = function (villageId, callback) {
                var url = http_contract.village.point.ids(villageId);
                AsynService.Get(url, { villageId: villageId }, callback, function (opts) {
                    setIds(opts.villageId, { current: new Array() }, function (opts) {
                        callback(opts, new Array());
                    })
                });
            }
            function setIds(villageId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.point.ids(villageId), { villageId: villageId }, callback);
            }


            this.List = function (villageId, callback) {
                __this.GetIds(villageId, function (opts, ids) {
                    if (!ids.current) return;
                    for (var i = 0; i < ids.current.length; i++) {
                        __this.Get(opts.villageId, ids.current[i], callback);
                    }
                });
            }
            this.Get = function (villageId, pointId, callback) {
                AsynService.Get(http_contract.village.point.get(villageId, pointId),
                    { villageId: villageId, pointId: pointId }
                    , function (opts, point) {
                        point = new CesiumDataController.Point().Instantiate(point);
                        point.that = that;
                        Cache.Point[opts.pointId] = point;
                        callback(point);
                    });
            }
        }

        this.Asyn = new AsynController();

    }


    function PolylineController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() };
            if (villageId) {
                var url = http_contract.village.polyline.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.polyline.ids(villageId));
        }



        this.List = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            var polylines = {};
            if (!ids[buildingId]) return polylines;
            if (!ids[buildingId][floorId]) return polylines;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                var id = ids[buildingId][floorId][i];
                try {
                    var polyline = _this.Get(villageId, buildingId, floorId, id);
                    polylines[id] = polyline;
                    Cache.Polyline[id] = polyline;
                } catch (ex) {
                    console.error(id, ex);
                }
            }
            return polylines;
        }

        this.All = function () {
            return Cache.Polyline;
        }
        this.GetById = function (polylineId) {
            if (Cache.Polyline[polylineId])
                return Cache.Polyline[polylineId];
            var villages = that.Village.List();
            for (var villageId in villages) {
                var buildingIds = that.Building.GetIds(villageId);
                for (var i = 0; i < buildingIds.length; i++) {
                    var buildingId = buildingIds[i];
                    var floorIds = that.Floor.GetIds(villageId, buildingId);
                    for (var j = 0; j < floorIds.length; j++) {
                        var floorId = floorIds[j];
                        var polylineIds = that.Polyline.GetIds(villageId, buildingId, floorId);
                        if (!polylineIds[buildingId] || !polylineIds[buildingId][floorId] || polylineIds[buildingId][floorId].indexOf(polylineId) < 0)
                            continue;
                        return that.Polyline.Get(villageId, buildingId, floorId, polylineId);
                    }
                }
            }
            return null;
        }
        this.RemoveById = function (polylineId) {
            var polyline = _this.GetById(polylineId);
            if (polyline) {
                if (polyline.villageId && polyline.buildingId && polyline.floorId) {
                    _this.Remove(polyline.villageId, polyline.buildingId, polyline.floorId, polylineId);
                    return true;
                }
                else if (polyline.villageId) {
                    that.Village.Polyline.Remove(polyline.villageId, polylineId);
                    return true;
                }
                else { }
            }
        }
        this.Get = function (villageId, buildingId, floorId, polylineId, isNew) {
            if (!isNew && Cache.Polyline[polylineId])
                return Cache.Polyline[polylineId];

            var polyline = Service.Get(http_contract.village.building.floor.polyline.get(villageId, buildingId, floorId, polylineId));
            polyline = new CesiumDataController.Polyline().Instantiate(polyline);
            polyline.that = that;
            Cache.Polyline[polylineId] = polyline;
            return polyline;
        }
        this.Create = function (villageId, buildingId, floorId, polylineId, polyline) {
            polyline = new CesiumDataController.Polyline().Instantiate(polyline);
            polyline.parentId = floorId;
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId])
                ids[buildingId] = {};
            if (!ids[buildingId][floorId])
                ids[buildingId][floorId] = new Array();
            ids[buildingId][floorId].push(polylineId);
            setIds(villageId, ids);
            Service.Post(polyline, dir_contract.village.building.floor.polyline.get(villageId, buildingId, floorId, polylineId));
            Cache.Polyline[polylineId] = polyline;
            return true;
        }
        this.Update = function (villageId, buildingId, floorId, polylineId, polyline) {
            polyline = new CesiumDataController.Polyline().Instantiate(polyline);
            Service.Post(polyline, dir_contract.village.building.floor.polyline.get(villageId, buildingId, floorId, polylineId));
            Cache.Polyline[polylineId] = polyline;
            return true;
        }
        this.Remove = function (villageId, buildingId, floorId, polylineId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            var index = ids[buildingId][floorId].indexOf(polylineId);
            if (index < 0) return;
            Service.Delete(dir_contract.village.building.floor.polyline.get(villageId, buildingId, floorId, polylineId));

            ids[buildingId][floorId].splice(index, 1);

            setIds(villageId, ids);

            delete Cache.Polyline[polylineId];
            return true;
        }
        this.Clear = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                _this.Remove(villageId, buildingId, floorId, ids[buildingId][floorId][i]);
            }

        }

        function AsynController() {
            var __this = this;

            this.GetIds = function (villageId, buildingId, floorId, callback) {
                var url = http_contract.village.polyline.ids(villageId);
                AsynService.Get(url,
                    { villageId: villageId, buildingId: buildingId, floorId: floorId },
                    callback,
                    function (opts) {
                        setIds(opts.villageId, opts.buildingId, opts.floorId, { current: new Array() }, function (opts) {
                            callback(opts, new Array());
                        })
                    });
            }
            function setIds(villageId, buildingId, floorId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.polyline.ids(villageId), { villageId: villageId, buildingId: buildingId, floorId: floorId }, callback);
            }

            this.Get = function (villageId, buildingId, floorId, polylineId, callback) {
                AsynService.Get(http_contract.village.building.floor.polyline.get(villageId, buildingId, floorId, polylineId),
                    {
                        villageId: villageId, buildingId: buildingId, floorId: floorId, polylineId: polylineId
                    },
                    function (opts, polyline) {
                        polyline = new CesiumDataController.Polyline().Instantiate(polyline);
                        polyline.that = that;
                        Cache.Polyline[opts.polylineId] = polyline;
                        callback(polyline);
                    });
            }


            this.List = function (villageId, buildingId, floorId, callback) {
                __this.GetIds(villageId, buildingId, floorId, function (opts, ids) {
                    if (!ids[opts.buildingId]) {
                        return;
                    }
                    if (!ids[opts.buildingId][opts.floorId]) {
                        return;
                    }
                    for (var i = 0; i < ids[opts.buildingId][opts.floorId].length; i++) {
                        var id = ids[opts.buildingId][opts.floorId][i];
                        __this.Get(opts.villageId, opts.buildingId, opts.floorId, id, callback);
                    }
                });
            }
        }


        this.Asyn = new AsynController();

    }

    function VillagePolylineController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() }
            if (villageId) {
                var url = http_contract.village.polyline.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.polyline.ids(villageId));
        }


        this.List = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            var polylines = {};

            for (var i = 0; i < ids.current.length; i++) {
                var id = ids.current[i];
                try {
                    var polyline = _this.Get(villageId, id);
                    polylines[id] = polyline;
                    Cache.Polyline[id] = polyline;
                } catch (ex) {
                    console.error(id, ex);
                }
            }

            return polylines;
        }
        this.Get = function (villageId, polylineId, isNew) {
            if (!isNew && Cache.Polyline[polylineId])
                return Cache.Polyline[polylineId];

            var polyline = Service.Get(http_contract.village.polyline.get(villageId, polylineId));
            polyline = new CesiumDataController.Polyline().Instantiate(polyline);
            polyline.that = that;
            Cache.Polyline[polylineId] = polyline;
            return polyline;
        }
        this.Create = function (villageId, polylineId, polyline) {
            polyline = new CesiumDataController.Polyline().Instantiate(polyline);
            polyline.parentId = villageId;
            var ids = _this.GetIds(villageId);
            if (!ids.current)
                ids.current = new Array();
            ids.current.push(polylineId);
            setIds(villageId, ids);
            Service.Post(polyline, dir_contract.village.polyline.get(villageId, polylineId));
            Cache.Polyline[polylineId] = polyline;
            return true;
        }
        this.Update = function (villageId, polylineId, polyline) {
            polyline = new CesiumDataController.Polyline().Instantiate(polyline);
            Service.Post(polyline, dir_contract.village.polyline.get(villageId, polylineId));
            Cache.Polyline[polylineId] = polyline;
            return true;
        }
        this.Remove = function (villageId, polylineId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return false;
            var index = ids.current.indexOf(polylineId);
            if (index < 0) return;

            Service.Delete(dir_contract.village.polyline.get(villageId, polylineId));

            ids.current.splice(index, 1);
            setIds(villageId, ids);

            delete Cache.Polyline[polylineId];
            return true;
        }
        this.Clear = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            for (var i = 0; i < ids.current.length; i++) {
                _this.Remove(villageId, ids.current[i]);
            }
        }

        function AsynController() {
            var __this = this;
            this.GetIds = function (villageId, callback) {
                var url = http_contract.village.polyline.ids(villageId);
                AsynService.Get(url, { villageId: villageId }, callback, function (opts) {
                    setIds(villageId, { current: new Array() }, function (opts) {
                        callback(opts, new Array());
                    })
                });
            }
            function setIds(villageId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.polyline.ids(villageId), { villageId: villageId }, callback);
            }


            this.List = function (villageId, callback) {
                __this.GetIds(villageId, function (opts, ids) {
                    if (!ids.current) return;
                    for (var i = 0; i < ids.current.length; i++) {
                        __this.Get(opts.villageId, ids.current[i], callback);
                    }
                });
            }
            this.Get = function (villageId, polylineId, callback) {
                AsynService.Get(http_contract.village.polyline.get(villageId, polylineId),
                    { villageId: villageId, polylineId: polylineId }
                    , function (opts, polyline) {
                        polyline = new CesiumDataController.Polyline().Instantiate(polyline);
                        polyline.that = that;
                        Cache.Polyline[opts.polylineId] = polyline;
                        callback(polyline);
                    });
            }
        }

        this.Asyn = new AsynController();

    }

    function EllipsoidController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() };
            if (villageId) {
                var url = http_contract.village.ellipsoid.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.ellipsoid.ids(villageId));
        }



        this.List = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            var ellipsoids = {};
            if (!ids[buildingId]) return ellipsoids;
            if (!ids[buildingId][floorId]) return ellipsoids;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                var id = ids[buildingId][floorId][i];
                try {
                    var ellipsoid = _this.Get(villageId, buildingId, floorId, id);
                    ellipsoids[id] = ellipsoid;
                    Cache.Ellipsoid[id] = ellipsoid;
                } catch (ex) {
                    console.error(id, ex);
                }
            }
            return ellipsoids;
        }

        this.All = function () {
            return Cache.Ellipsoid;
        }
        this.GetById = function (ellipsoidId) {
            if (Cache.Ellipsoid[ellipsoidId])
                return Cache.Ellipsoid[ellipsoidId];
            var villages = that.Village.List();
            for (var villageId in villages) {
                var buildingIds = that.Building.GetIds(villageId);
                for (var i = 0; i < buildingIds.length; i++) {
                    var buildingId = buildingIds[i];
                    var floorIds = that.Floor.GetIds(villageId, buildingId);
                    for (var j = 0; j < floorIds.length; j++) {
                        var floorId = floorIds[j];
                        var ellipsoidIds = that.Ellipsoid.GetIds(villageId, buildingId, floorId);
                        if (!ellipsoidIds[buildingId] || !ellipsoidIds[buildingId][floorId] || ellipsoidIds[buildingId][floorId].indexOf(ellipsoidId) < 0)
                            continue;
                        return that.Ellipsoid.Get(villageId, buildingId, floorId, ellipsoidId);
                    }
                }
            }
            return null;
        }
        this.RemoveById = function (ellipsoidId) {
            var ellipsoid = _this.GetById(ellipsoidId);
            if (ellipsoid) {
                if (ellipsoid.villageId && ellipsoid.buildingId && ellipsoid.floorId) {
                    _this.Remove(ellipsoid.villageId, ellipsoid.buildingId, ellipsoid.floorId, ellipsoidId);
                    return true;
                }
                else if (ellipsoid.villageId) {
                    that.Village.Ellipsoid.Remove(ellipsoid.villageId, ellipsoidId);
                    return true;
                }
                else { }
            }
        }
        this.Get = function (villageId, buildingId, floorId, ellipsoidId, isNew) {
            if (!isNew && Cache.Ellipsoid[ellipsoidId])
                return Cache.Ellipsoid[ellipsoidId];

            var ellipsoid = Service.Get(http_contract.village.building.floor.ellipsoid.get(villageId, buildingId, floorId, ellipsoidId));
            ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
            ellipsoid.that = that;
            Cache.Ellipsoid[ellipsoidId] = ellipsoid;
            return ellipsoid;
        }
        this.Create = function (villageId, buildingId, floorId, ellipsoidId, ellipsoid) {
            ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
            ellipsoid.parentId = floorId;
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId])
                ids[buildingId] = {};
            if (!ids[buildingId][floorId])
                ids[buildingId][floorId] = new Array();
            ids[buildingId][floorId].push(ellipsoidId);
            setIds(villageId, ids);
            Service.Post(ellipsoid, dir_contract.village.building.floor.ellipsoid.get(villageId, buildingId, floorId, ellipsoidId));
            Cache.Ellipsoid[ellipsoidId] = ellipsoid;
            return true;
        }
        this.Update = function (villageId, buildingId, floorId, ellipsoidId, ellipsoid) {
            ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
            Service.Post(ellipsoid, dir_contract.village.building.floor.ellipsoid.get(villageId, buildingId, floorId, ellipsoidId));
            Cache.Ellipsoid[ellipsoidId] = ellipsoid;
            return true;
        }
        this.Remove = function (villageId, buildingId, floorId, ellipsoidId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            var index = ids[buildingId][floorId].indexOf(ellipsoidId);
            if (index < 0) return;
            Service.Delete(dir_contract.village.building.floor.ellipsoid.get(villageId, buildingId, floorId, ellipsoidId));

            ids[buildingId][floorId].splice(index, 1);

            setIds(villageId, ids);

            delete Cache.Ellipsoid[ellipsoidId];
            return true;
        }
        this.Clear = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                _this.Remove(villageId, buildingId, floorId, ids[buildingId][floorId][i]);
            }

        }

        function AsynController() {
            var __this = this;

            this.GetIds = function (villageId, buildingId, floorId, callback) {
                var url = http_contract.village.ellipsoid.ids(villageId);
                AsynService.Get(url,
                    { villageId: villageId, buildingId: buildingId, floorId: floorId },
                    callback,
                    function (opts) {
                        setIds(opts.villageId, opts.buildingId, opts.floorId, { current: new Array() }, function (opts) {
                            callback(opts, new Array());
                        })
                    });
            }
            function setIds(villageId, buildingId, floorId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.ellipsoid.ids(villageId), { villageId: villageId, buildingId: buildingId, floorId: floorId }, callback);
            }

            this.Get = function (villageId, buildingId, floorId, ellipsoidId, callback) {
                AsynService.Get(http_contract.village.building.floor.ellipsoid.get(villageId, buildingId, floorId, ellipsoidId),
                    {
                        villageId: villageId, buildingId: buildingId, floorId: floorId, ellipsoidId: ellipsoidId
                    },
                    function (opts, ellipsoid) {
                        ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
                        ellipsoid.that = that;
                        Cache.Ellipsoid[opts.ellipsoidId] = ellipsoid;
                        callback(ellipsoid);
                    });
            }


            this.List = function (villageId, buildingId, floorId, callback) {
                __this.GetIds(villageId, buildingId, floorId, function (opts, ids) {
                    if (!ids[opts.buildingId]) {
                        return;
                    }
                    if (!ids[opts.buildingId][opts.floorId]) {
                        return;
                    }
                    for (var i = 0; i < ids[opts.buildingId][opts.floorId].length; i++) {
                        var id = ids[opts.buildingId][opts.floorId][i];
                        __this.Get(opts.villageId, opts.buildingId, opts.floorId, id, callback);
                    }
                });
            }
        }


        this.Asyn = new AsynController();

    }
    function VillageEllipsoidController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() }
            if (villageId) {
                var url = http_contract.village.ellipsoid.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.ellipsoid.ids(villageId));
        }


        this.List = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            var ellipsoids = {};

            for (var i = 0; i < ids.current.length; i++) {
                var id = ids.current[i];
                try {
                    var ellipsoid = _this.Get(villageId, id);
                    ellipsoids[id] = ellipsoid;
                    Cache.Ellipsoid[id] = ellipsoid;
                } catch (ex) {
                    console.error(id, ex);
                }
            }

            return ellipsoids;
        }
        this.Get = function (villageId, ellipsoidId, isNew) {
            if (!isNew && Cache.Ellipsoid[ellipsoidId])
                return Cache.Ellipsoid[ellipsoidId];

            var ellipsoid = Service.Get(http_contract.village.ellipsoid.get(villageId, ellipsoidId));
            ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
            ellipsoid.that = that;
            Cache.Ellipsoid[ellipsoidId] = ellipsoid;
            return ellipsoid;
        }
        this.Create = function (villageId, ellipsoidId, ellipsoid) {
            ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
            ellipsoid.parentId = villageId;
            var ids = _this.GetIds(villageId);
            if (!ids.current)
                ids.current = new Array();
            ids.current.push(ellipsoidId);
            setIds(villageId, ids);
            Service.Post(ellipsoid, dir_contract.village.ellipsoid.get(villageId, ellipsoidId));
            Cache.Ellipsoid[ellipsoidId] = ellipsoid;
            return true;
        }
        this.Update = function (villageId, ellipsoidId, ellipsoid) {
            ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
            Service.Post(ellipsoid, dir_contract.village.ellipsoid.get(villageId, ellipsoidId));
            Cache.Ellipsoid[ellipsoidId] = ellipsoid;
            return true;
        }
        this.Remove = function (villageId, ellipsoidId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return false;
            var index = ids.current.indexOf(ellipsoidId);
            if (index < 0) return;

            Service.Delete(dir_contract.village.ellipsoid.get(villageId, ellipsoidId));

            ids.current.splice(index, 1);
            setIds(villageId, ids);

            delete Cache.Ellipsoid[ellipsoidId];
            return true;
        }
        this.Clear = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            for (var i = 0; i < ids.current.length; i++) {
                _this.Remove(villageId, ids.current[i]);
            }
        }

        function AsynController() {
            var __this = this;
            this.GetIds = function (villageId, callback) {
                var url = http_contract.village.ellipsoid.ids(villageId);
                AsynService.Get(url, { villageId: villageId }, callback, function (opts) {
                    setIds(opts.villageId, { current: new Array() }, function (opts) {
                        callback(opts, new Array());
                    })
                });
            }
            function setIds(villageId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.ellipsoid.ids(villageId), { villageId: villageId }, callback);
            }


            this.List = function (villageId, callback) {
                __this.GetIds(villageId, function (opts, ids) {
                    if (!ids.current) return;
                    for (var i = 0; i < ids.current.length; i++) {
                        __this.Get(opts.villageId, ids.current[i], callback);
                    }
                });
            }
            this.Get = function (villageId, ellipsoidId, callback) {
                AsynService.Get(http_contract.village.ellipsoid.get(villageId, ellipsoidId),
                    { villageId: villageId, ellipsoidId: ellipsoidId }
                    , function (opts, ellipsoid) {
                        ellipsoid = new CesiumDataController.Ellipsoid().Instantiate(ellipsoid);
                        ellipsoid.that = that;
                        Cache.Ellipsoid[opts.ellipsoidId] = ellipsoid;
                        callback(ellipsoid);
                    });
            }
        }

        this.Asyn = new AsynController();

    }



    function PolygonController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() };
            if (villageId) {
                var url = http_contract.village.polygon.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.polygon.ids(villageId));
        }



        this.List = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            var polygons = {};
            if (!ids[buildingId]) return polygons;
            if (!ids[buildingId][floorId]) return polygons;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                var id = ids[buildingId][floorId][i];
                try {
                    var polygon = _this.Get(villageId, buildingId, floorId, id);
                    polygons[id] = polygon;
                    Cache.Polygon[id] = polygon;
                } catch (ex) {
                    console.error(id, ex);
                }
            }
            return polygons;
        }

        this.All = function () {
            return Cache.Polygon;
        }
        this.GetById = function (polygonId) {
            if (Cache.Polygon[polygonId])
                return Cache.Polygon[polygonId];
            var villages = that.Village.List();
            for (var villageId in villages) {
                var buildingIds = that.Building.GetIds(villageId);
                for (var i = 0; i < buildingIds.length; i++) {
                    var buildingId = buildingIds[i];
                    var floorIds = that.Floor.GetIds(villageId, buildingId);
                    for (var j = 0; j < floorIds.length; j++) {
                        var floorId = floorIds[j];
                        var polygonIds = that.Polygon.GetIds(villageId, buildingId, floorId);
                        if (!polygonIds[buildingId] || !polygonIds[buildingId][floorId] || polygonIds[buildingId][floorId].indexOf(polygonId) < 0)
                            continue;
                        return that.Polygon.Get(villageId, buildingId, floorId, polygonId);
                    }
                }
            }
            return null;
        }
        this.RemoveById = function (polygonId) {
            var polygon = _this.GetById(polygonId);
            if (polygon) {
                if (polygon.villageId && polygon.buildingId && polygon.floorId) {
                    _this.Remove(polygon.villageId, polygon.buildingId, polygon.floorId, polygonId);
                    return true;
                }
                else if (polygon.villageId) {
                    that.Village.Polygon.Remove(polygon.villageId, polygonId);
                    return true;
                }
                else { }
            }
        }
        this.Get = function (villageId, buildingId, floorId, polygonId, isNew) {
            if (!isNew && Cache.Polygon[polygonId])
                return Cache.Polygon[polygonId];

            var polygon = Service.Get(http_contract.village.building.floor.polygon.get(villageId, buildingId, floorId, polygonId));
            polygon = new CesiumDataController.Polygon().Instantiate(polygon);
            polygon.that = that;
            Cache.Polygon[polygonId] = polygon;
            return polygon;
        }
        this.Create = function (villageId, buildingId, floorId, polygonId, polygon) {
            polygon = new CesiumDataController.Polygon().Instantiate(polygon);
            polygon.parentId = floorId;
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId])
                ids[buildingId] = {};
            if (!ids[buildingId][floorId])
                ids[buildingId][floorId] = new Array();
            ids[buildingId][floorId].push(polygonId);
            setIds(villageId, ids);
            Service.Post(polygon, dir_contract.village.building.floor.polygon.get(villageId, buildingId, floorId, polygonId));
            Cache.Polygon[polygonId] = polygon;
            return true;
        }
        this.Update = function (villageId, buildingId, floorId, polygonId, polygon) {
            polygon = new CesiumDataController.Polygon().Instantiate(polygon);
            Service.Post(polygon, dir_contract.village.building.floor.polygon.get(villageId, buildingId, floorId, polygonId));
            Cache.Polygon[polygonId] = polygon;
            return true;
        }
        this.Remove = function (villageId, buildingId, floorId, polygonId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            var index = ids[buildingId][floorId].indexOf(polygonId);
            if (index < 0) return;
            Service.Delete(dir_contract.village.building.floor.polygon.get(villageId, buildingId, floorId, polygonId));

            ids[buildingId][floorId].splice(index, 1);

            setIds(villageId, ids);

            delete Cache.Polygon[polygonId];
            return true;
        }
        this.Clear = function (villageId, buildingId, floorId) {
            var ids = _this.GetIds(villageId);
            if (!ids[buildingId]) return false;
            if (!ids[buildingId][floorId]) return false;

            for (var i = 0; i < ids[buildingId][floorId].length; i++) {
                _this.Remove(villageId, buildingId, floorId, ids[buildingId][floorId][i]);
            }

        }

        function AsynController() {
            var __this = this;

            this.GetIds = function (villageId, buildingId, floorId, callback) {
                var url = http_contract.village.polygon.ids(villageId);
                AsynService.Get(url,
                    { villageId: villageId, buildingId: buildingId, floorId: floorId },
                    callback,
                    function (opts) {
                        setIds(opts.villageId, opts.buildingId, opts.floorId, { current: new Array() }, function (opts) {
                            callback(opts, new Array());
                        })
                    });
            }
            function setIds(villageId, buildingId, floorId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.polygon.ids(villageId), { villageId: villageId, buildingId: buildingId, floorId: floorId }, callback);
            }

            this.Get = function (villageId, buildingId, floorId, polygonId, callback) {
                AsynService.Get(http_contract.village.building.floor.polygon.get(villageId, buildingId, floorId, polygonId),
                    {
                        villageId: villageId, buildingId: buildingId, floorId: floorId, polygonId: polygonId
                    },
                    function (opts, polygon) {
                        polygon = new CesiumDataController.Polygon().Instantiate(polygon);
                        polygon.that = that;
                        Cache.Polygon[opts.polygonId] = polygon;
                        callback(polygon);
                    });
            }


            this.List = function (villageId, buildingId, floorId, callback) {
                __this.GetIds(villageId, buildingId, floorId, function (opts, ids) {
                    if (!ids[opts.buildingId]) {
                        return;
                    }
                    if (!ids[opts.buildingId][opts.floorId]) {
                        return;
                    }
                    for (var i = 0; i < ids[opts.buildingId][opts.floorId].length; i++) {
                        var id = ids[opts.buildingId][opts.floorId][i];
                        __this.Get(opts.villageId, opts.buildingId, opts.floorId, id, callback);
                    }
                });
            }
        }


        this.Asyn = new AsynController();

    }

    function VillagePolygonController() {
        var _this = this;


        this.GetIds = function (villageId) {
            var ids = { current: new Array() }
            if (villageId) {
                var url = http_contract.village.polygon.ids(villageId);
                try {
                    ids = Service.Get(url, true);
                } catch (ex) {
                    setIds(villageId, ids);
                }
            }
            return ids;
        }
        function setIds(villageId, ids) {
            Service.Post(ids, dir_contract.village.polygon.ids(villageId));
        }


        this.List = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            var polygons = {};

            for (var i = 0; i < ids.current.length; i++) {
                var id = ids.current[i];
                try {
                    var polygon = _this.Get(villageId, id);
                    polygons[id] = polygon;
                    Cache.Polygon[id] = polygon;
                } catch (ex) {
                    console.error(id, ex);
                }
            }

            return polygons;
        }
        this.Get = function (villageId, polygonId, isNew) {
            if (!isNew && Cache.Polygon[polygonId])
                return Cache.Polygon[polygonId];

            var polygon = Service.Get(http_contract.village.polygon.get(villageId, polygonId));
            polygon = new CesiumDataController.Polygon().Instantiate(polygon);
            polygon.that = that;
            Cache.Polygon[polygonId] = polygon;
            return polygon;
        }
        this.Create = function (villageId, polygonId, polygon) {
            polygon = new CesiumDataController.Polygon().Instantiate(polygon);
            polygon.parentId = villageId;
            var ids = _this.GetIds(villageId);
            if (!ids.current)
                ids.current = new Array();
            ids.current.push(polygonId);
            setIds(villageId, ids);
            Service.Post(polygon, dir_contract.village.polygon.get(villageId, polygonId));
            Cache.Polygon[polygonId] = polygon;
            return true;
        }
        this.Update = function (villageId, polygonId, polygon) {
            polygon = new CesiumDataController.Polygon().Instantiate(polygon);
            Service.Post(polygon, dir_contract.village.polygon.get(villageId, polygonId));
            Cache.Polygon[polygonId] = polygon;
            return true;
        }
        this.Remove = function (villageId, polygonId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return false;
            var index = ids.current.indexOf(polygonId);
            if (index < 0) return;

            Service.Delete(dir_contract.village.polygon.get(villageId, polygonId));

            ids.current.splice(index, 1);
            setIds(villageId, ids);

            delete Cache.Polygon[polygonId];
            return true;
        }
        this.Clear = function (villageId) {
            var ids = _this.GetIds(villageId);
            if (!ids.current) return;
            for (var i = 0; i < ids.current.length; i++) {
                _this.Remove(villageId, ids.current[i]);
            }
        }

        function AsynController() {
            var __this = this;
            this.GetIds = function (villageId, callback) {
                var url = http_contract.village.polygon.ids(villageId);
                AsynService.Get(url, { villageId: villageId }, callback, function (opts) {
                    setIds(villageId, { current: new Array() }, function (opts) {
                        callback(opts, new Array());
                    })
                });
            }
            function setIds(villageId, ids, callback) {
                AsynService.Post(ids, dir_contract.village.polygon.ids(villageId), { villageId: villageId }, callback);
            }


            this.List = function (villageId, callback) {
                __this.GetIds(villageId, function (opts, ids) {
                    if (!ids.current) return;
                    for (var i = 0; i < ids.current.length; i++) {
                        __this.Get(opts.villageId, ids.current[i], callback);
                    }
                });
            }
            this.Get = function (villageId, polygonId, callback) {
                AsynService.Get(http_contract.village.polygon.get(villageId, polygonId),
                    { villageId: villageId, polygonId: polygonId }
                    , function (opts, polygon) {
                        polygon = new CesiumDataController.Polygon().Instantiate(polygon);
                        polygon.that = that;
                        Cache.Polygon[opts.polygonId] = polygon;
                        callback(polygon);
                    });
            }
        }

        this.Asyn = new AsynController();

    }





    var Cache = {
        Village: {},
        Building: {},
        Floor: {},
        Point: {},
        Polyline: {},
        Ellipsoid: {},
        Polygon: {}
    }



    this.Village = new VillageController();
    this.Building = new BuildingController();
    this.Floor = new FloorController();
    this.Point = new PointController();
    this.Village.Point = new VillagePointController();
    this.Polyline = new PolylineController();
    this.Village.Polyline = new VillagePolylineController();
    this.Ellipsoid = new EllipsoidController();
    this.Village.Ellipsoid = new VillageEllipsoidController();
    this.Polygon = new PolygonController();
    this.Village.Polygon = new VillagePolygonController();
    // var Load = function () {
    //     var villages, buildings, floors, points;

    //     villages = that.Village.List();
    //     for (var villageId in villages) {

    //         try {
    //             buildings = that.Building.List(villageId);
    //             if (!buildings) continue;
    //             for (var buildingId in buildings) {
    //                 try {
    //                     Cache.Building[buildingId] = buildings[buildingId];
    //                     floors = that.Floor.List(villageId, buildingId);
    //                     if (!floors) continue;
    //                     for (var floorId in floors) {
    //                         try {
    //                             Cache.Floor[floorId] = floors[floorId];
    //                             points = that.Point.List(villageId, buildingId, floorId);
    //                             if (!points) continue;
    //                             for (var pointId in points) {
    //                                 Cache.Point[pointId] = points[pointId];
    //                             }
    //                         } catch (ex) {
    //                             console.error(ex);
    //                         }
    //                         try {
    //                             polylines = that.Polyline.List(villageId, buildingId, floorId);
    //                             if (!polylines) continue;
    //                             for (var polylineId in polylines) {
    //                                 Cache.Polyline[polylineId] = polylines[polylineId];

    //                             }
    //                         } catch (ex) {
    //                             console.error(ex);
    //                         }
    //                     }
    //                 } catch (ex) {
    //                     console.error(ex);
    //                 }
    //             }
    //             try {
    //                 points = that.Village.Point.List(villageId);
    //                 for (var pointId in points) {
    //                     Cache.Point[pointId] = points[pointId];
    //                 }
    //             } catch (ex) {
    //                 console.error(ex);
    //             }
    //             try {
    //                 polylines = that.Village.Polyline.List(villageId);
    //                 for (var polylineId in polylines) {
    //                     Cache.Polyline[polylineId] = polylines[polylineId];
    //                 }
    //             } catch (ex) {
    //                 console.error(ex);
    //             }

    //         } catch (ex) {
    //             console.error(ex);
    //         }
    //     }
    //     console.log("CesiumDataController Loaded:" + (end - start));
    //     console.log("count:"+count);
    //     if (onloaded)
    //         onloaded();
    // }

    var Load = function () {
        that.Village.Asyn.List(function (village) {
            var villageId = village.id;
            try {
                that.Building.Asyn.List(villageId, function (building) {
                    if (building) {
                        var buildingId = building.id;
                        try {
                            that.Floor.Asyn.List(villageId, buildingId, function (floor) {
                                if (floor) {
                                    var floorId = floor.id;
                                    try {
                                        that.Point.Asyn.List(villageId, buildingId, floorId, function (point) { });
                                    } catch (ex) {
                                        console.error(ex);
                                    }
                                    try {
                                        that.Polyline.Asyn.List(villageId, buildingId, floorId, function (polyline) { });
                                    } catch (ex) {
                                        console.error(ex);
                                    }
                                    try {
                                        that.Ellipsoid.Asyn.List(villageId, buildingId, floorId, function (ellipsoid) { });
                                    } catch (ex) {
                                        console.error(ex);
                                    }
                                    try {
                                        that.Polygon.Asyn.List(villageId, buildingId, floorId, function (polygon) { });
                                    } catch (ex) {
                                        console.error(ex);
                                    }
                                }
                            });
                        } catch (ex) {
                            console.error(ex);
                        }
                    }
                });
            } catch (ex) {
                console.error(ex);
            }
            try {
                that.Village.Point.Asyn.List(villageId, function (point) { });
            } catch (ex) { console.error(ex); }
            try {
                that.Village.Polyline.Asyn.List(villageId, function (polyline) { });
            } catch (ex) { console.error(ex); }
            try {
                that.Village.Ellipsoid.Asyn.List(villageId, function (ellipsoid) { });
            } catch (ex) { console.error(ex); }
            try {
                that.Village.Polygon.Asyn.List(villageId, function (polygon) { });
            } catch (ex) { console.error(ex); }
        });

    }






    //Load();
    var end = new Date();
    console.log("CesiumDataController:" + (end - start));

    this.OnLoaded = function () {


        isInit = false;

        var end = new Date();

        console.log("CesiumDataController Loaded:" + (end - start));
        if (onloaded)
            onloaded();
    }
    setTimeout(function () {
        var end = new Date();
        console.log("CesiumDataController Loading:" + (end - start));
        Load();
        end = new Date();
        console.log("CesiumDataController Loaded:" + (end - start));
    }, 3000);


}

























































































//元素类型
CesiumDataController.ElementType = {
    Village: "village",                 //小区
    Building: "building",               //建筑物
    Floor: "floor",                     //楼层
    Entrance: "entrance",               //出入口
    Camera: "camera",                   //摄像机
    Annunciator: "annunciator",         //报警器
    Sensor: "sensor",                   //传感器
    ElevatorShaft: "elevatorShaft",     //电梯井
    Elevator: "elevator",               //电梯
    ParkingLot: "parkingLot",           //停车场
    MissionPoint: "missionPoint",       //巡更点
    Person: "person",                   //人
    Vehicle: "vehicle",                 //车
    Shape: "shape",                     //面结构,    
    Polyline: "polyline",               //多线段
    Polygon: "polygon",                  //多边形
    Ellipse: "ellipse",                 //圆球
    WaterQuality: "waterQuality",        //水质
    DumpingCamera: "dumpingCamera",      //垃圾倾倒检测
    GarbageClassificationCamera: "garbageClassificationCamera"//垃圾分类


};

CesiumDataController.ShapeType = {
    Building: "building",               //建筑物	
    Entrance: "entrance",               //出入口	
    Stairway: "stairway",               //楼梯	
    Elevator: "elevator",               //电梯	
    Escalator: "escalator",             //自动扶梯
    ParkingLot: "parkingLot",           //停车场	
    ParkingSpace: "parkingSpace",       //停车位
    Shop: "shop",                       //购物	
    Restaurant: "restaurant",           //餐厅、饭店	
    Recreation: "recreation",           //娱乐	
    Room: "room",                       //普通房间	
    SpecialRoom: "specialRoom",         //专用房间（如：机房、配电间等）	
    Toilet: "toilet",                   //厕所	
    ServiceCenter: "serviceCenter",     //服务中心	
    Office: "office",                   //办公室
    Wall: "wall",                       //墙
    Road: "road",                       //道路	
    Water: "water",                     //水池等	
    Grass: "grass",                     //绿化	
    Floor: "floor",
    Other: "other",                     //其他	
}


//模型类型
CesiumDataController.ModelType = {
    Json: "json",
    Glb: "glb",
    Image: "img"
}
//报警等级
CesiumDataController.AlarmColor = {
    "1": "red",
    "2": "orange"
}

CesiumDataController.ViewMode = {
    auto: 0,
    three: 1,
    birld: 2
}
CesiumDataController.InnerElementType = {
    Point: "Point",
    Polyline: "Polyline",
    Ellipsoid: "Ellipsoid"
}


// 经纬度坐标
CesiumDataController.Position = function (lon, lat, height) {
    var _this = this;
    var _lat = 0.0;
    this.__defineGetter__("lat", function () { return _lat; });
    this.__defineSetter__("lat", function (val) { _lat = val; });

    var _lon = 0.0;
    this.__defineGetter__("lon", function () { return _lon; });
    this.__defineSetter__("lon", function (val) { _lon = val; });

    var _height = 0.0;
    this.__defineGetter__("height", function () { return _height; });
    this.__defineSetter__("height", function (val) { _height = val; });

    if (lon) _lon = lon;
    if (lat) _lat = lat;
    if (height) _height = height;


}
//  过滤多余数据
CesiumDataController.Position.prototype.Instantiate = function (obj) {
    if (obj) {
        for (var key in this) {
            if (obj[key]) {
                this[key] = parseFloat(obj[key]);
            }
        }
    }
    return this;
}
//  建筑信息
CesiumDataController.BuildingInformation = function () {
    var _height = 0.0;
    this.__defineGetter__("height", function () { return _height; });
    this.__defineSetter__("height", function (val) { _height = val; });

    var _maxFloorNumber = 0;
    this.__defineGetter__("maxFloorNumber", function () { return _maxFloorNumber; });
    this.__defineSetter__("maxFloorNumber", function (val) { _maxFloorNumber = val; });
}
//  电梯
CesiumDataController.Elevator = function (id) {
    CesiumDataController.Element.call(this, id, CesiumDataController.ElementType.Elevator);
}
//  模型样式
CesiumDataController.ModelStyle = function () {

    var _alpha = 1;
    this.__defineGetter__("alpha", function () { return _alpha; });
    this.__defineSetter__("alpha", function (val) { _alpha = val; });

    var _fill;
    this.__defineGetter__("fill", function () { return _fill; });
    this.__defineSetter__("fill", function (val) { _fill = val; });

    var _silhouetteColor;
    this.__defineGetter__("silhouetteColor", function () { return _silhouetteColor; });
    this.__defineSetter__("silhouetteColor", function (val) { _silhouetteColor = val; });

    var _silhouetteSize = 0;
    this.__defineGetter__("silhouetteSize", function () { return _silhouetteSize; });
    this.__defineSetter__("silhouetteSize", function (val) { _silhouetteSize = val; });
}

CesiumDataController.BaseElement = function (id) {

    var _id = id;
    this.__defineGetter__("id", function () { return _id; });
    this.__defineSetter__("id", function (val) { _id = val; });


    var _parentId;
    this.__defineGetter__("parentId", function () { return _parentId; });
    this.__defineSetter__("parentId", function (val) { _parentId = val; });


    var _name = "";
    this.__defineGetter__("name", function () { return _name; });
    this.__defineSetter__("name", function (val) { _name = val; });

    var _position = new CesiumDataController.Position();
    this.__defineGetter__("position", function () { return _position; });
    this.__defineSetter__("position", function (val) { _position = val; });
}
//  实例化 过滤多余得数据
CesiumDataController.BaseElement.prototype.Instantiate = function (obj) {
    if (obj) {
        for (var key in this) {
            if (obj[key]) {
                try {
                    this[key] = obj[key];
                } catch (e) { }
            }
        }
    }
    return this;
}

//  基本元素
CesiumDataController.Element = function (id, type) {
    CesiumDataController.BaseElement.call(this, id)
    var _this = this;


    var _modelStyle;
    this.__defineGetter__("modelStyle", function () { return _modelStyle; });
    this.__defineSetter__("modelStyle", function (val) { _modelStyle = val; });


    var _model = "";
    this.__defineGetter__("model", function () { return _model; });
    this.__defineSetter__("model", function (val) { _model = val; });
    function setModelByUrl(url) {
        if (url) {
            var index = url.lastIndexOf('.');
            var suffix = url.substring(index + 1);
            switch (suffix.toLowerCase()) {
                case CesiumDataController.ModelType.Json:
                    return CesiumDataController.ModelType.Json;
                case CesiumDataController.ModelType.Glb:
                    return CesiumDataController.ModelType.Glb;
                default:
                    return CesiumDataController.ModelType.Image;
            }
        }
    }


    var _url = "";
    this.__defineGetter__("url", function () { return _url; });
    this.__defineSetter__("url", function (val) {
        _url = val;
        _model = setModelByUrl(_url);
    });

    function setUrlByType(type) {
        switch (type) {
            case CesiumDataController.ElementType.Entrance:
                _this.url = "img/entrance.png";
                break;
            case CesiumDataController.ElementType.Camera:
                _this.url = "img/camera.png"
                break;
            case CesiumDataController.ElementType.Annunciator:
                _this.url = "img/annunciator.png";
                break;
            case CesiumDataController.ElementType.Sensor:
                _this.url = "img/sensor.png";
                break;
            case CesiumDataController.ElementType.MissionPoint:
                _this.url = "img/mission_point.png";
                break;
            case CesiumDataController.ElementType.Person:
                _this.url = "img/persion.png";
                break;
            case CesiumDataController.ElementType.Vehicle:
                _this.url = "img/vehicle.png";
                break;
            case CesiumDataController.ElementType.WaterQuality:
                _this.url = "img/water_quality.png";
                break;
            case CesiumDataController.ElementType.DumpingCamera:
                _this.url = "img/camera_dumping.png";
                break;
            case CesiumDataController.ElementType.GarbageClassificationCamera:
                _this.url = "img/camera_garbage_classification.png";
                break;
            case CesiumDataController.ElementType.ParkingLot:
                _this.url = "img/parking_lot.png";
                break;
            default:
                break;
        }
    }


    var _type = type;
    if (_type) setUrlByType(_type);
    this.__defineGetter__("type", function () { return _type; });
    this.__defineSetter__("type", function (val) {
        _type = val;
        if (_type && !_url) setUrlByType(_type);
    });





    var _radian;
    this.__defineGetter__("radian", function () { return _radian; });
    this.__defineSetter__("radian", function (val) { _radian = val; });


    var _scale = 1;
    this.__defineGetter__("scale", function () { return _scale; });
    this.__defineSetter__("scale", function (val) { _scale = val; });


    var _light;
    this.__defineGetter__("light", function () { return _light; });
    this.__defineSetter__("light", function (val) { _light = val; });


    var _defaultView;
    this.__defineGetter__("defaultView", function () { return _defaultView; });
    this.__defineSetter__("defaultView", function (val) { _defaultView = val; });

}



// 水平角度/垂直角度
CesiumDataController.HeadingPitch = function (heading, pitch) {

    var _heading = heading || 0;
    this.__defineGetter__("heading", function () { return _heading; });
    this.__defineSetter__("heading", function (val) { _heading = val; });


    var _pitch = pitch || 0;
    this.__defineGetter__("pitch", function () { return _pitch; });
    this.__defineSetter__("pitch", function (val) { _pitch = val; });

}
//  水平角度/垂直角度/范围
CesiumDataController.HeadingPitchRange = function (heading, pitch, range) {
    CesiumDataController.HeadingPitch.call(this, heading, pitch);

    var _range = range || 0;
    this.__defineGetter__("range", function () { return _range; });
    this.__defineSetter__("range", function (val) { _range = val; });

}
//  水平角度/垂直角度/自身旋转角度
CesiumDataController.HeadingPitchRoll = function (heading, pitch, roll) {
    CesiumDataController.HeadingPitch.call(this, heading, pitch);

    var _roll = roll || 0;
    this.__defineGetter__("roll", function () { return _roll; });
    this.__defineSetter__("roll", function (val) { _roll = val; });
}


//  建筑
CesiumDataController.Building = function (id) {
    CesiumDataController.Element.call(this, id, CesiumDataController.ElementType.Building);
    var _this = this;

    var _villageId = "";
    this.__defineGetter__("villageId", function () { return _villageId; });
    this.__defineSetter__("villageId", function (val) { _villageId = val; });

    var _information = new CesiumDataController.BuildingInformation();
    this.__defineGetter__("information", function () { return _information; });
    this.__defineSetter__("information", function (val) { _information = val; });


    var _showBackground = false;
    this.__defineGetter__("showBackground", function () { return _showBackground; });
    this.__defineSetter__("showBackground", function (val) { _showBackground = val; });


    this.floorsSpecified = false;
    this.__defineGetter__("floors", function () {
        if (_this.that) {
            return _this.that.Floor.List(_villageId, _this.id);
        }
        return null;
    });
    this.__defineSetter__("floors", function (val) { _floors = val; });


    var _children;
    this.__defineGetter__("children", function () { return _children; });
    this.__defineSetter__("children", function (val) { _children = val; });



}
//  楼层
CesiumDataController.Floor = function (buildingId, id) {
    CesiumDataController.Element.call(this, id, CesiumDataController.ElementType.Floor);
    var _this = this;

    var _villageId = "";
    this.__defineGetter__("villageId", function () { return _villageId; });
    this.__defineSetter__("villageId", function (val) { _villageId = val; });

    var _number = 0;
    this.__defineGetter__("number", function () { return _number; });
    this.__defineSetter__("number", function (val) { _number = val; });


    var _buildingId = buildingId;
    this.__defineGetter__("buildingId", function () { return _buildingId; });
    this.__defineSetter__("buildingId", function (val) { _buildingId = val; });


    function getInnerElements(innerElementType) {
        if (_this.that) {
            return _this.that[innerElementType].List(_villageId, _buildingId, _this.id);
        }
        return null;
    }

    this.parentSpecified = false;
    this.__defineGetter__("parent", function () {

        if (_this.that)
            return _this.that.Building.Get(this.villageId, this.buildingId);
        return null;
    });

    this.pointsSpecified = false;
    this.__defineGetter__("points", function () {
        return getInnerElements(CesiumDataController.InnerElementType.Point);
    });

    this.polylinesSpecified = false;
    this.__defineGetter__("polylines", function () {
        return getInnerElements(CesiumDataController.InnerElementType.Polyline);
    });

    this.ellipsoidsSpecified = false;
    this.__defineGetter__("ellipsoids", function () {
        return getInnerElements(CesiumDataController.InnerElementType.Ellipsoid);
    });







    var _showBackground = false;
    this.__defineGetter__("showBackground", function () { return _showBackground; });
    this.__defineSetter__("showBackground", function (val) { _showBackground = val; });
}
CesiumDataController.Floor.prototype.getGeoJson = function () {
    if (this.that) {
        return this.that.Floor.GetGeoJson(this);
    }
    return null;
}



//  点位
CesiumDataController.Point = function (id, type) {
    CesiumDataController.Element.call(this, id, type);

    var _villageId = "";
    this.__defineGetter__("villageId", function () { return _villageId; });
    this.__defineSetter__("villageId", function (val) { _villageId = val; });

    var _buildingId = "";
    this.__defineGetter__("buildingId", function () { return _buildingId; });
    this.__defineSetter__("buildingId", function (val) { _buildingId = val; });


    var _floorId = "";
    this.__defineGetter__("floorId", function () { return _floorId; });
    this.__defineSetter__("floorId", function (val) { _floorId = val; });
}
//多线段
CesiumDataController.Polyline = function (id) {
    CesiumDataController.BaseElement.call(this, id);

    var _villageId = "";
    this.__defineGetter__("villageId", function () { return _villageId; });
    this.__defineSetter__("villageId", function (val) { _villageId = val; });

    var _buildingId = "";
    this.__defineGetter__("buildingId", function () { return _buildingId; });
    this.__defineSetter__("buildingId", function (val) { _buildingId = val; });


    var _floorId = "";
    this.__defineGetter__("floorId", function () { return _floorId; });
    this.__defineSetter__("floorId", function (val) { _floorId = val; });


    var _positions = [];
    this.__defineGetter__("positions", function () { return _positions; });
    this.__defineSetter__("positions", function (val) { _positions = val; });

    var _color = "#00ff00";
    this.__defineGetter__("color", function () { return _color; });
    this.__defineSetter__("color", function (val) { _color = val; });

    var _alpha = 0.5;
    this.__defineGetter__("alpha", function () { return _alpha; });
    this.__defineSetter__("alpha", function (val) { _alpha = val; });

    var _extrudedHeight = 5;
    this.__defineGetter__("extrudedHeight", function () { return _extrudedHeight; });
    this.__defineSetter__("extrudedHeight", function (val) { _extrudedHeight = val; });

    var _width = 0.5;
    this.__defineGetter__("width", function () { return _width; });
    this.__defineSetter__("width", function (val) { _width = val; });


    //外边框线
    var _outline;
    this.__defineGetter__("outline", function () { return _outline; });
    this.__defineSetter__("outline", function (val) { _outline = val; });


    var _img = "";
    this.__defineGetter__("img", function () { return _img; });
    this.__defineSetter__("img", function (val) { _img = val; });

}
CesiumDataController.Polyline.FromOptions = function (opts) {

    if (!opts)
        return new CesiumDataController.Polyline(Guid.NewGuid().ToString("N"));

    if (!opts || !opts.id)
        opts.id = Guid.NewGuid().ToString("N");
    var polyline = new CesiumDataController.Polyline(opts.id);
    if (opts.name)
        polyline.name = opts.name;
    if (opts.color)
        polyline.color = opts.color;
    if (opts.alpha >= 0)
        polyline.alpha = opts.alpha;
    if (opts.width >= 0)
        polyline.width = opts.width;
    if (opts.extrudedHeight >=0)
        polyline.extrudedHeight = opts.extrudedHeight;


    if (opts.img) {
        polyline.img = opts.img;
    }

    return polyline;
}




//多线段
CesiumDataController.Polygon = function (id) {
    CesiumDataController.BaseElement.call(this, id);

    var _villageId = "";
    this.__defineGetter__("villageId", function () { return _villageId; });
    this.__defineSetter__("villageId", function (val) { _villageId = val; });

    var _buildingId = "";
    this.__defineGetter__("buildingId", function () { return _buildingId; });
    this.__defineSetter__("buildingId", function (val) { _buildingId = val; });


    var _floorId = "";
    this.__defineGetter__("floorId", function () { return _floorId; });
    this.__defineSetter__("floorId", function (val) { _floorId = val; });


    var _positions = [];
    this.__defineGetter__("positions", function () { return _positions; });
    this.__defineSetter__("positions", function (val) { _positions = val; });

    var _color = "#00ff00";
    this.__defineGetter__("color", function () { return _color; });
    this.__defineSetter__("color", function (val) { _color = val; });

    var _alpha = 0.5;
    this.__defineGetter__("alpha", function () { return _alpha; });
    this.__defineSetter__("alpha", function (val) { _alpha = val; });

    var _extrudedHeight = 5;
    this.__defineGetter__("extrudedHeight", function () { return _extrudedHeight; });
    this.__defineSetter__("extrudedHeight", function (val) { _extrudedHeight = val; });

    var _img = "";
    this.__defineGetter__("img", function () { return _img; });
    this.__defineSetter__("img", function (val) { _img = val; });

    //外边框线
    var _outline;
    this.__defineGetter__("outline", function () { return _outline; });
    this.__defineSetter__("outline", function (val) { _outline = val; });

}
CesiumDataController.Polygon.FromOptions = function (opts) {

    if (!opts.id)
        opts.id = Guid.NewGuid().ToString("N");
    var polygon = new CesiumDataController.Polygon(opts.id);
    if (opts.name)
        polygon.name = opts.name;
    if (opts.color)
        polygon.color = opts.color;
    if (opts.alpha >= 0)
        polygon.alpha = opts.alpha;
    if (opts.img)
        polygon.img = opts.img;
    if (opts.extrudedHeight)
        polygon.extrudedHeight = opts.extrudedHeight;
    return polygon;
}






//小区
CesiumDataController.Village = function (id) {
    CesiumDataController.Element.call(this, id, CesiumDataController.ElementType.Village);
    var _this = this;

    var _showBackground = false;
    this.__defineGetter__("showBackground", function () { return _showBackground; });
    this.__defineSetter__("showBackground", function (val) { _showBackground = val; });


    var _areas;
    this.__defineGetter__("areas", function () { return _areas; });
    this.__defineSetter__("areas", function (val) { _areas = val; });

    this.buildingsSpecified = false;
    var _buildings;
    this.__defineGetter__("buildings", function () {
        if (_this.that) {
            _buildings = _this.that.Building.List(_this.id);
        }
        return _buildings;
    });
    this.__defineSetter__("buildings", function (val) { _buildings = val; });


    function getInnerElements(innerElementType) {
        if (_this.that) {
            return _this.that.Village[innerElementType].List(_this.id);
        }
        return null;
    }

    this.pointsSpecified = false;
    this.__defineGetter__("points", function () {
        return getInnerElements(CesiumDataController.InnerElementType.Point);
    });


    this.polylinesSpecified = false;
    this.__defineGetter__("polylines", function () {
        return getInnerElements(CesiumDataController.InnerElementType.Polyline);
    });


    this.ellipsoidsSpecified = false;
    this.__defineGetter__("ellipsoids", function () {
        return getInnerElements(CesiumDataController.InnerElementType.Ellipsoid);
    });




    var _center = this.position;
    this.__defineGetter__("center", function () { return _center; });
    this.__defineSetter__("center", function (val) { _center = val; });


}
//面    形成各种形状得元素
CesiumDataController.Shape = function (id) {
    CesiumDataController.Element.call(this, id, CesiumDataController.ElementType.Shape);

    var _center;
    this.__defineGetter__("center", function () { return _center; });
    this.__defineSetter__("center", function (val) { _center = val; });


    var _areas;
    this.__defineGetter__("areas", function () { return _areas; });
    this.__defineSetter__("areas", function (val) { _areas = val; });


    var _shapeType = CesiumDataController.ShapeType.Other;
    this.__defineGetter__("shapeType", function () { return _shapeType; });
    this.__defineSetter__("shapeType", function (val) { _shapeType = val; });


    var _passable = false
    this.__defineGetter__("passable", function () { return _passable; });
    this.__defineSetter__("passable", function (val) { _passable = val; });


    var _floorHeight = 0.0;
    this.__defineGetter__("floorHeight", function () { return _floorHeight; });
    this.__defineSetter__("floorHeight", function (val) { _floorHeight = val; });
}
//光照
CesiumDataController.Light = function () {
    var lightColor = {
        white: [1, 1, 1],
        yellow: [3, 2, 0],
        gold: [4, 2, 0]
    };

    this.Get = function (color, level) {
        var result = lightColor.white;
        for (var i = 0; i < lightColor[color].length; i++) {
            result[i] = lightColor[color][i] * level;
        }
        return result;
    }
}
CesiumDataController.Light.Get = function (color, level) {


    var lightColor = {
        white: [1, 1, 1],
        yellow: [3, 2, 0],
        gold: [4, 2, 0]
    };


    var result = lightColor.white;
    for (var i = 0; i < lightColor[color].length; i++) {
        result[i] = lightColor[color][i] * level;
    }
    return result;
}


//光照颜色
CesiumDataController.LightColor = {
    yellow: "yellow",
    white: "white",
    gold: "gold"
}

//绘制参数
CesiumDataController.DrawOptions = function () {
    var _id;
    this.__defineGetter__("id", function () { return _id; });
    this.__defineSetter__("id", function (val) { _id = val; });

    var _name;
    this.__defineGetter__("name", function () { return _name; });
    this.__defineSetter__("name", function (val) { _name = val; });

    var _color;
    this.__defineGetter__("color", function () { return _color; });
    this.__defineSetter__("color", function (val) { _color = val; });

    var _alpha;
    this.__defineGetter__("alpha", function () { return _alpha; });
    this.__defineSetter__("alpha", function (val) { _alpha = val; });

}
CesiumDataController.DrawLineOptions = function () {
    CesiumDataController.DrawOptions.call(this)
    var _extrudedHeight;
    this.__defineGetter__("extrudedHeight", function () { return _extrudedHeight; });
    this.__defineSetter__("extrudedHeight", function (val) { _extrudedHeight = val; });

    var _width;
    this.__defineGetter__("width", function () { return _width; });
    this.__defineSetter__("width", function (val) { _width = val; });


    var _img;
    this.__defineGetter__("img", function () { return _img; });
    this.__defineSetter__("img", function (val) { _img = val; });
}
CesiumDataController.DrawPlaneOptions = function () {
    CesiumDataController.DrawOptions.call(this)
    var _extrudedHeight;
    this.__defineGetter__("extrudedHeight", function () { return _extrudedHeight; });
    this.__defineSetter__("extrudedHeight", function (val) { _extrudedHeight = val; });

    var _img;
    this.__defineGetter__("img", function () { return _img; });
    this.__defineSetter__("img", function (val) { _img = val; });
}

CesiumDataController.DrawEllipsoidOptions = function () {
    CesiumDataController.DrawOptions.call(this)
    var _hpr;
    this.__defineGetter__("hpr", function () { return _hpr; });
    this.__defineSetter__("hpr", function (val) { _hpr = val; });

    var _clock;
    this.__defineGetter__("clock", function () { return _clock; });
    this.__defineSetter__("clock", function (val) { _clock = val; });

    var _cone;
    this.__defineGetter__("cone", function () { return _cone; });
    this.__defineSetter__("cone", function (val) { _cone = val; });

    var _outline;
    this.__defineGetter__("outline", function () { return _outline; });
    this.__defineSetter__("outline", function (val) { _outline = val; });
}
CesiumDataController.Size = function (width, height) {
    var _width = width || 0;
    this.__defineGetter__("width", function () { return _width; });
    this.__defineSetter__("width", function (val) { _width = val; });

    var _height = height || 0;
    this.__defineGetter__("height", function () { return _height; });
    this.__defineSetter__("height", function (val) { _height = val; });
}

//二维坐标
CesiumDataController.XY = function (x, y) {
    var _x = x || 0;
    this.__defineGetter__("x", function () { return _x; });
    this.__defineSetter__("x", function (val) { _x = val; });

    var _y = y || 0;
    this.__defineGetter__("y", function () { return _y; });
    this.__defineSetter__("y", function (val) { _y = val; });
}
//三维坐标
CesiumDataController.XYZ = function (x, y, z) {
    CesiumDataController.XY.call(this, x, y);
    var _z = z || 0;
    this.__defineGetter__("z", function () { return _z; });
    this.__defineSetter__("z", function (val) { _z = val; });
}
//  范围值
CesiumDataController.Range = function (min, max) {

    var _min = min || 0;
    this.__defineGetter__("min", function () { return _min; });
    this.__defineSetter__("min", function (val) { _min = val; });

    var _max = max || 0;
    this.__defineGetter__("max", function () { return _max; });
    this.__defineSetter__("max", function (val) { _max = val; });
}
//形状外部边框线
CesiumDataController.Outline = function () {
    //宽度
    var _width = 1;
    this.__defineGetter__("width", function () { return _width; });
    this.__defineSetter__("width", function (val) { _width = val; });

    //颜色
    var _color = "#00feff";
    this.__defineGetter__("color", function () { return _color; });
    this.__defineSetter__("color", function (val) { _color = val; });

    //透明度
    var _alpha = 1;
    this.__defineGetter__("alpha", function () { return _alpha; });
    this.__defineSetter__("alpha", function (val) { _alpha = val; });

    //是否显示
    var _enabled = true;
    this.__defineGetter__("enabled", function () { return _enabled; });
    this.__defineSetter__("enabled", function (val) { _enabled = val; });
}

//圆球形状
CesiumDataController.Ellipsoid = function (id) {
    CesiumDataController.BaseElement.call(this, id);
    var _villageId = "";
    this.__defineGetter__("villageId", function () { return _villageId; });
    this.__defineSetter__("villageId", function (val) { _villageId = val; });

    var _buildingId = "";
    this.__defineGetter__("buildingId", function () { return _buildingId; });
    this.__defineSetter__("buildingId", function (val) { _buildingId = val; });

    var _floorId = "";
    this.__defineGetter__("floorId", function () { return _floorId; });
    this.__defineSetter__("floorId", function (val) { _floorId = val; });
    //半径
    var _radii = new CesiumDataController.XYZ();
    this.__defineGetter__("radii", function () { return _radii; });
    this.__defineSetter__("radii", function (val) { _radii = val; });

    //内径半径
    var _inner_radii = new CesiumDataController.XYZ(0.1, 0.1, 0.1);
    this.__defineGetter__("inner_radii", function () { return _inner_radii; });
    this.__defineSetter__("inner_radii", function (val) { _inner_radii = val; });

    //自身角度
    var _hpr = new CesiumDataController.HeadingPitchRoll();
    this.__defineGetter__("hpr", function () { return _hpr; });
    this.__defineSetter__("hpr", function (val) { _hpr = val; });

    //扇形展开角度 min:-360~360 max:-360~360
    var _clock = new CesiumDataController.Range(-45, 45);
    this.__defineGetter__("clock", function () { return _clock; });
    this.__defineSetter__("clock", function (val) { _clock = val; });

    //扇形垂直扇面角度, 从圆球顶部开始计算 min:0-180 max:0-180
    var _cone = new CesiumDataController.Range(80, 91);
    this.__defineGetter__("cone", function () { return _cone; });
    this.__defineSetter__("cone", function (val) { _cone = val; });

    //颜色
    var _color = "#00FEFF";
    this.__defineGetter__("color", function () { return _color; });
    this.__defineSetter__("color", function (val) { _color = val; });

    //透明度
    var _alpha = 0.3;
    this.__defineGetter__("alpha", function () { return _alpha; });
    this.__defineSetter__("alpha", function (val) { _alpha = val; });

    //外边框线
    var _outline = new CesiumDataController.Outline();
    this.__defineGetter__("outline", function () { return _outline; });
    this.__defineSetter__("outline", function (val) { _outline = val; });

}

CesiumDataController.Ellipsoid.FromOptions = function (opts) {
    if (!opts.id)
        opts.id = Guid.NewGuid().ToString("N");
    var ellipsoid = new CesiumDataController.Ellipsoid(opts.id);
    if (opts.name)
        ellipsoid.name = opts.name;
    if (opts.color)
        ellipsoid.color = opts.color;
    if (opts.alpha >= 0)
        ellipsoid.alpha = opts.alpha;
    if (opts.outline)
        ellipsoid.outline = opts.outline;
    if (opts.clock || opts.clock == 0)
        ellipsoid.clock = opts.clock;
    if (opts.cone || opts.cone == 0)
        ellipsoid.cone = opts.cone;
    if (opts.hpr)
        ellipsoid.hpr = opts.hpr;
    return ellipsoid;
}


//摄像机镜头范围
CesiumDataController.CameraLens = {
    //广角镜头
    wideAngle: new CesiumDataController.Range(-45, 45),
    //普通镜头
    normel: new CesiumDataController.Range(-30, 30),
    //长焦镜头
    telephoto: new CesiumDataController.Range(-15, 15)
}

inherits(CesiumDataController.HeadingPitchRange, CesiumDataController.HeadingPitch);
inherits(CesiumDataController.HeadingPitchRoll, CesiumDataController.HeadingPitch);
inherits(CesiumDataController.XYZ, CesiumDataController.XY);

inherits(CesiumDataController.Element, CesiumDataController.BaseElement);
inherits(CesiumDataController.Ellipsoid, CesiumDataController.BaseElement);
inherits(CesiumDataController.Polyline, CesiumDataController.BaseElement);
inherits(CesiumDataController.Polygon, CesiumDataController.BaseElement);

inherits(CesiumDataController.Point, CesiumDataController.Element);
inherits(CesiumDataController.Elevator, CesiumDataController.Element);
inherits(CesiumDataController.Shape, CesiumDataController.Element);
inherits(CesiumDataController.Village, CesiumDataController.Element);
inherits(CesiumDataController.Building, CesiumDataController.Element);
inherits(CesiumDataController.Floor, CesiumDataController.Element);

inherits(CesiumDataController.DrawLineOptions, CesiumDataController.DrawOptions);
inherits(CesiumDataController.DrawEllipsoidOptions, CesiumDataController.DrawOptions);
inherits(CesiumDataController.DrawPlaneOptions, CesiumDataController.DrawOptions);


CesiumDataController.Controller = function (host, port, onloaded) {
    return new CesiumDataController(host, port, onloaded);
}

//地图样式
CesiumDataController.MapStyle = {
    //亮
    light: 1,
    //暗
    dark: -1
}

CesiumDataController.GuideboardStyle = {
    Blue: {
        border: "#01edf5",
        background: "#112845b2",
        innerShadow: "#2d76ce99",
        line: "#1398C1"
    },
    Green: {
        border: "#60c560",
        background: "#3B4E32b2",
        innerShadow: "#56A90299",
        line: "#4b9516"
    },
    Red: {
        border: "#EC6A5C",
        background: "#3E4348b2",
        innerShadow: "#C6514699",
        line: "#995746"
    },
    Orange: {
        border: "#F6B352",
        background: "#383A3Fb2",
        innerShadow: "#F6865799",
        line: "#dd8554"
    }
}

//楼层显示模式
CesiumDataController.FloorModel = {
    //原始位置
    original: 0,
    //窗口
    window: 1

}

CesiumDataController.HeatmapData = function () {

    var _id = Guid.NewGuid("N").ToString();
    this.__defineGetter__("id", function () { return _id; });
    this.__defineSetter__("id", function (val) { _id = val; });

    var _position = new CesiumDataController.Position();
    this.__defineGetter__("position", function () { return _position; });
    this.__defineSetter__("position", function (val) { _position = val; });

    var _value = 0;
    this.__defineGetter__("value", function () { return _value; });
    this.__defineSetter__("value", function (val) { _value = val; });
}



import { SystemModeEnum } from "../../../common/tool/table-form-helper";
export class MenuTree {
    icon: string;
    an = false;
    title: string;
    nodes: { text: string, url: string }[];
    constructor(icon: string, title: string) {
        this.icon = icon;
        this.title = title;
        this.nodes = new Array();
    } 
}

export class MenuTreeMap{
    map:Map<SystemModeEnum, MenuTree[]>;
    init(){
        this.map = new Map<SystemModeEnum, MenuTree[]>();
        var menuTree = new Array<MenuTree>();
        var item = new MenuTree('howell-icon-device2', '平台');
        item.an = true;
        item.nodes.push({
            url: '/aiop/platform/platform-mgr',
            text: '平台管理'
        });
        item.nodes.push({
            url: '/aiop/platform/sr-service-mgr',
            text: '流转服务管理'
        });
        menuTree.push(item);
        item = new MenuTree('howell-icon-device2', '区域');
        item.nodes.push({
            text: '区域管理',
            url: '/aiop/regions/region-mgr'
        });
        menuTree.push(item);
        item = new MenuTree('howell-icon-device2', '设备管理');
        item.nodes.push({
            text: '监控点',
            url: '/aiop/resources/camera-mgr'
        });
        item.nodes.push({
            text: '编码器',
            url: '/aiop/resources/encode-device-mgr'
        });
        item.nodes.push({
            text: '监控点模型',
            url: '/aiop/resources/camera-ai-model-mgr'
        });
        menuTree.push(item);
        item = new MenuTree('howell-icon-device2', 'AI模型');
        item.nodes.push({
            text: 'AI模型列表',
            url: '/aiop/ai-models/ai-models-mgr'
        });
        menuTree.push(item);
        item = new MenuTree('howell-icon-device2', '事件');
        item.nodes.push({
            text: 'AI摄像机事件',
            url: '/aiop/event-history/ai-model-event'
        });
        menuTree.push(item);
        this.map.set(SystemModeEnum.aiopSet, menuTree);

        menuTree = new Array<MenuTree>();
        item = new MenuTree('howell-icon-device2', '监管平台');
        item.nodes.push({
            text: '垃圾厢房',
            url: '/aiop/garbage-station/index'
        });
        item.an = true;
        item.nodes.push({
            text: '垃圾厢房管理',
            url: '/aiop/garbage-station/garbage-station-mgr'
        });
        item.nodes.push({
            text: '摄像机布控',
            url: '/aiop/garbage-station/deploy-camera'
        });
        item.nodes.push({
            text: '垃圾厢房状态',
            url: '/aiop/garbage-station/full-trashcan'
        });
        item.nodes.push({
            text: '地图布控',
            url: '/aiop/garbage-station/map-deploy'
        });
        menuTree.push(item);
        this.map.set(SystemModeEnum.supervision, menuTree);

        menuTree = new Array<MenuTree>();
        item = new MenuTree('howell-icon-device2', '事件');
        item.an = true;
        item.nodes.push({
            text: '乱丢垃圾',
            url: '/aiop/event-history/illegal-drop-event'
        });
        menuTree.push(item); 
        this.map.set(SystemModeEnum.illegalDropEvent, menuTree);
    }
}


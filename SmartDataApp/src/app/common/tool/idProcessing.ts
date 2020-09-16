export class Id {

    Value: string;
    SystemId: SystemId;
    TypeId: string;
    ProjectId: string;
    DeviceId: string;
    NetworkId: string;
    ModuleId: ModuleId;

    public createSystemId(v) {
        var result = new SystemId();
        result.CountryId = v.substr(0, 2);
        result.ProvinceId = v.substr(2, 2);
        result.CityId = v.substr(4, 2);
        result.CountyId = v.substr(6, 2);
        return result;
    }

    public createModuleId(v) {
        var result = new ModuleId();
        result.Type = v.substr(0, 2);
        result.Area = v.substr(2, 2);
        result.No = v.substr(4, 4);
        return result;
    }

    public addZero(size) {
        var result = "";
        for (var i = 0; i < size; i++) {
            result += "0";
        }
        return result;
    }

    constructor(value: string) {
        this.Value = value;
        this.SystemId = this.createSystemId(value);
        this.TypeId = value.substr(8, 2);
        this.ProjectId = value.substr(10, 7);
        this.DeviceId = value.substr(17, 6);
        this.NetworkId = value.substr(23, 1);
        this.ModuleId = this.createModuleId(value.substr(24));
    }

    public getSystemId(zero: boolean) {
        var systemId = this.SystemId.CountryId + this.SystemId.ProvinceId + this.SystemId.CityId + this.SystemId.CountyId;
        if (!zero)
            return systemId + this.addZero(24);
        return systemId;
    }

    public getTypeId() {
        return this.getSystemId(true) + this.TypeId + this.addZero(22);
    }

    public getProjectId() {
        return this.getSystemId(true) + this.TypeId + this.ProjectId + this.addZero(15);
    }

    public getDeviceId() {
        return this.getSystemId(true) + this.TypeId + this.ProjectId + this.DeviceId + this.addZero(9);
    }

    public getNetworkId() {
        return this.getSystemId(true) + this.TypeId + this.ProjectId + this.DeviceId + this.NetworkId + this.addZero(8);
    }
}

export class ModuleId {

    Type: string;
    Area: string;
    No: string;

    constructor(options: {
        Type?: string,
        Area?: string,
        No?: string,
    } = {}) {
        this.Type = options.Type || '';
        this.Area = options.Area || '';
        this.No = options.No || '';
    }
}

export class SystemId {

    CountryId: string;
    ProvinceId: string;
    CityId: string;
    CountyId: string;

    constructor(options: {
        CountryId?: string,
        ProvinceId?: string,
        CityId?: string,
        CountyId?: string,
    } = {}) {
        this.CountryId = options.CountryId || '';
        this.ProvinceId = options.ProvinceId || '';
        this.CityId = options.CityId || '';
        this.CountyId = options.CountyId || '';
    }
}
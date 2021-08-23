import { Transform } from "class-transformer";
import { UserResourceType } from "./enum";
import { transformDate } from "./transformer";

export interface Page {
  PageIndex: number;
  PageSize: number;
  PageCount: number;
  RecordCount: number;
  TotalRecordCount: number;
}

export class PagedList<T> {
  Page: Page;
  Data: T[];
}

export class User {
  /// <signature>
  /// <summary>User</summary>
  /// <field name='Id' type='String'>唯一标识符 M</field>
  /// <field name='Username' type='String'>用户名 M</field>
  /// <field name='Password' type='String'>密码 O</field>
  /// <field name='PasswordHash' type='String'>密码HASH值 O</field>
  /// <field name='PasswordSalt' type='String'>密码SALT值 O</field>
  /// <field name='FirstName' type='String'>名字 O</field>
  /// <field name='LastName' type='String'>性 O</field>
  /// <field name='Gender' type='Int32'>性别 O</field>
  /// <field name='MobileNo' type='String'>手机号码 O</field>
  /// <field name='Email' type='String'>邮箱 O</field>
  /// <field name='Note' type='String'>描述信息 O</field>
  /// <field name='ExpiredTime' type='DateTime'>过期时间 M</field>
  /// <field name='CreateTime' type='DateTime'>创建时间 M</field>
  /// <field name='UpdateTime' type='DateTime'>更新时间 M</field>
  /// <field name='State' type='Int32'>0-正常 M</field>
  /// <field name='Role' type='Role[]'>用户角色列表 M</field>
  /// </signature>
  Id!: string;
  Username!: string;
  Password?: string;
  PasswordHash?: string;
  PasswordSalt?: string;
  FirstName?: string;
  LastName?: string;
  Gender?: number;
  MobileNo?: string;
  Email?: string;
  Note?: string;
  @Transform(transformDate)
  ExpiredTime!: string;
  @Transform(transformDate)
  CreateTime!: string;
  @Transform(transformDate)
  UpdateTime!: Date;
  State!: number;
  Role!: Role[];
  Resources?: UserResourceRole[];
  OffEvents?: number[];
}
export class Role {
  /// <signature>
  /// <summary>Role</summary>
  /// <field name='Id' type='String'>唯一标识符 M</field>
  /// <field name='Name' type='String'>角色名称 M</field>
  /// <field name='CreateTime' type='DateTime'>创建时间 M</field>
  /// <field name='UpdateTime' type='DateTime'>更新时间 M</field>
  /// <field name='PrivacyData' type='Int32'>隐私数据显示 M</field>
  /// <field name='UserData' type='Int32'>用户数据操作权限 M</field>
  /// <field name='StaticData' type='Int32'>静态数据操作权限 M</field>
  /// <field name='PictureData' type='Int32'>照片显示 M</field>
  /// </signature>
  Id: string;
  Name: string;
  CreateTime: string;
  UpdateTime: string;
  PrivacyData: number;
  UserData: number;
  StaticData: number;
  PictureData: number;
}
export class UserResourceRole {
  /**	String	资源ID	M	R */
  Id!: string;
  /**	String	资源名称	O	R */
  Name?: string;
  /**	Int32	资源类型，1-街道，2-居委，3-厢房，4-行政区	M	R */
  ResourceType!: UserResourceType;

  /**	Int32	资源标签，权限级别	M	R */
  RoleFlags!: number;
  /**	Boolean	开放全部的子节点资源	M	R */
  AllSubResources!: boolean;
  /**	ResourceRole[]	子资源列表	O	R */
  Resources?: UserResourceRole;
}

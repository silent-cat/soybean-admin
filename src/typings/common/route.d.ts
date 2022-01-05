/** 权限路由相关类型 */
declare namespace AuthRoute {
  /** 多级路由分割符号 */
  type RouteSplitMark = '_';

  /** 路由的key */
  type RouteKey =
    // 固定的路由
    | 'root' // 根路由
    | 'login'
    | 'not-found'
    | 'no-permission'
    | 'service-error'
    | 'not-found-page' // 捕获无效path的路由
    // 自定义路由
    | 'dashboard'
    | 'dashboard_analysis'
    | 'dashboard_workbench'
    | 'multi-menu'
    | 'multi-menu_first'
    | 'multi-menu_first_second'
    | 'about';

  /** 路由的path */
  type RoutePath =
    | '/'
    | Exclude<KeyToPath<RouteKey>, '/root' | 'not-found-page'>
    | SingleRouteParentPath
    | '/:pathMatch(.*)*';

  /**
   * 路由的组件
   * - layout - 基础布局，具有公共部分的布局
   * - blank - 空白布局
   * - multi - 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
   * - self - 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
   */
  type RouteComponent = 'layout' | 'blank' | 'multi' | 'self';

  /** 路由描述 */
  type RouteMeta = {
    /** 路由标题(可用来作document.title或者菜单的名称) */
    title: string;
    /** 路由的动态路径 */
    dynamicPath?: PathToDynamicPath<'/login'>;
    /** 作为单独路由的父级路由布局组件 */
    singleLayout?: Extract<RouteComponent, 'layout' | 'blank'>;
    /** 需要登录权限 */
    requiresAuth?: boolean;
    /** 哪些类型的用户有权限才能访问的路由 */
    permissions?: Auth.RoleType[];
    /** 缓存页面 */
    keepAlive?: boolean;
    /** 是否是空白布局 */
    blankLayout?: boolean;
    /** 菜单和面包屑对应的图标 */
    icon?: string;
    /** 是否在菜单中隐藏 */
    hide?: boolean;
    /** 路由顺序，可用于菜单的排序 */
    order?: number;
  };

  /** 单个路由的类型结构(后端返回此类型结构的路由) */
  interface Route {
    /** 路由名称(路由唯一标识) */
    name: RouteKey;
    /** 路由路径 */
    path: RoutePath;
    /** 路由重定向 */
    redirect?: RoutePath;
    /**
     * 路由组件
     * - layout: 基础布局，具有公共部分的布局
     * - blank: 空白布局
     * - multi: 多级路由布局(三级路由或三级以上时，除第一级路由和最后一级路由，其余的采用该布局)
     * - self: 作为子路由，使用自身的布局(作为最后一级路由，没有子路由)
     */
    component?: RouteComponent;
    /** 子路由 */
    children?: Route[];
    /** 路由描述 */
    meta: RouteMeta;
    /** 路由属性 */
    props?: boolean | Record<string, any> | ((to: any) => Record<string, any>);
  }

  /** 单独一级路由的key (单独路由需要添加一个父级路由用于应用布局组件) */
  type SingleRouteKey = Exclude<
    GetSingleRouteKey<RouteKey>,
    GetMultiRouteParentKey<RouteKey> | 'root' | 'not-found-page'
  >;
  /** 单独路由父级路由key */
  type SingleRouteParentKey = `${SingleRouteKey}-parent`;

  /** 单独路由path */
  type SingleRoutePath = KeyToPath<SingleRouteKey>;

  /** 单独路由父级路由path */
  type SingleRouteParentPath = KeyToPath<SingleRouteParentKey>;

  /** 路由key转换路由path */
  type KeyToPath<Key extends RouteKey> = Key extends `${infer Left}_${infer Right}`
    ? KeyToPath<`${Left}/${Right}`>
    : `/${Key}`;

  /** 路由path转换动态路径 */
  type PathToDynamicPath<Path extends RoutePath> =
    | `${Path}/:module`
    | `${Path}/:module(${string})`
    | `${Path}/:module(${string})?`;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type GetSingleRouteKey<Key extends RouteKey> = Key extends `${infer Left}${RouteSplitMark}${infer Right}`
    ? never
    : Key;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  type GetMultiRouteParentKey<Key extends RouteKey> = Key extends `${infer Left}${RouteSplitMark}${infer Right}`
    ? Left
    : never;
}
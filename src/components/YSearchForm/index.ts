import { VNode, Ref } from "vue"

export interface EnumProps {
  label?: string; // 选项框显示的文字
  value?: string | number | boolean | any[]; // 选项框值
  disabled?: boolean; // 是否禁用此选项
  tagType?: string; // 当 tag 为 true 时，此选择会指定 tag 显示类型
  children?: EnumProps[]; // 为树形选择时，可以通过 children 属性指定子选项
  [key: string]: any;
}
export type SearchType = "input" | "select" | "date-picker" | "time-picker" | "date-time-picker" | "cascader" | "checkbox" | "radio" | "switch" | "input-number" | "rate" | "slider" | "color-picker" | "upload" | "select-v2" | "transfer" | "tree-select" | "time-select"

export type SearchRenderScope = {
  searchParam: { [key: string]: any };
  placeholder: string;
  clearable: boolean;
  options: EnumProps[];
  data: EnumProps[];
};
export type FieldNamesProps = {
  label: string;
  value: string;
  children?: string;
};
export type SearchProps = {
  el?: SearchType; // 当前项搜索框的类型
  label?: string; // 当前项搜索框的 label
  props?: any; // 搜索项参数，根据 element plus 官方文档来传递，该属性所有值会透传到组件
  key?: string; // 当搜索项 key 不为 prop 属性时，可通过 key 指定
  tooltip?: string; // 搜索提示
  order?: number; // 搜索项排序（从大到小）
  width?: number | string; // 搜索项所占用的列数，默认为 200
  offset?: number; // 搜索字段左侧偏移列数
  defaultValue?: string | number | boolean | any[] | Ref<any>; // 搜索项默认值
  render?: (scope: SearchRenderScope) => VNode; // 自定义搜索内容渲染（tsx语法）
}
export interface ColumnProps<T = any> {
  label?: string; // 列标题
  prop?: string; // 列字段
  width?: string | number; // 列宽度
  minWidth?: string | number; // 最小列宽度
  render?: (scope: { row: T }) => VNode; // 自定义列内容渲染（tsx语法）
  align?: "left" | "center" | "right"; // 列内容对齐方式
  search: SearchProps;// 搜索项
  fieldName: FieldNamesProps // 字段名
  span?: number;
  isShow?: boolean | Ref<boolean>; // 是否显示在表格当中
}
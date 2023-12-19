<template>
  <component :is="column.search?.render ?? `el-${column.search?.el}`"
    v-bind="{ searchParam: _searchParam, clearable, ...placeholder, ...handleSearchProps }"
    v-model.trim="_searchParam[column.search?.key!]" :options="column.search?.props?.options ?? []">
    <template v-if="column.search?.el === 'cascader'" #default="{ node, data }">
      <span>{{ data[fieldNames.label] }}</span>
      <span v-if="!node.isLeaf"> ({{ data[fieldNames.children].length }}) </span>
    </template>
    <template v-if="column.search?.el === 'select'">
      <component :is="`el-option`" v-for="(col, index) in column.search?.props?.options ?? []" :key="index"
        :label="col[fieldNames.label]" :value="col[fieldNames.value]"></component>
    </template>
    <slot v-else></slot>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ColumnProps } from '../../../interface/table'
interface SearchFormItem {
  column: ColumnProps
  searchParam: { [key: string]: any }
}
const props = defineProps<SearchFormItem>()
const _searchParam = computed(() => props.searchParam)
// 处理placeholder
const placeholder = computed(() => {
  const search = props.column.search!
  if (['datetimerange', 'daterange', 'monthrange'].includes(search.props?.type)) {
    return {
      startPlaceholder: search.props?.startPlaceholder ?? '开始时间',
      endPlaceholder: search.props?.endPlaceholder ?? '结束时间',
      rangeSeparator: search.props?.rangeSeparator ?? '至'
    }
  }
  const placeholder =
    search.props?.placeholder ??
    (['input'].includes(search.el!) ? '请输入' : '请选择') + props.column.label
  return {
    placeholder
  }
})
const clearable = computed(() => {
  const search = props.column.search!
  return search.defaultValue !== undefined ||
    search.defaultValue !== null ||
    search.defaultValue !== ''
    ? true
    : search.props.clearable
})
// 处理名字
const fieldNames = computed(() => {
  const search = props.column
  return {
    label: search.fieldName?.label ?? 'label',
    value: search.fieldName?.value ?? 'value',
    children: search.fieldName?.children ?? 'children'
  }
})
const handleSearchProps = computed(() => {
  const label = fieldNames.value.label;
  const value = fieldNames.value.value;
  const children = fieldNames.value.children;
  const searchEl = props.column.search?.el;
  let searchProps = props.column.search?.props ?? {};
  if (searchEl === "tree-select") {
    searchProps = { ...searchProps, props: { ...searchProps.props, label, children }, nodeKey: value };
  }
  if (searchEl === "cascader") {
    searchProps = { ...searchProps, props: { ...searchProps.props, label, value, children } };
  }
  return searchProps;
});
</script>

<style scoped></style>

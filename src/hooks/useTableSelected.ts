import { computed, ref } from 'vue'

/**
 * 
 * @param rowKey 行的key
 * @returns 
 */
export const useTableSelected = (rowKey: string) => {
  const selectedList = ref([])
  const selectedRowKey = computed((): string[] => {
    let keys: string[] = [];
    selectedList.value.forEach(item => keys.push(item[rowKey]));
    return keys;
  });
  const handleSelectionChange = (value: any) => {
    selectedList.value = value
  }
  return {
    selectedRowKey,
    selectedList,
    handleSelectionChange
  }
} 
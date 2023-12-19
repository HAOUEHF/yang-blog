---
layout: doc
---

:::demo

```vue
<template>
  <div class="YFormItemDemo-container">
    <div style="text-align: right; margin-bottom: 10px">
      <el-button @click="readonlyType = !readonlyType">
        {{ readonlyType ? '编辑' : '取消' }}
      </el-button>
    </div>
    <el-form :model="model" :readonly="readonlyType" label-width="190px" label-suffix=":" v-draggable>
      <el-row>
        <el-col :span="12">
          <YReadonlyFormItem label="输入框" prop="input">
            <el-input v-model="model.input" placeholder="请输入" />
          </YReadonlyFormItem>
        </el-col>
        <el-col :span="12">
          <YReadonlyFormItem label="下拉框(多选)" prop="selectMultiple">
            <el-select v-model="model.selectMultiple" multiple placeholder="请选择" style="width: 100%">
              <el-option v-for="(option, index) of selectOptions" :key="index" :label="option.label"
                :value="option.value" />
            </el-select>
          </YReadonlyFormItem>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <YReadonlyFormItem label="单选框" prop="radio">
            <el-radio-group v-model="model.radio">
              <el-radio v-for="(option, index) of selectOptions" :key="index" :label="option.value">
                {{ option.label }}
              </el-radio>
            </el-radio-group>
          </YReadonlyFormItem>
        </el-col>
        <el-col :span="12">
          <YReadonlyFormItem label="多选框" prop="checkbox">
            <el-checkbox-group v-model="model.checkbox">
              <el-checkbox v-for="(option, index) of selectOptions" :key="index" :label="option.value">
                {{ option.label }}
              </el-checkbox>
            </el-checkbox-group>
          </YReadonlyFormItem>
        </el-col>
        <el-col :span="12">
          <YReadonlyFormItem label="级联选择" prop="cascader">
            <el-cascader v-model="model.cascader" :options="cascaderOptions" style="width: 100%" />
          </YReadonlyFormItem>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <YReadonlyFormItem label="级联选择(多选)" prop="cascaderMultiple">
            <el-cascader v-model="model.cascaderMultiple" :options="cascaderOptions"
              :props="{ multiple: true, emitPath: true, checkStrictly: true }" style="width: 100%" />
          </YReadonlyFormItem>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <YReadonlyFormItem label="计数器" prop="inputNumber">
            <el-input-number v-model="model.inputNumber" style="width: 100%" />
          </YReadonlyFormItem>
        </el-col>
        <el-col :span="12">
          <YReadonlyFormItem label="开关" prop="switch">
            <el-switch v-model="model.switch" />
          </YReadonlyFormItem>
        </el-col>
        <el-col :span="12">
          <YReadonlyFormItem label="开关(自定义文字)" prop="switchCustom">
            <el-switch v-model="model.switchCustom" activeText="激活" inactive-text="关闭" />
          </YReadonlyFormItem>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <YReadonlyFormItem label="评分" prop="rate">
            <el-rate v-model="model.rate" />
          </YReadonlyFormItem>
        </el-col>
      </el-row>
      <el-row>
        <el-col>
          <YReadonlyFormItem label="滑块" prop="slider">
            <el-slider v-model="model.slider" />
          </YReadonlyFormItem>
        </el-col>
        <el-col>
          <YReadonlyFormItem label="滑块(范围)" prop="sliderRange">
            <el-slider v-model="model.sliderRange" range />
          </YReadonlyFormItem>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { model as modelData, selectOptions as selectOptionsData, cascaderOptions as cascaderOptionsData } from '../../constants/YFormItemDemo'
const readonlyType = ref(true)
const model = modelData
const selectOptions = selectOptionsData
const cascaderOptions = cascaderOptionsData
</script>
<style>
.YFormItemDemo-container{
  padding-right: 20px;
}
</style>

```

:::

<template>
  <div>
    <input type="file" id="file" accept="image/*" ref="file" @change="fileUpload" />
    <label for="file" :class="hasFile ? 'hasfile' : ''">{{ fileName }}</label>
    <!-- <div>{{ file.files[0] }}</div> -->
    <!-- <div>{{ fileName }}</div> -->
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
//TODO multiple
const props = defineProps(['file']);
const emits = defineEmits(['hasFile']);

const file = ref(null);
const hasFile = ref(false);
const fileName = ref('Válasz egy fényképet');

function fileUpload() {
  hasFile.value = file.value.files.length > 0;
  if (hasFile.value) {
    fileName.value =
      file.value.files[0].name.length > 22
        ? file.value.files[0].name.substring(0, 22) + '...'
        : file.value.files[0].name;
    emits('hasFile', { file: file.value.files[0] });
  }
}
watch(
  () => props.file,
  val => {
    if (val === '') {
      file.value.value = '';
      hasFile.value = false;
      fileName.value = 'Válasz egy fényképet';
    }
  },
);
</script>

<style lang="scss" scoped>
input[type='file'] {
  display: none;
  & + label {
    color: $light;
    margin-top: 1rem;
    border-radius: 5px;
    font-size: 2rem;
    margin: 25px;
    padding: 0.375rem 0.75rem;
    font-weight: 700;
    background-color: $warning;
    &.hasfile {
      background-color: $success;
    }
  }
}
</style>

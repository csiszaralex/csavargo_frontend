<template>
  <div class="table-responsive">
    <table class="table table-hover mt-2" :class="props.striped ? 'table-striped' : ''">
      <thead>
        <tr>
          <th v-for="head in headers" :key="head" scope="col" @click="setSort(head)">
            <span class="mr-2">{{ head }}</span>
            <span v-if="sort.base === head">
              <span v-if="sort.reverse">&nbsp;▾</span>
              <span v-else>&nbsp;▴</span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, i) in sortedData" :key="i">
          <td
            v-for="head in headers"
            :key="head + i"
            :class="typeof row[head] === 'number' ? 'text-center' : ''">
            {{ row[head] ? row[head] : row[head] === 0 ? 0 : '-' }}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <slot></slot>
      </tfoot>
    </table>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue';

//TODO törlés + megerősítés
const props = defineProps({
  data: { type: Object, required: true },
  ignore: {
    type: Array,
    default() {
      return new Array(0);
    },
  },
  striped: { type: Boolean, default: false },
});
const sort = reactive({ base: '', reverse: false });

const headers = computed(() => {
  const headers = ['#'];
  for (const piece of props.data) {
    for (const key in piece) {
      if (!headers.includes(key) && !props.ignore.includes(key)) headers.push(key);
    }
  }
  return headers;
});

const sortedData = computed(() => {
  let data = [];
  props.data.forEach((item, index) => {
    data.push({ ...item, '#': index + 1 });
  });
  if (sort.base) {
    data = data.sort((a, b) => {
      if (a[sort.base] === b[sort.base]) return 0;
      const type = a[sort.base] > b[sort.base] ? -1 : 1;
      return sort.reverse ? type : -type;
    });
  }
  return data;
});
function setSort(head) {
  if (sort.base === head) sort.reverse = !sort.reverse;
  else {
    sort.base = head;
    sort.reverse = false;
  }
}
</script>

<style lang="scss" scoped></style>

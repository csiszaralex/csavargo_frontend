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
          <th v-if="acceptable"></th>
          <th v-if="declineable"></th>
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
          <td v-if="props.acceptable">
            <base-button type="success" size="sm" outline @click="acceptTask(row[acceptable])">
              ✓
            </base-button>
          </td>
          <td v-if="props.declineable">
            <base-button type="danger" size="sm" outline @click="declineTask(row[acceptable])">
              X
            </base-button>
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

const props = defineProps({
  data: { type: Object, required: true },
  ignore: {
    type: Array,
    default() {
      return new Array(0);
    },
  },
  striped: { type: Boolean, default: false },
  acceptable: { type: String, default: '' },
  declineable: { type: String, default: '' },
});
const emits = defineEmits(['accept', 'decline']);
const sort = reactive({ base: '', reverse: false });
//:header
const headers = computed(() => {
  const headers = props.ignore.includes('#') ? [] : ['#'];
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

function acceptTask(id) {
  emits('accept', id);
}
function declineTask(id) {
  emits('decline', id);
}
</script>

<style lang="scss" scoped></style>

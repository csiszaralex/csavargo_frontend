<template>
  <teleport to="body">
    <div v-if="props.show" class="backdrop" @click="tryClose"></div>
    <transition name="dialog">
      <dialog
        v-if="props.show"
        open
        class="m-0 mt-n5 p-0 overflow-hidden border-0"
        :class="upper ? 'upper' : ''">
        <header class="w-100 p-3" :class="'bg-' + props.type">
          <slot name="header">
            <h2 class="m-0" :class="textColor">{{ title }}</h2>
          </slot>
        </header>
        <section class="p-3">
          <form @submit.prevent="trySave">
            <slot></slot>
          </form>
        </section>
        <menu
          v-if="!props.fixed && !props.footless"
          class="m-0 p-3 pt-0 d-flex"
          :class="[
            twoBtn ? 'justify-content-between' : 'justify-content-end',
            props.reverseFoot ? 'flex-row-reverse' : '',
          ]">
          <slot name="actions">
            <base-button v-if="twoBtn" :type="props.saveType" @click="trySave">
              {{ props.saveText }}
            </base-button>

            <base-button :type="props.closeType" @click="tryClose">
              {{ props.closeText }}
            </base-button>
          </slot>
        </menu>
      </dialog>
    </transition>
  </teleport>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  show: { type: Boolean, required: true },
  type: { type: String, default: 'danger' },
  title: { type: String, default: 'Hiba' },
  fixed: { type: Boolean, default: false },
  footless: { type: Boolean, default: false },
  upper: { type: Boolean, default: false },
  reverseFoot: { type: Boolean, default: false },
  closeType: { type: String, default: 'primary' },
  closeText: { type: String, default: 'Bezárás' },
  saveType: { type: String, default: 'warning' },
  saveText: { type: String, default: '' },
});
const emits = defineEmits(['close', 'save']);

function tryClose() {
  if (props.fixed) return;
  emits('close');
}
function trySave() {
  if (props.fixed) return;
  emits('save');
}
const twoBtn = computed(() => {
  return props.saveText.length > 0;
});
const textColor = computed(() => {
  return ['primary', 'danger'].includes(props.type) ? 'text-light' : 'text-dark';
});
</script>

<style lang="scss" scoped>
.backdrop {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 10;
}
dialog {
  position: fixed;
  top: 20vh;
  left: 10%;
  width: 80%;
  z-index: 100;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
  background-color: white;
  &.upper {
    top: 10vh;
  }
  @include media-breakpoint-up(md) {
    left: calc(50% - 20rem);
    width: 40rem;
  }
}

.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
  transform: scale(0.8);
}
.dialog-enter-active {
  transition: all 0.3s ease-out;
}
.dialog-leave-active {
  transition: all 0.3s ease-in;
}
.dialog-enter-to,
.dialog-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>

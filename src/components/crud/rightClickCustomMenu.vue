<template>
  <div v-if="visible"
       :style="{ top: y + 'px', left: x + 'px' }"
       class="fixed z-50 w-48 bg-white rounded-lg shadow-xl dark:bg-gray-800 border border-gray-100 dark:border-gray-700 py-1 overflow-hidden transition-all transform origin-top-left">
    <button @click="onEdit" class="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white flex items-center gap-3 transition-colors">
      <svg class="w-4 h-4 text-blue-600 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.848 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.391a2.017 2.017 0 0 1 0 2.853l-6.832 6.832L9 15l.182-3.535 6.832-6.832a2.017 2.017 0 0 1 2.853 0Z"/>
      </svg>
      Edit Task
    </button>
    <button @click="onDelete" class="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 flex items-center gap-3 transition-colors border-t border-gray-100 dark:border-gray-700">
      <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
      </svg>
      Delete Task
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";

const props = defineProps({
  visible: { type: Boolean, default: false },
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  item: { type: Object, default: null }
});

const emit = defineEmits(['edit', 'delete', 'close']);

const onEdit = () => {
  emit('edit', props.item);
  emit('close');
};

const onDelete = () => {
  emit('delete', props.item?.id);
  emit('close');
};

const handleOutsideClick = (e) => {
  if (props.visible) {
    emit('close');
  }
};

onMounted(() => {
  window.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  window.removeEventListener('click', handleOutsideClick);
});
</script>

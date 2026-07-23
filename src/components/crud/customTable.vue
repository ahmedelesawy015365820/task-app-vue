<template>
  <div class="overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" class="p-4">
          <div class="flex items-center">
            <input
                v-model="allCheckRows" @change="$emit('allCheckRowsFun',allCheckRows)"
                id="checkbox-all"
                type="checkbox"
                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            >
            <label for="checkbox-all" class="sr-only">checkbox</label>
          </div>
        </th>
        <template v-for="(el,index) in table">
          <th
              :key="index"
              scope="col"
              class="px-4 py-3"
              v-if="setting[el.key]"
          >
            {{ el.label }}
          </th>
        </template>
        <th scope="col" class="px-4 py-3">
          <span class="sr-only">Actions</span>
        </th>
      </tr>
      </thead>
      <tbody v-if="loading">
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          <div class="flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Loading data...</span>
          </div>
        </td>
      </tr>
      </tbody>
      <tbody v-else-if="error">
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-red-500 font-medium">
          {{ error }}
        </td>
      </tr>
      </tbody>
      <tbody v-else-if="data.length === 0">
      <tr>
        <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
          No data found.
        </td>
      </tr>
      </tbody>
      <tbody v-else>
      <tr
          v-for="(item,index) in data"
          :key="item.id"
          @click="$emit('addCheckTableAll',item.id)"
          @dblclick.prevent="$emit('dblclickRow',item)"
          @contextmenu.prevent="openContextMenu($event, item)"
          class="border-b dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
          :class="[dataAllCheck.includes(item.id) ? 'bg-gray-100':'']"
      >
        <td class="w-4 px-4 py-3">
          <div class="flex items-center">
            <input
                :id="'checkbox-table-search-' + item.id"
                type="checkbox" v-model="dataAllCheck" :value="item.id"
                @change="$emit('dataAllCheck',dataAllCheck)"
                class="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            >
            <label :for="'checkbox-table-search-' + item.id" class="sr-only">checkbox</label>
          </div>
        </td>
        <template v-for="(el,index) in table" :key="index">
          <td
              class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              v-if="setting[el.key] && el.type == 'string'"
          >
            #{{ item[el.key] }}
          </td>
          <td class="px-4 py-2" v-if="setting[el.key] && el.type == 'enums'">
                <template v-for="stu in el.content">
                  <span
                      v-if="stu.value == item.status"
                      :class="[
                        item.status === stu.value ? getColorClass(stu.color) : '',
                        'text-xs font-medium px-2 py-0.5 rounded'
                    ]"
                  >
                  {{ item[el.key] }}
                </span>
                </template>
          </td>
          <td class="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white" v-if="setting[el.key] && el.type == 'date'">
            {{ item[el.key] }}
          </td>
        </template>
        <td class="px-4 py-3 flex items-center justify-end" @click.stop>
          <div class="flex items-center space-x-4">
            <!-- زرار التعديل (Update) -->
            <button
                class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                @click="$emit('showModelEdit',item)" type="button"
            >
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m14.304 4.848 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.391a2.017 2.017 0 0 1 0 2.853l-6.832 6.832L9 15l.182-3.535 6.832-6.832a2.017 2.017 0 0 1 2.853 0Z"/>
              </svg>
            </button>

            <!-- زرار الحذف (Delete) -->
            <button type="button" @click.prevent="$emit('deleteData',item.id)" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 rounded-lg dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900">
              <svg class="w-4 h-4" aria-hidden="true" xmlns="http://w3.org" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
              </svg>
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Context Menu -->
    <rightClickCustomMenu 
      :visible="contextMenuVisible" 
      :x="contextMenuX" 
      :y="contextMenuY" 
      :item="contextMenuItem"
      @edit="$emit('dblclickRow', $event)"
      @delete="$emit('deleteData', $event)"
      @close="closeContextMenu"
    />

  </div>
</template>

<script setup lang="ts">

import {ref, watch} from "vue";
import rightClickCustomMenu from './rightClickCustomMenu.vue'

  let allCheckRows = ref(false);
  let dataAllCheck = ref([]);

  const contextMenuVisible = ref(false);
  const contextMenuX = ref(0);
  const contextMenuY = ref(0);
  const contextMenuItem = ref(null);

  const openContextMenu = (event, item) => {
    contextMenuVisible.value = true;
    contextMenuX.value = event.clientX;
    contextMenuY.value = event.clientY;
    contextMenuItem.value = item;
  };

  const closeContextMenu = () => {
    contextMenuVisible.value = false;
  };

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
    };
    return colorMap[color] || colorMap['gray'];
  };

  const props = defineProps({
    setting: { required: true, type: Object},
    data: { required: true, type: Array},
    dataAllCheck: { required: true, type: Array},
    table: { required: true, type: Array},
    error: { required: true, type: Boolean},
    loading: { required: true, type: Boolean},
    // pagePaginate: { required: true, type: Number},
  });

  watch(() => props.dataAllCheck, (newValue, oldValue) => {
        dataAllCheck.value = newValue;
      }
  ,{ deep: true });

</script>

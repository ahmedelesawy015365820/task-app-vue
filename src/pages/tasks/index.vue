<template>
  <div class="p-4 sm:ml-64 mt-14">
    <div class="p-4 border-1 border-default border-dashed rounded-base">
      <section class="bg-gray-50 dark:bg-gray-900 flex justify-center min-h-screen">
        <div class="mx-auto max-w-screen-2xl grow">
          <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">

            <FilterAndSearchTable
                @inputSearch="e => search = e"
                @StatusChange="e => statusFilter = e"
                @showModelCreate="showModelCreate"
                @deleteData="deleteData(dataAllCheck)"
                :setting="tableSetting.setting"
                :dataAllCheck="dataAllCheck"
            />

            <customTable
                :dataAllCheck="dataAllCheck"
                :setting="tableSetting.setting"
                :loading="loading"
                :error="error"
                :data="data"
                :table="tableSetting.table"
                @allCheckRowsFun="e => allCheckRowsFun(e)"
                @addCheckTableAll="e => addCheckTableAll(e)"
                @dblclickRow="e => dblclickRow(e)"
                @showModelEdit="e => showModelEdit(e)"
                @deleteData="e => deleteData(e)"
                @dataAllCheck="e => dataAllCheck = e"
            />

            <PaginationTable
                :dataPaginate="dataPaginate"
                :pagePaginate="pagePaginate"
                :data="data"
                @getData="e => getData(e)"
            />

          </div>
        </div>

        <!--     modal   -->
        <ModalCreateAndUpdate :type="type" :dataRow="dataRow" :modalShow="modalShow" @created="getData" />

      </section>
    </div>
  </div>
</template>

<script setup>
    import { initFlowbite } from 'flowbite';
    import {defineComponent, onMounted, reactive, ref, watch} from "vue";
    import ModalCreateAndUpdate from "./ModalCreateAndUpdate.vue";
    import FilterAndSearchTable from "./../../components/crud/filterAndSearchTable.vue";
    import PaginationTable from "./../../components/crud/paginationTable.vue";
    import customTable from "./../../components/crud/customTable.vue";
    import crud from "../../composable/crud_structure.js";

    defineComponent({ ModalCreateAndUpdate, FilterAndSearchTable, PaginationTable, customTable });

    const {
      statusFilter, search, showModelCreate, showModelEdit, dblclickRow, dataAllCheck, allCheckRowsFun, tableSetting, getSetting,
      addCheckTableAll, deleteData, dataRow, modalShow, type, getData, uri, loading, error, pagePaginate, data, dataPaginate
    } = crud();

    onMounted(() => {
      uri.value = 'tasks';
      getData();
      getSetting();
      initFlowbite();
    });

    tableSetting.table = [
      {
        isFilter: true,
        label: 'id',
        key: 'id',
        type: 'string',
      },
      {
        isFilter: true,
        label: 'Title',
        key: 'title',
        type: 'string',
        setting: { name: true },
      },
      {
        isFilter: true,
        label: 'description',
        key: 'description',
        type: 'string',
      },
      {
        isFilter: false,
        label: 'status',
        key: 'status',
        type: 'enums',
        content: [
          {value:'Pending', color: 'yellow'},
          {value:'Done', color: 'blue'},
          {value:'In Progress', color: 'green'},
        ],
      },
      {
        isFilter: false,
        label: 'dueDate',
        key: 'dueDate',
        type: 'date',
      }
    ];

</script>

<style scoped>

</style>
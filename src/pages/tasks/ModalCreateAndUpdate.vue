<template>
  <!-- Main modal -->
  <div id="crud-modal" data-modal-backdrop="static" tabindex="-1" aria-hidden="true" class="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full">
    <div class="relative w-full max-w-lg max-h-full">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            {{ type == 'create' ? 'Create': 'Edit' }} Task
          </h3>
          <button
              type="button"
              class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="crud-modal"
              @click.prevent="defaultData"
          >
            <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
            </svg>
            <span class="sr-only">Close modal</span>
          </button>
        </div>
        <!-- Modal body -->
        <form class="p-4 md:p-5">
          <div class="grid gap-4 mb-4 grid-cols-2">
            <div class="col-span-2">
              <label for="title-model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Title</label>
              <input
                  type="text"
                  name="title"
                  id="title-model"
                  v-model="v$.title.$model"
                  :class="[
                      'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
                      ,{
                        'border border-red-500': v$.title.$error || errors[`title`],
                        'border border-green-500': !v$.title.$invalid && !errors[`title`]
                      }
                  ]"
                  placeholder="Type task title"
              >
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label for="status-model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Status</label>
              <select
                  v-model="v$.status.$model"
                  id="status-model"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  :class="[{
                      'border border-red-500': v$.status.$error || errors[`status`],
                      'border border-green-500': !v$.status.$invalid && !errors[`status`]
                  }]"
              >
                <option selected="">Select status</option>
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div class="col-span-2 sm:col-span-1">
              <label for="dueDate-model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Due Date</label>
              <input
                  type="date"
                  name="dueDate"
                  id="dueDate-model"
                  v-model="v$.dueDate.$model"
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  :class="[{
                      'border border-red-500': v$.dueDate.$error || errors[`dueDate`],
                      'border border-green-500': !v$.dueDate.$invalid && !errors[`dueDate`]
                  }]"
              >
            </div>
            <div class="col-span-2">
              <label for="description-model" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Task Description</label>
              <textarea
                  id="description-model"
                  rows="4"
                  v-model="v$.description.$model"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Write task description here"
                  :class="[{
                      'border border-red-500': v$.description.$error || errors[`description`],
                      'border border-green-500': !v$.description.$invalid && !errors[`description`]
                  }]"
              ></textarea>
            </div>
          </div>

          <div class="flex items-center py-4 md:py-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b dark:border-gray-600">
            <template v-if="!is_disabled">
              <button
                  type="button" v-if="!loading"
                  @click.prevent="AddSubmit"
                  class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
              <button disabled v-else type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center">
                <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor"/>
                </svg>
                Loading...
              </button>
            </template>
            <button
                data-modal-hide="crud-modal"
                type="button"
                @click.prevent="defaultData"
                class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center"
            >
              Cancel
            </button>
            <button
                type="button"
                @click.prevent="defaultData"
                v-if="type != 'edit' && is_disabled" :disabled="!is_disabled"
                class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
              Add new Record
            </button>

          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, nextTick, reactive, ref, watch} from "vue";
import useVuelidate from "@vuelidate/core";
import {maxLength, minLength, required} from "@vuelidate/validators";
import axiosSetting from "../../settings/axiosSetting";
import Swal from 'sweetalert2';

defineOptions({ name: 'tasks'});

const emit = defineEmits(['created']);

const props = defineProps({
  type: {default: 'create'},
  dataRow: {default: ''},
  modalShow: {default: 0},
});

let is_disabled = ref(false);
let loading = ref(false);
let id = ref(null);
let errors = ref({});

function defaultData(){
  submitData.data.status = 'Pending';
  submitData.data.description = '';
  submitData.data.title = '';
  submitData.data.dueDate = '';
  is_disabled.value = false;
  loading.value = false;
  nextTick(() => { v$.value.$reset() });
}
function resetModal() {
  defaultData();
  setTimeout(async () => {
    if (props.type != 'edit') {
    } else {
      id.value = props.dataRow.id;

      axiosSetting.get(`tasks/${id.value}`)
          .then((res) => {
            loading.value = true;
            let l = res.data;
            submitData.data.status = l.status;
            submitData.data.description = l.description;
            submitData.data.title = l.title;
            submitData.data.dueDate = l.dueDate;
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            loading.value = false;
          })
    }
  }, 50);
}
watch(() => props.modalShow, (newValue, oldValue) => {
      if (newValue > oldValue && props.type == 'edit') {
        resetModal();
      }
    }
);

//start design
let submitData =  reactive({
  data:{
    title: '',
    description: '',
    status: 'Pending',
    dueDate: '',
  }
});

const rules = computed(() => {
  return {
    title: { required, maxLength:maxLength(150) },
    description: { required, maxLength:maxLength(300) },
    status: { required },
    dueDate: { required },
  }
});

const v$ = useVuelidate(rules,submitData.data);

const AddSubmit = () =>  {

  v$.value.$validate();
  errors.value = {};

  if (!v$.value.$error) {
    is_disabled.value = false;
    loading.value = true;

    if (props.type == 'edit') {submitData.data._method=' PUT';}

    let url = props.type !== 'edit' ? `tasks`: `tasks/${id.value}`;

    axiosSetting.post(`${url}`, submitData.data)
        .then((res) => {
          if(props.type !== 'edit') {
            Swal.fire({
              icon: 'success',
              title: `Added Successfully`,
              showConfirmButton: false,
              timer: 1500
            });
            is_disabled.value = true;
          }else {
            Swal.fire({
              icon: 'success',
              title: `Edit Successfully`,
              showConfirmButton: false,
              timer: 1500
            });
          }
          emit("created");
        })
        .catch((err) => {
          if (err) {
            if (err.response) {
              if(err.response.status == 400) {
                Swal.fire({
                  icon: 'error',
                  title: err.response.data.message,
                  timer: 4000
                });
              }else {
                if (err.response.data) {
                  errors.value = err.response.data.errors;
                  setTimeout(() => {
                    errors.value = {};
                  },3000);
                }
              }
            }
          }
        })
        .finally(() => {
          loading.value = false;
        });
  }

}

</script>


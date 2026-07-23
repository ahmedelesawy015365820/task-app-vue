import {reactive, ref, watch} from "vue";
import Swal from "sweetalert2";
import axiosSetting from "../settings/axiosSetting";
import { Modal } from 'flowbite';

export default function crud() {

    // start fetch data
    const data = ref<any[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const pagePaginate = ref<number>(1);
    const dataPaginate = ref<any>(null);
    const idPage = ref<string>('');
    const headLabel = ref<string>('');
    const label = ref<string>('');
    const uri = ref('tasks');


    let getData = (page =  1) => {
        pagePaginate.value = page;
        loading.value = true;
        modalShow.value = 0;
        dataAllCheck.value = [];

        let params: Record<string, any> = {
            _page: page,
            _per_page: 10,
            _sort: 'title',
            'title:contains': search.value
        };
        if (statusFilter.value) {
            params['status:eq'] = statusFilter.value;
        }

        axiosSetting.get(`${uri.value}`,{
            params: params,
        }).then((res: any) => {
            let l = res.data;
            dataPaginate.value = l;
            data.value = l.data;
        })
            .catch((err: any) => {
                error.value = "Failed to load tasks.";
            })
            .finally(() => {
                loading.value = false;
            });
    }
    // end fetch data

    // start search and Filter
    const debounce = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
    let search = ref('');
    let statusFilter = ref('');

    watch([search, statusFilter], ([search,filter], [prevSearch,prevFilter]) => {
        clearTimeout(debounce.value);
        debounce.value = setTimeout(() => {
            getData();
        }, 400);
    }, { deep: true });
    // end search and Filter

    // start show model
    let dataRow = ref<any>(null);
    let modalShow = ref<number>(0);
    const type = ref<string>('');

    const openModal = () => {
        const modalEl = document.getElementById(`${idPage.value}-modal`);
        if (modalEl) {
            const modal = new Modal(modalEl);
            modal.show();
        }
    };

    let showModelEdit = (row: any) => {
        dataRow.value = row;
        type.value = 'edit';
        modalShow.value += 1;
        openModal();
    }
    let showModelCreate = () => {
        dataRow.value = null;
        type.value = 'create';
        modalShow.value += 1;
        openModal();
    }
    // end show model

    // start checkAll and delete
    let dataAllCheck = ref<any[]>([]);
    let allCheckRowsFun = (e: boolean) => {
        if(e){
            data.value.forEach((el: any) => {
                if(!dataAllCheck.value.includes(el.id)){
                    dataAllCheck.value.push(el.id);
                }
            });
        }else {
            dataAllCheck.value = [];
        }
    }
    let addCheckTableAll = (id: any) => {
        if(!dataAllCheck.value.includes(id)){
            dataAllCheck.value.push(id);
        }else {
            let ind = dataAllCheck.value.indexOf(id);
            dataAllCheck.value.splice(ind,1);
        }
    }

    function deleteData(id: any){
        if(Array.isArray(id)) {
            Swal.fire({
                title: `Are You Sure Delete ?`,
                text: `You Wont Be Able To Revert This`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'yes',
                cancelButtonText: 'no',
            }).then(async (result) => {
                if (result.isConfirmed) {
                    await Promise.all(id.map(async (el: any) => {
                        await axiosSetting.delete(`${uri.value}/${el}`)
                    }));
                    await getData();
                    await Swal.fire({
                        icon: 'success',
                        title: `Deleted Successfully`,
                        showConfirmButton: false,
                        timer: 1500
                    });
                }
            });
        }else {
            Swal.fire({
                title: `Are You Sure Delete ?`,
                text: `You Wont Be Able To Revert This`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'yes',
                cancelButtonText: 'no',
            }).then((result) => {
                if (result.isConfirmed) {
                    axiosSetting.delete(`${uri.value}/${id}`)
                        .then((res: any) => {
                            Swal.fire({
                                icon: 'success',
                                title: `Deleted Successfully`,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            getData();
                        })
                        .catch((err: any) => {
                            Swal.fire({
                                icon: 'error',
                                title: `There Is An Error In The System`,
                                text: ` You Can Not Delete`,
                            });
                        });
                }
            });
        }
    }
    // end checkAll and delete

    // start tableSetting
    const tableSetting = reactive({
        table: [] as any[],
        setting: {} as Record<string, any>,
    });

    function getSetting() {
        axiosSetting.get(`setting`)
        .then((res: any) => {
            loading.value = true;
            let l = res.data;
            tableSetting.setting = l[uri.value];
        })
        .catch((err: any) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });

    }
    // end tableSetting

    return {
        statusFilter, search, showModelCreate, showModelEdit, dataAllCheck, allCheckRowsFun, tableSetting, getSetting,
        addCheckTableAll, deleteData, dataRow, modalShow, type, getData, uri, loading, error, pagePaginate, data, dataPaginate,
        idPage, headLabel, label
    }
};
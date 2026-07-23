import {reactive, ref, watch} from "vue";
import Swal from "sweetalert2";
import axiosSetting from "../settings/axiosSetting";

export default function crud() {

    // start fetch data
    const data = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const pagePaginate = ref(null);
    const dataPaginate = ref(null);
    const uri = ref('tasks');


    let getData = (page =  1) => {
        pagePaginate.value = page;
        loading.value = true;
        modalShow.value = 0;

        let params = {
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
        }).then((res) => {
            let l = res.data;
            dataPaginate.value = l;
            data.value = l.data;
        })
            .catch((err) => {
                error.value = "Failed to load tasks.";
            })
            .finally(() => {
                loading.value = false;
            });
    }
    // end fetch data

    // start search and Filter
    const debounce = ref({})
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
    let dataRow = ref('');
    let modalShow = ref(false);
    const type = ref('');

    let showModelEdit = (row) => {
        dataRow.value = row;
        type.value = 'edit';
        modalShow.value += 1;
    }
    let showModelCreate = () => {
        dataRow.value = null;
        type.value = 'create';
        modalShow.value += 1;
    }
    let dblclickRow = (item) => {
        document.getElementById('add-new').click();
        showModelEdit(item);
    };
    // end show model

    // start checkAll and delete
    let dataAllCheck = ref([]);
    let allCheckRowsFun = (e) => {
        if(e){
            data.value.forEach((el) => {
                if(!dataAllCheck.value.includes(el.id)){
                    dataAllCheck.value.push(el.id);
                }
            });
        }else {
            dataAllCheck.value = [];
        }
    }
    let addCheckTableAll = (id) => {
        if(!dataAllCheck.value.includes(id)){
            dataAllCheck.value.push(id);
        }else {
            let ind = dataAllCheck.value.indexOf(id);
            dataAllCheck.value.splice(ind,1);
        }
    }

    function deleteData(id){
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
                    await id.map(async el => {
                        await axiosSetting.delete(`${uri.value}/${el}`)
                    });
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
                        .then((res) => {
                            Swal.fire({
                                icon: 'success',
                                title: `Deleted Successfully`,
                                showConfirmButton: false,
                                timer: 1500
                            });
                            getData();
                        })
                        .catch((err) => {
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

    const tableSetting = reactive({
        table: [],
        setting: {},
    });

    // start checkAll and delete
    function getSetting() {
        axiosSetting.get(`setting`)
        .then((res) => {
            loading.value = true;
            let l = res.data;
            tableSetting.setting = l[uri.value];
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loading.value = false;
        });

    }
    // end checkAll and delete

    return {
        statusFilter, search, showModelCreate, showModelEdit, dblclickRow, dataAllCheck, allCheckRowsFun, tableSetting, getSetting,
        addCheckTableAll, deleteData, dataRow, modalShow, type, getData, uri, loading, error, pagePaginate, data, dataPaginate
    }
};
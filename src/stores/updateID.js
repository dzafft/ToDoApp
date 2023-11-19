import {defineStore} from 'pinia';

export const useUpdateIDStore = defineStore({
    id: 'updateID',
    state: ()=>({
        updateID: ""
    }),
    actions: {
        changeUpdateID(id){
            this.updateID = id;
        }
    }
})
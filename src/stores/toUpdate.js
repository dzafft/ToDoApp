import {defineStore} from 'pinia';

export const useToUpdateStore = defineStore({
    id: 'toUpdate',
    state: ()=>({
        toUpdate: false
    }),
    actions: {
        userIsUpdating(){
            this.toUpdate = true;
        },
        userIsNotUpdating(){
            this.toUpdate = false;
        }
    }
})
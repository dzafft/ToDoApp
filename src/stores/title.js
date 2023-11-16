import {defineStore} from 'pinia';

export const useTitleStore = defineStore({
    id: 'title',
    state: ()=>({
        exampleTitle: "Hello______",
    })
})
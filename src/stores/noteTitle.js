import {defineStore} from 'pinia';

export const useTitleStore = defineStore({
    id: 'title',
    state: ()=>({
        noteTitle: "",
    }),
    actions: {
        updateNoteTitle(newTitle) {
            console.log(newTitle);
            this.noteTitle = newTitle;
        },
        deleteTitle(){
            this.noteTitle = ""
        },
        setTitle(listItemTitle){
            this.noteTitle = listItemTitle;
        }
    }
})
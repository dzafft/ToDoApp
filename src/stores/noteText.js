import {defineStore} from 'pinia';

export const useTextStore = defineStore({
    id: 'text',
    state: ()=>({
        noteText: "",
    }),
    actions: {
        updateNoteText(newText) {
            console.log(newText);
            this.noteText = newText;
        },
        deleteText(){
            this.noteText = ""
        },
        setText(listItemText){
            this.noteText = listItemText;
        }
    }
})
import {defineStore} from 'pinia';
import { nanoid } from "nanoid";


export const useListStore = defineStore({
    id: 'list',
    state: ()=>({
        list: [],
    }),
    actions: {
        addNote(note){
            console.log(note)
            function isDateTimeExpired(obj) {
                const currentDate = new Date();
                const targetDate = new Date(obj.date + " " + obj.time);
              
                return currentDate > targetDate;
            }
            
            if (isDateTimeExpired(note)) {
                alert("Invalid time!");
                return;
            }
            const item = {
                title: note.title,
                text: note.text,
                completedByDate: note.date,
                completedByTime: note.time,
                id: nanoid(),
            };

            console.log(item)
            this.list.push(item);
            this.saveListToLocalStorage();
        },
        editNote(id, index, note){
            const updatedNote = {
                title: note.title,
                text: note.text,
                completedByDate: note.completedByDate,
                completedByTime: note.completedByTime,
                id: id,
            };
            this.list[index] = updatedNote;
            this.saveListToLocalStorage();
        },
        deleteNote(id){
            this.list = this.list.filter((item) => item.id !== id);
            this.saveListToLocalStorage();
        },
        saveListToLocalStorage() {
            localStorage.setItem('myList', JSON.stringify(this.list));
        },
        initializeStore() {
            const savedList = localStorage.getItem('myList');
            if (savedList) {
              this.list = JSON.parse(savedList);
            }
        },
    }
})
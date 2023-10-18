<template>
  <div class="app-container">
    <header>
      <h1>Notes Website</h1>
      <div>
        <nav class="navbar">
          <a href="#/">Create note</a>
          <a href="#/notelist">Note list</a>
        </nav>
      </div>
    </header>
    <main style="height: 100vh; width: 100vw; background-color: white;">
      
      <component 
      :is="currentView"
      @handleButtonClick="handleButtonClick"
      v-model:noteTitle="noteTitle"
      v-model:noteText="noteText"
      v-model:completedByDate="completedByDate"
      v-model:completedByTime="completedByTime"
      :list="list"
      @updateNote="updateNote"
      @clearNote="clearNote"
      :toUpdate="toUpdate"
      @undoEdit="undoEdit"
      @deleteNote="deleteNote"
      /> 
      

      
    </main>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watchEffect} from 'vue'
import CreateNote from './components/CreateNote.vue';
import NoteList from './components/NoteList.vue';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {nanoid} from 'nanoid'

const routes = {
  '/': CreateNote,
  '/notelist': NoteList
}

const currentPath = ref(window.location.hash)

window.addEventListener('hashchange', () => {
  currentPath.value = window.location.hash
})

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || '/'] || NotFound
})

const confirm = useConfirm();
const toast = useToast();

const noteText = ref('');
const noteTitle = ref('');
const list = ref([]);
const toUpdate = ref(false);
const updateIndex = ref(null);
const completedByDate = ref(getTomorrowDate());
const completedByTime = ref('10:00');


const confirm1 = (id) => {
  confirm.require({
      message: 'Are you sure you want to proceed?',
      header: 'Edit',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Note updated!', life: 3000 });
          finishEdit(id)

      },
      reject: () => {
          toast.add({ severity: 'error', summary: 'Rejected', detail: 'Note preserved!', life: 3000 });
      }
  });
};


const savedList = localStorage.getItem('myList');
if (savedList) {
  list.value = JSON.parse(savedList);
}

// Watch for changes in the list and save it to local storage
watchEffect(() => {
  localStorage.setItem('myList', JSON.stringify(list.value));
});

function isDateTimeExpired(obj) {
  const currentDate = new Date();
  const targetDate = new Date(obj.date + ' ' + obj.time);

  return currentDate > targetDate;
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1); 
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function handleButtonClick(object) {
  if (isDateTimeExpired(object)){
    alert("Invalid time!")
    return
  }
  const note = {
    title: object.title,
    text: object.text,
    completedByDate: object.date,
    completedByTime: object.time,
    id: nanoid()
  }
    if (toUpdate.value === false){
      list.value.push(note);
      

      noteTitle.value = '';
      noteText.value = '';
      completedByDate.value = getTomorrowDate();
      completedByTime.value = '10:00';
    }
    else{

      
      confirm1(updateIndex.value)
      
    } 
  
}

function finishEdit(id){
  const index = list.value.findIndex(item => item.id === id);

  if (index !== -1) {
  // Create the updated object
  const updatedNote = {
    title: noteTitle.value,
    text: noteText.value,
    completedByDate: completedByDate.value,
    completedByTime: completedByTime.value,
    id: id
  };
  noteText.value = '';
  noteTitle.value = '';
  completedByDate.value = getTomorrowDate();
  completedByTime.value = '10:00';
  toUpdate.value = false;

  // Update the item at the found index with the new object
  list.value[index] = updatedNote;
  }

}
function updateNote(id){
  toUpdate.value = true;
  updateIndex.value = id;
  const foundItem = list.value.find(item => item.id === id);
  noteTitle.value = foundItem.title;
  noteText.value = foundItem.text;
  completedByDate.value = foundItem.completedByDate;
  completedByTime.value = foundItem.completedByTime;
} 

function undoEdit(){
  noteText.value = '';
  noteTitle.value = '';
  completedByDate.value = getTomorrowDate();
  completedByTime.value = '10:00';
  toUpdate.value = false;
}

function deleteNote(id){
  list.value = list.value.filter(item => item.id !== id);

}

function clearNote(){
  noteTitle.value = '';
  noteText.value = '';
  completedByDate.value = '';
  completedByTime.value = '';
}



</script>

<style scoped>

main{
  margin: 0;
}

header {
  background-color: #007acc;
  color: white;
  padding: 20px;
  text-align: center;
}

header h1 {
  font-size: 36px;
}

header p {
  font-size: 18px;
}

main {
  padding: 20px;
}

.mainpage-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}


.external-link-notelist{
  display: flex;
  align-items: center;
}

.external-link-notelist i{
  margin-left: 10px;
}

.navbar {
  background-color: #0074d9; 
  padding: 10px;
}

.navbar a {
  text-decoration: none;
  color: #fff; 
  margin: 10px;
  font-size: 16px;
}

.navbar a:hover {
  text-decoration: underline;
}



</style>

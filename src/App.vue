<template>
  <div class="app-container">
    <header>
      <h1>Notes Website</h1>
      <div>
        <nav class="navbar">
          <router-link :to="{ name: 'createnote' }">Create Note</router-link> |
          <router-link :to="{ name: 'notelist' }">Note List</router-link>
        </nav>
      </div>
    </header>
    <main style="height: 100vh; width: 100vw; background-color: white">
      <router-view
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
import { ref, watchEffect } from "vue";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import { nanoid } from "nanoid";

const confirm = useConfirm();
const toast = useToast();

const noteText = ref("");
const noteTitle = ref("");
const list = ref([]);
const toUpdate = ref(false);
const updateIndex = ref(null);
const completedByDate = ref(getTomorrowDate());
const completedByTime = ref("10:00");

const onUpdateNote = (id) => {
  confirm.require({
    message: "Are you sure you want to proceed?",
    header: "Edit",
    icon: "pi pi-exclamation-triangle",
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Note updated!",
        life: 3000,
      });
      finishEdit(id);
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "Note preserved!",
        life: 3000,
      });
    },
  });
};

const savedList = localStorage.getItem("myList");
if (savedList) {
  list.value = JSON.parse(savedList);
}

// Watch for changes in the list and save it to local storage
watchEffect(() => {
  localStorage.setItem("myList", JSON.stringify(list.value));
});

function isDateTimeExpired(obj) {
  const currentDate = new Date();
  const targetDate = new Date(obj.date + " " + obj.time);

  return currentDate > targetDate;
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function handleButtonClick(object) {
  if (isDateTimeExpired(object)) {
    alert("Invalid time!");
    return;
  }
  const note = {
    title: object.title,
    text: object.text,
    completedByDate: object.date,
    completedByTime: object.time,
    id: nanoid(),
  };
  if (toUpdate.value === false) {
    list.value.push(note);

    noteTitle.value = "";
    noteText.value = "";
    completedByDate.value = getTomorrowDate();
    completedByTime.value = "10:00";
  } else {
    onUpdateNote(updateIndex.value);
  }
}

function finishEdit(id) {
  const index = list.value.findIndex((item) => item.id === id);

  if (index !== -1) {
    // Create the updated object
    const updatedNote = {
      title: noteTitle.value,
      text: noteText.value,
      completedByDate: completedByDate.value,
      completedByTime: completedByTime.value,
      id: id,
    };
    noteText.value = "";
    noteTitle.value = "";
    completedByDate.value = getTomorrowDate();
    completedByTime.value = "10:00";
    toUpdate.value = false;

    // Update the item at the found index with the new object
    list.value[index] = updatedNote;
  }
}
function updateNote(id) {
  toUpdate.value = true;
  updateIndex.value = id;
  const foundItem = list.value.find((item) => item.id === id);
  noteTitle.value = foundItem.title;
  noteText.value = foundItem.text;
  completedByDate.value = foundItem.completedByDate;
  completedByTime.value = foundItem.completedByTime;
}

function undoEdit() {
  noteText.value = "";
  noteTitle.value = "";
  completedByDate.value = getTomorrowDate();
  completedByTime.value = "10:00";
  toUpdate.value = false;
}

function deleteNote(id) {
  list.value = list.value.filter((item) => item.id !== id);
}

function clearNote() {
  noteTitle.value = "";
  noteText.value = "";
  completedByDate.value = "";
  completedByTime.value = "";
}
</script>

<style scoped>
main {
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

main {
  padding: 20px;
}

.navbar {
  background-color: #0074d9;
  padding: 10px;
}

.navbar > * {
  text-decoration: none;
  color: #fff;
  margin: 10px;
  font-size: 16px;
}

.navbar > *:hover {
  text-decoration: underline;
}
</style>

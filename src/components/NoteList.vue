<template>
  <div>
    <h1 class="notelist-header">Notes</h1>
    <Toast />
    <ConfirmDialog />
    <ul class="notes-list">
      <Card class="note" v-for="item in listStore.list" :key="item.id">
        <template #title>
          <div class="note-title-row">
            <div class="note-title">{{ item.title }}</div>
            <div class="note-buttons">
              <router-link :to="{ name: 'createnote' }">
                <Button
                  icon="pi pi-file-edit"
                  severity="success"
                  rounded
                  aria-label="Cancel"
                  class="update-button"
                  @click="
                    toUpdateStore.userIsUpdating();
                    titleStore.setTitle(item.title);
                    textStore.setText(item.text);
                    updateIDStore.changeUpdateID(item.id)
                  "
                />
              </router-link>
              <Button
                id="deleteButton"
                icon="pi pi-delete-left"
                severity="danger"
                rounded
                aria-label="Cancel"
                @click="onDeleteNote(item.id)"
                class="delete-button"
              />
            </div>
          </div>
        </template>
        <template #content>
          <div class="note-text">
            <p class="text-content">{{ item.text }}</p>
          </div>
        </template>
        <template #footer>
          <div class="card-footer">
            <div class="time-difference">
              <span class="time-difference-text">Time left:</span>
              {{ diff(item) }}
            </div>
          </div>
        </template>
      </Card>
    </ul>
  </div>
</template>

<script setup>
import { onBeforeMount, ref, computed } from "vue"; 
import Button from "primevue/button";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import {useTitleStore} from "../stores/noteTitle";
import {useTextStore} from "../stores/noteText";
import {useListStore} from "../stores/noteList";
import {useToUpdateStore} from "../stores/toUpdate";
import {useUpdateIDStore} from "../stores/updateID"


onBeforeMount(()=>{
  listStore.initializeStore();
})

const listStore = useListStore();
const toUpdateStore = useToUpdateStore();
const titleStore = useTitleStore();
const textStore = useTextStore();
const updateIDStore = useUpdateIDStore();

const currentTime = ref(new Date());

setInterval(() => {
  currentTime.value = new Date();
}, 1000);



const diff = (item) => {
  const dueDate = new Date(`${item.completedByDate}T${item.completedByTime}:00`);
  console.log(dueDate)
  console.log(currentTime.value)
  const diffMilli = dueDate - currentTime.value;

  // Calculate the differences in various units
  const diffSeconds = Math.floor(diffMilli / 1000);
  const seconds = diffSeconds % 60;

  const diffMinutes = Math.floor(diffSeconds / 60);
  const minutes = diffMinutes % 60;

  const diffHours = Math.floor(diffMinutes / 60);
  const hours = diffHours % 24;

  const diffDays = Math.floor(diffHours / 24);
  const days = diffDays % 7;

  const weeks = Math.floor(diffDays / 7);

  return `${weeks} Weeks, ${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
}


const confirm = useConfirm();
const toast = useToast();

const onDeleteNote = (id) => {
  confirm.require({
    message: "Do you want to delete this record?",
    header: "Delete Confirmation",
    icon: "pi pi-info-circle",
    acceptClass: "p-button-danger",
    accept: () => {
      toast.add({
        severity: "info",
        summary: "Confirmed",
        detail: "Record deleted",
        life: 3000,
        acceptClass: "confirm-dialogue-accept",
        rejectClass: "confirm-dialogue-reject",
      });
      listStore.deleteNote(id);
    },
    reject: () => {
      toast.add({
        severity: "error",
        summary: "Rejected",
        detail: "You have rejected",
        life: 3000,
      });
    },
  });
};

</script>

<style scoped>
.notes-list {
  padding: 0;
}

.note {
  background-color: #f5f5f5;
  border: 2px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  min-height: 100px;
  font-size: 16px;
  align-items: center;
  list-style-type: none;
  margin-bottom: 15px;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.note-title-row{
  display: flex;
  justify-content: space-between;
}
.note-text {
  text-align: left;
}

.text-content {
  word-wrap: break-word;
  white-space: pre-wrap;
}
.note-title {
  font-weight: bold;
  text-transform: uppercase;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.notelist-header {
  text-align: center;
  margin-bottom: 2%;
  margin-top: 2%;
  color: black;
}

.card-footer {
  display: flex;
  justify-content: space-between;
}

.time-difference-text {
  text-decoration: underline;
}

@media (max-width: 564px) {
  .note-title-row {
    flex-direction: column;
  }
}
</style>

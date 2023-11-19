<template>
  <div>
    <h1 class="notelist-header">Notes</h1>
    <Toast />
    <ConfirmDialog />
    <ul class="notes-list">
      <Card class="note" v-for="item in listStore.list" :key="item.id">
        <template #title>
          <div class="note-title">{{ item.title }}</div>
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
              {{ itemTimeDifference(item) }}
            </div>
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
      </Card>
    </ul>
  </div>
</template>

<script setup>
import { onBeforeMount } from "vue"; 
import Button from "primevue/button";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import Card from "primevue/card";
import { useRouter } from "vue-router";
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

const itemTimeDifference = (item) => {
  console.log(item)
  const currentDate = new Date();
  const dueDate = new Date(item.completedByDate + " " + item.completedByTime);

  const timeDifference = dueDate - currentDate;
  const hoursDifference = Math.floor(timeDifference / (1000 * 60 * 60));
  const minutesDifference = Math.floor(
    (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
  );
  const secondsDifference = Math.floor((timeDifference % (1000 * 60)) / 1000);

  if (timeDifference <= 0) {
    return "Time expired";
  }
  if (hoursDifference === 0) {
    return `${minutesDifference} minutes and ${secondsDifference} seconds`;
  } else {
    return `${hoursDifference} hours and ${minutesDifference} minutes`;
  }
};

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
</style>

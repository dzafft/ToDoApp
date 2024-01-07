<template>
  <div>
    <div class="notemaker-container">
      <h1 class="create-note-header">Create Note</h1>
      <Toast />
      <ConfirmDialog />
      <Textarea
        :modelValue="titleStore.noteTitle"
        placeholder="Title..."
        id="titleTextarea"
        class="non-resizable-textarea"
        @update:modelValue="titleStore.updateNoteTitle"
      />
      <Textarea
        :modelValue="textStore.noteText"
        placeholder="Type away..."
        id="textTextarea"
        class="note-text non-resizable-textarea"
        @update:modelValue="textStore.updateNoteText"
      />
      <div class="time-container">
        <div class="datepicker-input">
          <label class="label-datepicker" for="datepicker"
            >Select a date:</label
          >
          <InputText
            id="datepicker"
            :min="getTodayDate()"
            type="date"
            v-model="completedByDate"
          />
          <small id="small-label"
            >Enter the date by which you would like this task completed.</small
          >
        </div>
        <div class="timepicker-input">
          <label id="small-label" for="timepicker">Select a time:</label>
          <InputText
            id="timepicker"
            type="time"
            min="00:00"
            max="23:59"
            v-model="completedByTime"
          />
          <small id="small-label">Enter the specific hour.</small>
        </div>
        <div class="create-note-button-container">
          <Button
          class="submit-button"
          size="large"
          @click="
            toUpdateStore.toUpdate ?
            onUpdateNote(updateIDStore.updateID, {
              title: titleStore.noteTitle,
              text: textStore.noteText,
              date: completedByDate,
              time: completedByTime,
            })
            :
            handleSubmitButtonClick({
              title: titleStore.noteTitle,
              text: textStore.noteText,
              date: completedByDate,
              time: completedByTime,
            })
          "
          :disabled="isSubmitButtonDisabled"
          :label="toUpdateStore.toUpdate ? 'Update' : 'Submit'"
        />
        <Button
          :disabled="isClearButtonDisabled"
          class="clear-button"
          severity="danger"
          size="large"
          label="Clear"
          @click="clearNote"
        />
        <Button
          @click="undoEdit"
          severity="success"
          size="small"
          v-if="toUpdateStore.toUpdate"
          >Cancel Update<i class="pi pi-undo"
        /></Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";
import {useTitleStore} from "../stores/noteTitle";
import {useTextStore} from "../stores/noteText";
import {useListStore} from "../stores/noteList";
import {useToUpdateStore} from "../stores/toUpdate";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";
import {useUpdateIDStore} from "../stores/updateID"

const titleStore = useTitleStore();
const textStore = useTextStore();
const listStore = useListStore();
const toUpdateStore = useToUpdateStore();
const updateIDStore = useUpdateIDStore();

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function undoEdit() {
  textStore.deleteText();
  titleStore.deleteTitle();
  completedByDate.value = getTomorrowDate();
  completedByTime.value = "10:00";
  toUpdateStore.userIsNotUpdating();
}

function clearNote() {
  textStore.deleteText();
  titleStore.deleteTitle();
  completedByDate.value = "";
  completedByTime.value = "";
}

function handleSubmitButtonClick(note){
  listStore.addNote(note);
  titleStore.deleteTitle();
  textStore.deleteText();
}

const confirm = useConfirm();
const toast = useToast();

const onUpdateNote = (id, note) => {
  const index = listStore.list.findIndex((item) => item.id === id);
  if (index === -1) {
    alert("You have deleted this note!");
    return;
  }
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
        acceptClass: "confirm-dialogue-accept",
        rejectClass: "confirm-dialogue-reject",
      });
      listStore.editNote(id, index, note);
      toUpdateStore.userIsNotUpdating();
      resetDates();
      textStore.deleteText();
      titleStore.deleteTitle();
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

const completedByDate = ref(getTomorrowDate());
const completedByTime = ref("10:00");

const isSubmitButtonDisabled = computed(() => {
  return (
    titleStore.noteTitle === "" ||
    textStore.noteText === "" ||
    completedByDate.value === "" ||
    completedByTime.value === ""
  );
});

const isClearButtonDisabled = computed(() => {
  return (
    titleStore.noteTitle === "" &&
    textStore.noteText === "" &&
    completedByDate.value === "" &&
    completedByTime.value === ""
  );
});

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function resetDates(){
  completedByDate.value = getTomorrowDate();
  completedByTime.value = "10:00";
}

</script>

<style scoped>
textarea {
  width: 100%;
  padding: 1%;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
}

.create-note-header {
  text-align: center;
  margin-bottom: 2%;
  color: black;
}

.non-resizable-textarea {
  resize: vertical;
  width: 100%;
  max-width: 100%;
}

.note-text {
  min-height: 100px;
}

.timepicker-input {
  display: flex;
  flex-direction: column;
  margin-right: 4%;
  flex-grow: 1;
}

.label-datepicker {
  color: black;
}

.time-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

#small-label {
  color: black;
}

.create-note-button-container{
  margin-top: 1%;
  flex-grow: 1;
  flex-wrap: wrap; 
}

.create-note-button-container button{
  margin-right: 3%;
}

.datepicker-input {
  display: flex;
  flex-direction: column;
  margin-right: 4%;
  flex-grow: 1;
}

.notemaker-container {
  display: flex;
  flex-direction: column;
}

@media (max-width: 846px) {
  .create-note-button-container{
    width: 100%;
  }
}

@media (max-width: 564px) {
  .timepicker-input {
    margin-top: 4%;
    width: 100%;
    margin-right: 0;
  }
  .datepicker-input {
    margin-top: 4%;
    width: 100%;
    margin-right: 0;
  }
  .calendar-inputs{
    flex-direction: column;
  }
}
</style>

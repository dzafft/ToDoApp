<template>
  <div>
    <div class="notemaker-container">
      <h1 style="color: black" class="create-note-header">Create Note</h1>
      <Toast />
      <ConfirmDialog />
      <Textarea
        :value="noteTitle"
        placeholder="Title..."
        class="non-resizable-textarea"
        @input="$emit('update:noteTitle', $event.target.value)"
      />
      <Textarea
        :value="noteText"
        placeholder="Type away..."
        class="note-text non-resizable-textarea"
        @input="$emit('update:noteText', $event.target.value)"
      />
      <div class="time-container">
        <div class="datepicker-input">
          <label style="color: black" for="datepicker">Select a date:</label>
          <InputText
            id="datepicker"
            :min="getTodayDate()"
            type="date"
            :value="completedByDate"
            @input="$emit('update:completedByDate', $event.target.value)"
          />
          <small style="color: black" id="username-help"
            >Enter the date by which you would like this task completed.</small
          >
        </div>
        <div class="timepicker-input">
          <label style="color: black" for="timepicker">Select a time:</label>
          <InputText
            id="timepicker"
            type="time"
            min="00:00"
            max="23:59"
            :value="completedByTime"
            @input="$emit('update:completedByTime', $event.target.value)"
          />
          <small style="color: black" id="username-help"
            >Enter the specific hour.</small
          >
        </div>
        <Button
          class="submit-button"
          size="large"
          @click="
            $emit('handleButtonClick', {
              title: noteTitle,
              text: noteText,
              date: completedByDate,
              time: completedByTime,
            })
          "
          :disabled="isSubmitButtonDisabled"
          :label="toUpdate ? 'Update' : 'Submit'"
        />
        <Button
          :disabled="isClearButtonDisabled"
          class="clear-button"
          severity="danger"
          size="large"
          label="Clear"
          @click="$emit('clearNote')"
        />
        <Button
          severity="success"
          size="small"
          @click="$emit('undoEdit')"
          v-if="toUpdate"
          >Cancel Update<i class="pi pi-undo"></i
        ></Button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import "primevue/resources/themes/lara-light-indigo/theme.css";
import "primeicons/primeicons.css";
import Toast from "primevue/toast";
import ConfirmDialog from "primevue/confirmdialog";

const isSubmitButtonDisabled = computed(() => {
  return (
    props.noteTitle === "" ||
    props.noteText === "" ||
    props.completedByDate === "" ||
    props.completedByTime === ""
  );
});

const isClearButtonDisabled = computed(() => {
  return (
    props.noteTitle === "" &&
    props.noteText === "" &&
    props.completedByDate === "" &&
    props.completedByTime === ""
  );
});

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const props = defineProps({
  noteTitle: {
    type: String,
  },
  noteText: {
    type: String,
  },
  completedByDate: {
    type: String,
  },
  completedByTime: {
    type: String,
  },
  list: {
    type: Array,
  },
  toUpdate: {
    type: Boolean,
  },
});

const emit = defineEmits([
  "finishUpdate",
  "clearNote",
  "handleButtonClick",
  "update:completedByTime",
  "update:completedByDate",
  "update:noteTitle",
  "update:noteText",
]);
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
}

.time-container {
  display: flex;
  align-items: center;
}

.time-container > * {
  margin-right: 4%;
}
.datepicker-input {
  display: flex;
  flex-direction: column;
}

.notemaker-container {
  display: flex;
  flex-direction: column;
}

</style>

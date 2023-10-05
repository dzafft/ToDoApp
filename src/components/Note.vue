<script setup>
import { ref, onMounted, onBeforeUnmount, computed  } from 'vue';

const list = ref([]);
const noteText = ref('');
const noteTitle = ref('');
const toUpdate = ref(false);
const updateIndex = ref(null);
const completedByDate = ref('');
const completedByTime = ref('');

onMounted(() => {
  const savedList = localStorage.getItem('notes');
  if (savedList) {
    list.value = JSON.parse(savedList);
  }
});

onBeforeUnmount(() => {
  localStorage.setItem('notes', JSON.stringify(list.value));
  console.log('Saved data to localStorage:', list.value);
});

function getCurrentDateFormatted() {
  const now = new Date();
  return `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}

const currentTime = computed(() => {
  return Math.floor(new Date().getTime() / 1000); // Current time in seconds
});

function calculateRemainingSeconds(note) {
  const deadline = new Date(note.completedByDate + ' ' + note.completedByTime).getTime() / 1000; // Deadline in seconds
  return Math.max(deadline - currentTime.value, 0); // Remaining seconds, ensuring it's not negative
}

function clearUpdateNote() {
  noteText.value = '';
  noteTitle.value = '';
  toUpdate.value = false; // Set `toUpdate` to `false`
  completedByDate.value = '';
  completedByTime.value = '';

}


function handleButtonClick(){

  const date1 = completedByDate.value + " " + completedByTime.value;
  const date2 = getCurrentDateFormatted();
  const timeDifferenceInSeconds = calculateSecondsDifference(date1, date2);
  console.log(timeDifferenceInSeconds);

  if (timeDifferenceInSeconds <= 0){
    alert("Time difference cannot be negative!");
    return;
  }
  console.log(completedByDate.value, completedByTime.value)
  if (toUpdate.value === false){
    if (noteText.value && noteTitle.value && completedByDate.value && completedByDate.value){
      const newNote = {
        title: noteTitle.value,
        text: noteText.value,
        createdDate: date2,
        completedByDate: completedByDate.value,
        completedByTime: completedByTime.value
      };
      list.value.push(newNote);
      localStorage.setItem('notes', JSON.stringify(list.value));
      noteText.value = '';
      noteTitle.value = '';
      completedByDate.value = '';
      completedByTime.value = '';
    }
  }
  else{

    const date1 = completedByDate.value + " " + completedByTime.value;
    const date2 = getCurrentDateFormatted();
    const timeDifferenceInSeconds = calculateSecondsDifference(date1, date2);
    console.log(timeDifferenceInSeconds);

    if (timeDifferenceInSeconds <= 0){
      alert("Time difference cannot be negative!");
      return;
    }
    // const timeLeft = getTimeLeft(timeDifferenceInSeconds);


    const updatedNote = {
      title: noteTitle.value,
      text: noteText.value,
      createdDate: list.value[updateIndex.value].createdDate,
      completedByDate: completedByDate.value,
      completedByTime: completedByTime.value
    }

    console.log(updatedNote)
    
    list.value[updateIndex.value] = updatedNote
    localStorage.setItem('notes', JSON.stringify(list.value));
  }
  
}

function updateNote(index){
  toUpdate.value = true;
  updateIndex.value = index;
  const noteToUpdate = list.value[index];
  noteTitle.value = noteToUpdate.title;
  noteText.value = noteToUpdate.text;
  completedByDate.value = noteToUpdate.completedByDate;
  completedByTime.value = noteToUpdate.completedByTime;


}


function deleteNote(index){
  list.value.splice(index, 1);
  localStorage.setItem('notes', JSON.stringify(list.value));
}

const remainingTime = computed(() => {
  return list.value.map((note) => {
    const remainingSeconds = calculateRemainingSeconds(note);

    if (remainingSeconds === 0) {
      return "Time's up!"; // Display this message when time is 0 seconds
    }

    // Calculate years
    const years = Math.floor(remainingSeconds / (60 * 60 * 24 * 365));

    // Calculate months (assuming 30 days per month)
    const months = Math.floor((remainingSeconds % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));

    // Calculate weeks
    const weeks = Math.floor((remainingSeconds % (60 * 60 * 24 * 30)) / (60 * 60 * 24 * 7));

    // Calculate days
    const days = Math.floor((remainingSeconds % (60 * 60 * 24 * 7)) / (60 * 60 * 24));

    // Calculate hours
    const hours = Math.floor((remainingSeconds % (60 * 60 * 24)) / (60 * 60));

    // Calculate minutes
    const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);

    const timeLeftArray = [];

    // Add units to the timeLeftArray if they are greater than 0
    if (years > 0) timeLeftArray.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
    if (months > 0) timeLeftArray.push(`${months} ${months === 1 ? 'Month' : 'Months'}`);
    if (weeks > 0) timeLeftArray.push(`${weeks} ${weeks === 1 ? 'Week' : 'Weeks'}`);
    if (days > 0) timeLeftArray.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);
    if (hours > 0) timeLeftArray.push(`${hours} ${hours === 1 ? 'Hour' : 'Hours'}`);
    if (minutes > 0) timeLeftArray.push(`${minutes} ${minutes === 1 ? 'Minute' : 'Minutes'}`);

    // Construct the timeLeft string
    const timeLeftString = timeLeftArray.join(', ');

    console.log(`You have ${timeLeftString} left.`);

    return `You have ${timeLeftString} left.`;
  });
});

function calculateSecondsDifference(date1Str, date2Str) {
  const date1 = new Date(date1Str);
  const date2 = new Date(date2Str);

  // Calculate the time difference in milliseconds
  const timeDifference = date1 - date2;

  // Convert milliseconds to seconds
  const secondsDifference = Math.floor(timeDifference / 1000);

  return secondsDifference;
}



</script>

<template>
  <div>
      <div class="notemaker-container">
        <h1>Note</h1>
        <textarea v-model="noteTitle" placeholder="Title..."></textarea>
        <textarea class="noteText" v-model="noteText" placeholder="Type away..."></textarea>
        <div class="notemaker-bottomRow">
          <p>Due by:</p>
          <input type="date" v-model="completedByDate">
          <input type="time" min="00:00" max="23:59" v-model="completedByTime">
        </div>
        <div>
          <button class="note-button" @click="handleButtonClick()">
              {{ toUpdate ? 'Update' : 'Submit' }}
          </button>
          <button class="note-button" @click="clearUpdateNote">Clear</button>
        </div>
        
        
      </div>
      <div>
        <h1 class="notelist-header">Notes</h1>
        <ul class="notes-list">
          <li class="note" v-for="(item, index) in list" :key="index">
            <div class="note-title">{{ item.title }}</div>
            <div class="note-text">{{ item.text }}</div>
            <div class="note-timeLeft" >{{ remainingTime[index] }}</div>
            <button @click="deleteNote(index)" class="delete-button">Delete</button>
            <button @click="updateNote(index)" class="update-button">Update</button>

          </li>
        </ul>
        
      </div>
  </div>
</template>

<style scoped>

/* Style the textarea for note entry */
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  margin-bottom: 10px;
}

.noteText{
  min-height: 100px;
}


.notemaker-bottomRow > *{
  margin-right: 5%;
}

/* Style the submit button */
.note-button {
  background-color: #007acc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  margin-right: 5%;
  margin-top: 2%;
  width: 10%;
}

/* Style the submit button on hover */
.note-button:hover {
  background-color: #005a9c;
}

.notemaker-container{
  display: flex;
  flex-direction: column;
}
.note {
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  text-align: center;
  align-items: center;
  list-style-type: none;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  min-height: 50px;

}

.note-title{
  font-weight: bold;
}

.note-text{
  flex-grow: 1;
}

.notelist-header{
  text-align: center;
  margin-bottom: 2%;
}

.delete-button {
  background-color: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 2%;
}

.delete-button:hover{
  background-color: wheat;
  color:#ff4444;
}

.update-button:hover{
  background-color: wheat;
  color:green;
}

.update-button{
  background-color: green;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 15px;
  margin-left: 5px;
}

</style>
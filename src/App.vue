<script setup>
import Note from './components/Note.vue'
</script>

<template>
  <div>
    <header>
      <h1>Notes Website</h1>
      <p>Create and delete notes</p>
    </header>
    <main>
      <Note />
    </main>
  </div>
</template>

<style scoped>
/* Styles scoped to this component */

/* Style the header element */
header {
  background-color: #007acc;
  color: white;
  padding: 20px;
  text-align: center;
}

/* Style the h1 element inside the header */
header h1 {
  font-size: 36px;
}

/* Style the p element inside the header */
header p {
  font-size: 18px;
}

/* Style the main content area */
main {
  padding: 20px;
}


</style>

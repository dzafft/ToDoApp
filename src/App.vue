<template>
  <div class="app-container">
    <header>
      <h1>Notes Website</h1>
      <div class="content-container">
        <nav class="navbar">
          <router-link :to="{ name: 'createnote' }">Create Note</router-link> 
          <router-link :to="{ name: 'notelist' }">Note List</router-link>
        </nav>
      </div>
    </header>
    <main>
      <router-view/>
    </main>
  </div>
</template>


<style scoped>
main {
  margin: 0;
  background-color: white;
  height: 100vh;
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

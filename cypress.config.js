const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    e2e: {
      baseUrl: "http://localhost:3000",
    },
  },

  projectId: "dr1vc3",

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});

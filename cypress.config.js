const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'dr1vc3',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});


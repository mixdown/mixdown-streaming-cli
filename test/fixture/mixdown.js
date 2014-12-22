module.exports = {
  "app": {
    "plugins": {}
  },
  "logger": {
    "level": "debug",
    "console": {
      "color": true
    },
    "name": "unit-test"
  },
  "services": {
    "options": {
      "paths": [
        "./test/fixture/services"
      ]
    }
  },
  "main": {
    "module": "mixdown-cli",
    "options": {
      "delegate": {
        "module": "./lib/delegate.js",
        "options": {}
      }
    }
  }
}
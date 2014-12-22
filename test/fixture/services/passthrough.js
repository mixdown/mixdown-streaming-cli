module.exports = {
  plugins: {
    source: {
      module: "./lib/input/array.js",
      options: {
        items: require('../random_array.js')
      }
    },
    transform: {
      module: "./lib/transform/passthrough.js"
    },
    output: {
      module: "./lib/output/memory.js",
      options: {}
    }

  },
  id: "passthrough"
};
const config = {
  mode: "jit",
  purge: ["./src/**/*.{html,js,svelte,ts}", "index.html"],

  theme: {
    extend: {},
  },

  plugins: [require("@tailwindcss/forms")],
};

module.exports = config;

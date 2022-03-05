const config = {
  content: ["./src/**/*.{html,js,svelte,ts}", "index.html"],

  theme: {
    extend: {},
  },

  plugins: [require("@tailwindcss/forms")],
};

module.exports = config;

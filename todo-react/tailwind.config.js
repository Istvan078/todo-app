/** @type {import("tailwindcss").Config} */
export default {
  darkMode: ["class"],
  // tell tailwind where to look for files
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

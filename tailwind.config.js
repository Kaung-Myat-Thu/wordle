/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      keyframes: {
        flip: {
          "0%, 100%": { transform: "rotateX(0deg)" },
          "50%": { transform: "rotateX(90deg)" },
        },
        scale: {
          "0%": { transform: "scale(0)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        flip: "flip 500ms ease-in-out ",
        scale: "scale 500ms ease-in-out ",
      },
    },
  },
  plugins: [],
};

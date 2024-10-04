/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./public/**/*.{html,js}"],
    theme: {
        extend: {
            fontFamily: {
                popins: ["Poppins", "sans-serif"],
            },
            padding: {
                dynamic: "calc(100vh - 52px)",
            },
        },
    },
    plugins: [],
};

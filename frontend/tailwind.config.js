export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                harvest: "#F5A623",
                olive: "#C8B400",
                cream: "#FFF8D6",
                forest: "#4A5C1A",
                rust: "#C0390A",
            },
            fontFamily: {
                display: ["Playfair Display", "serif"],
                body: ["Nunito", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
        },
    },
    plugins: [],
}

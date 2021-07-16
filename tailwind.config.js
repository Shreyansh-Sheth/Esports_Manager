module.exports = {
  //mode: "jit",
  purge: {
    safelist: [/match*/],
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./src/components/**/*.{js,ts,jsx,tsx}",
    ],
  },

  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      typography(theme) {
        return {
          dark: {
            css: {
              color: theme("colors.gray.300"),
              '[class~="lead"]': { color: theme("colors.gray.400") },
              strong: { color: theme("colors.gray.100") },
              "ol,ul": {
                listStyle: "none",
                counterReset: "li",
              },
              li: {
                counterIncrement: "li",
              },
              "ul li::before": {
                // backgroundColor: theme("colors.gray.700"),
                content: "'►'",
                color: theme("colors.primary.400"),
                fontWeight: "bold",
                display: "inline-block",
                width: "1em",
                marginLeft: "-1em",
              },
              "ol li::before": {
                content: "counter(li)'.'",
                color: theme("colors.primary.400"),
                display: "inline-block",
                width: "1em",
                marginLeft: "-1em",
                paddingRight: "20px",
              },
              hr: { borderColor: theme("colors.gray.800") },
              blockquote: {
                color: theme("colors.gray.100"),
                borderLeftColor: theme("colors.gray.800"),
              },
              h1: { color: theme("colors.gray.100") },
              h2: { color: theme("colors.gray.100") },
              h3: { color: theme("colors.gray.100") },
              h4: { color: theme("colors.gray.100") },
              code: { color: theme("colors.gray.100") },
              "a code": { color: theme("colors.gray.100") },
              pre: {
                color: theme("colors.gray.200"),
                backgroundColor: theme("colors.gray.800"),
              },
              thead: {
                color: theme("colors.primary.50"),
                borderBottomColor: theme("colors.primary.400"),
              },
              "tbody tr": { borderBottomColor: theme("colors.primary.800") },
            },
          },
        };
      },
      fontFamily: {
        display: ["Roboto Mono", "Menlo", "monospace"],
        body: ["Roboto Mono", "Menlo", "monospace"],
      },
      colors: {
        primary: {
          50: "#f7fee7",
          100: "#ecfccb",
          200: "#d9f99d",
          300: "#bef264",
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
          700: "#4d7c0f",
          800: "#3f6212",
          900: "#365314",
        },
        gray: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
        },
      },
      screens: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        "2xl": "1400px",
      },
    },
  },
  variants: {
    extend: {
      typography: ["dark"],
      backgroundColor: ["active"],
      ringWidth: ["hover", "active"],
      outline: ["hover", "active", "focus"],
      fontWeight: ["hover", "focus"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-text-decoration-color"),
  ],
};

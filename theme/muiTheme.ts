import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    primary: {
      main: "#4F46E5", // Match Tailwind primary
    },
    secondary: {
      main: "#22C55E", // Match Tailwind secondary
    },
    background: {
      default: "#F9FAFB", // Match Tailwind background
      paper: "#FFFFFF", // Match Tailwind surface
    },
    text: {
      primary: "#1F2937", // Dark text for readability
      secondary: "#64748B", // Muted text color
    },
  },
  shape: {
    borderRadius: 24, // Match Tailwind's border radius (1.5rem = 24px)
  },
  shadows: [
    "none",
    "0px 2px 8px rgba(0, 0, 0, 0.15)", // Match Tailwind button shadow
    "none", // 2
    "none", // 3
    "none", // 4
    "none", // 5
    "none", // 6
    "none", // 7
    "none", // 8
    "none", // 9
    "none", // 10
    "none", // 11
    "none", // 12
    "none", // 13
    "none", // 14
    "none", // 15
    "none", // 16
    "none", // 17
    "none", // 18
    "none", // 19
    "none", // 20
    "none", // 21
    "none", // 22
    "none", // 23
    "none", // 24
  ],
  typography: {
    fontFamily: `'Roboto', sans-serif`, // Use Tailwind's suggested font
    button: {
      textTransform: "none", // Remove uppercase by default
    },
  },
});

export default muiTheme;

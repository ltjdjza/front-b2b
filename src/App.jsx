import "./App.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Dashboard from "./pages/Dashboard";
import { CssBaseline } from "@mui/material";

//Tema para la aplicacion

const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />{/*Normalizar esticlos basicos */}
      <Dashboard />
    </ThemeProvider>
  );
}

export default App;

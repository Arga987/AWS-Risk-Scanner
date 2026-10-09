import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/context/ThemeProvider";
import AppRoutes from "./AppRoutes";

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

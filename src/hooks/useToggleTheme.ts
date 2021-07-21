import { createTheme } from "@material-ui/core";
import useLocalStorage from "./useLocalStorage";

const useToggleTheme = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage("theme", false);

  const palletType = isDarkMode ? "dark" : "light";

  const theme = createTheme({
    palette: {
      type: palletType,
    },
  });

  function toggleHandler() {
    setIsDarkMode((prevState) => {
      return !prevState;
    });
  }

  return { isDarkMode, theme, toggleHandler };
};

export default useToggleTheme;

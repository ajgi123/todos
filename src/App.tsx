import { CssBaseline, ThemeProvider } from "@material-ui/core";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Redirect, Route, Switch } from "react-router-dom";
import ErrorFallback from "./components/error-fallback/ErrorFallback";
import FullPageSpinner from "./components/full-page-spinner/FullPageSpinner";
import Navbar from "./components/navbar/Navbar";
import PageNotFound from "./components/page-not-found/PageNotFound";
import PrivateRoute from "./components/protected-route/PrivateRoute";
import useToggleTheme from "./hooks/useToggleTheme";
import SignIn from "./pages/sign-in/SignIn";
import SignUp from "./pages/sign-up/SignUp";

const TodoList = React.lazy(() => import("./pages/todo-list/TodoList"));

function App() {
  const { theme, isDarkMode, toggleHandler } = useToggleTheme();
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        localStorage.clear();
        window.location.reload(false);
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar isDarkMode={isDarkMode} toggleHandler={toggleHandler} />
        <Suspense fallback={<FullPageSpinner />}>
          <Switch>
            <Route exact path="/">
              <SignIn />
            </Route>
            <Route path="/signup">
              <SignUp />
            </Route>
            <PrivateRoute componentPath="/todos" rederictToPath="/">
              <TodoList />
            </PrivateRoute>
            <Route path="/404">
              <PageNotFound />
            </Route>
            <Redirect to="/404" />
          </Switch>
        </Suspense>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

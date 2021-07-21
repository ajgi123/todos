import { ReactNode } from "react";
import { Redirect, Route } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

type PrivateRoutePropsType = {
  children: ReactNode;
  componentPath: string;
  rederictToPath: string;
};

const PrivateRoute = ({
  children,
  componentPath,
  rederictToPath,
}: PrivateRoutePropsType) => {
  const { isAuthenticated } = useAuth();
  return (
    <Route
      path={componentPath}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: rederictToPath,
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;

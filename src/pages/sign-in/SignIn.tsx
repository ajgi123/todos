import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Field, Form, Formik, FormikProps } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import { FormTextField } from "../../components/form-text-field/FormTextField";
import {
  REFRESH_TOKEN_LOCAL_STORAGE,
  useAuth,
} from "../../context/AuthProvider";
import { localStorageService } from "../../helpers/localStorageService";
import { Action } from "../../hooks/useAsync";
import { useStyles } from "../shared/style";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

export default function SignIn() {
  const classes = useStyles();
  const { loginUser, status, userData, error } = useAuth();
  const [rememberMe, setRemeberMe] = useState(false);
  let history = useHistory();

  function submitHandler(email: string, password: string) {
    loginUser(email, password);
  }

  function clickHandler() {
    setRemeberMe((curState) => !curState);
  }

  useEffect(() => {
    if (status === Action.resolved && userData) {
      if (rememberMe && userData) {
        localStorageService.setItem(
          REFRESH_TOKEN_LOCAL_STORAGE,
          userData.refreshToken
        );
      }
      history.push("/todos");
    }
  }, [status, history, rememberMe, userData]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Formik
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => submitHandler(values.email, values.password)}
          validationSchema={validationSchema}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <Field
                name="email"
                margin="normal"
                placeholder="Email"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                component={FormTextField}
              />
              <Field
                name="password"
                margin="normal"
                placeholder="password"
                required
                fullWidth
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                component={FormTextField}
              />
              <Tooltip
                title="Refresh token will be stored in local storage"
                arrow
              >
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                  value={rememberMe}
                  onClick={clickHandler}
                />
              </Tooltip>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={status === Action.pending}
              >
                {status === Action.pending ? <CircularProgress /> : "Sign In"}
              </Button>

              <Grid
                container
                justifyContent="center"
                direction="column"
                alignItems="center"
              >
                {status === Action.rejected && (
                  <Grid item>
                    <Typography variant="subtitle1">{error}</Typography>
                  </Grid>
                )}
                <Grid item>
                  <Link
                    variant="body2"
                    color="inherit"
                    component={RouterLink}
                    to="/signup"
                  >
                    Don't have an account? Sign Up
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
}

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Field, Form, Formik, FormikProps } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import { FormTextField } from "../../components/form-text-field/FormTextField";
import { useAuth } from "../../context/AuthProvider";
import { Action } from "../../hooks/useAsync";
import { useStyles } from "../shared/style";

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must contain atleast 8 characters")
    .required("Enter your password"),
  confirmPassword: yup
    .string()
    .required("Confirm your password")
    .oneOf([yup.ref("password")], "Password does not match"),
});

const SignUp = () => {
  const classes = useStyles();
  const { signUpUser, status, error } = useAuth();
  let history = useHistory();

  function submitHandler(email: string, password: string, name: string) {
    signUpUser(email, password, name);
  }

  useEffect(() => {
    if (status === Action.resolved) {
      history.push("/todos");
    }
  }, [status, history]);

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Formik
          initialValues={{
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          onSubmit={(values) =>
            submitHandler(values.email, values.password, values.name)
          }
          validationSchema={validationSchema}
        >
          {(props: FormikProps<any>) => (
            <Form>
              <Field
                name="name"
                margin="normal"
                placeholder="Email"
                required
                fullWidth
                id="name"
                label="Name"
                autoFocus
                component={FormTextField}
              />
              <Field
                name="email"
                margin="normal"
                placeholder="Email"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
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
                component={FormTextField}
              />
              <Field
                name="confirmPassword"
                margin="normal"
                placeholder="password"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                id="confirmpassword"
                component={FormTextField}
              />
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
                    to="/"
                  >
                    Already have an account? Sign In
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
    </Container>
  );
};

export default SignUp;

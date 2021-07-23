import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Container from "@material-ui/core/Container";
import { Field, Form, Formik, FormikProps } from "formik";
import React, { useRef } from "react";
import * as yup from "yup";
import { UpdateAddArgsType } from "../../hooks/useTodos";
import { FormTextField } from "../form-text-field/FormTextField";

interface AddTodoPropsType {
  addTodo: ({ localId, todo }: UpdateAddArgsType) => void;
  localId: string;
  isLoadingAdd: boolean;
  initialValue?: string;
}

const validationSchema = yup.object({
  todo: yup
    .string()
    .required("Name is required")
    .min(3, "Todo must be at least 3 characters")
    .max(35, "Todo must be not longer than 35 characters"),
});

const AddTodo = ({
  addTodo,
  localId,
  isLoadingAdd,
  initialValue = "",
}: AddTodoPropsType) => {
  const formikRef = useRef<FormikProps<{ todo: string }> | null>(null);

  function submitHandler(todoTitle: string) {
    addTodo({
      localId: localId,
      todo: { id: 1, title: todoTitle, done: false },
    });
    formikRef.current?.resetForm();
  }

  return (
    <Container component="main" maxWidth="md">
      <Formik
        innerRef={formikRef}
        initialValues={{
          todo: initialValue,
        }}
        onSubmit={(values) => submitHandler(values.todo)}
        validationSchema={validationSchema}
      >
        {(props: FormikProps<any>) => (
          <Form>
            <Field
              name="todo"
              margin="normal"
              placeholder="Todo"
              required
              fullWidth
              id="Todo"
              label="Todo"
              component={FormTextField}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={isLoadingAdd}
            >
              {isLoadingAdd ? <CircularProgress /> : "Submit"}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default AddTodo;

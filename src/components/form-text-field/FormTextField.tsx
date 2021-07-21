import { TextField, TextFieldProps } from "@material-ui/core";
import { FieldProps, getIn } from "formik";
import React from "react";

type Props = FieldProps & TextFieldProps;
export const FormTextField = (props: Props) => {
  const isTouched = getIn(props.form.touched, props.field.name);
  const errorMessage = getIn(props.form.errors, props.field.name);

  const { error, helperText, field, form, ...rest } = props;

  return (
    <TextField
      variant="outlined"
      error={error ?? Boolean(isTouched && errorMessage)}
      helperText={
        helperText ?? (isTouched && errorMessage ? errorMessage : undefined)
      }
      {...rest}
      {...field}
    />
  );
};

import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import { useEffect, useState } from "react";
import AddTodo from "../../components/add-todo/AddTodo";
import ErrorDialog from "../../components/error-dialog/ErrorDialog";
import FullPageSpinner from "../../components/full-page-spinner/FullPageSpinner";
import Todo from "../../components/todo/Todo";
import { useAuth } from "../../context/AuthProvider";
import useTodos, { TodoInterface } from "../../hooks/useTodos";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    absolute: {
      position: "absolute",
      zIndex: 3,
    },
  })
);

const initialState: TodoInterface[] = [];

const TodoList = () => {
  const [isOpenError, setIsOpenError] = useState(false);
  const { userData, logOutUser } = useAuth();
  const classes = useStyles();
  const localId = userData ? userData.localId : "";
  const {
    data,
    isFetching,
    isError,
    update,
    isLoadingUpdate,
    remove,
    isLoadingRemove,
    add,
    isLoadingAdd,
    mutatingTodoId,
  } = useTodos(initialState);

  useEffect(() => {
    if (isError) {
      setIsOpenError(true);
    }
  }, [isError]);

  function handleClose() {
    localStorage.clear();
    logOutUser();
    setIsOpenError(false);
  }

  let todosJSX: JSX.Element | JSX.Element[] = (
    <Typography variant="body1">Add your first Todo</Typography>
  );

  if (isFetching) {
    todosJSX = <FullPageSpinner />;
  }

  if (data && data.length) {
    todosJSX = data.map((todo) => {
      return (
        <Todo
          id={todo.id}
          title={todo.title}
          done={todo.done}
          key={todo.id}
          removeTodo={remove}
          isLoadingRemove={isLoadingRemove}
          updateTodo={update}
          isLoadingUpdate={isLoadingUpdate}
          localId={localId}
          isMutating={mutatingTodoId === todo.id}
        />
      );
    });
  }

  return (
    <Box
      paddingTop="5rem"
      width="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <ErrorDialog open={isOpenError} handleClose={handleClose} />
      {isFetching && (
        <CircularProgress size={80} className={classes.absolute} />
      )}
      <AddTodo addTodo={add} localId={localId} isLoadingAdd={isLoadingAdd} />
      {todosJSX}
    </Box>
  );
};

export default TodoList;

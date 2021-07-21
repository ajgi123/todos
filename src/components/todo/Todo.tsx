import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Paper from "@material-ui/core/Paper";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import usePropsRelatedState from "../../hooks/usePropsRelatedState";
import { UpdateAddArgsType } from "../../hooks/useTodos";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      margin: theme.spacing(2),
      width: "100%",
    },
    paper: {
      padding: theme.spacing(2),
      margin: "auto",
      maxWidth: 1000,
    },
    desktop: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    mobile: {
      display: "block",
      [theme.breakpoints.up("sm")]: {
        display: "none",
      },
    },
  })
);

type TodoPropsType = {
  id: number;
  title: string;
  done: boolean;
  localId: string;
  removeTodo: ({ localId, id }: { localId: string; id: number }) => void;
  isLoadingRemove: boolean;
  updateTodo: ({ localId, todo }: UpdateAddArgsType) => void;
  isLoadingUpdate: boolean;
  isMutating: boolean;
};

const Todo = (props: TodoPropsType) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = usePropsRelatedState(props.title, [isEditing]);
  const [done] = usePropsRelatedState(props.done, []);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function editCancelHandler() {
    setIsEditing((prevState) => !prevState);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setTitle(event.target.value);
  }

  function checkBoxHandler() {
    props.updateTodo({
      localId: props.localId,
      todo: { id: props.id, title: props.title, done: !done },
    });
  }

  function removeHandler() {
    props.removeTodo({ localId: props.localId, id: props.id });
  }

  function submitHandler(event: SyntheticEvent) {
    event.preventDefault();

    setIsEditing(false);
    props.updateTodo({
      localId: props.localId,
      todo: { id: props.id, title: title, done: props.done },
    });
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const isMenuOpen = Boolean(anchorEl);
  const menuId = "mobile-todo-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={editCancelHandler}>
        {isEditing ? "Cancel" : "Edit"}
      </MenuItem>
      <MenuItem onClick={removeHandler}>Remove</MenuItem>
    </Menu>
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="space-around"
          alignItems="center"
        >
          <Grid item xs>
            {isEditing ? (
              <form onSubmit={submitHandler}>
                <Input
                  id="component-simple"
                  value={title}
                  onChange={handleChange}
                />
                <Button type="submit">Change</Button>
              </form>
            ) : props.isLoadingUpdate && props.isMutating ? (
              <CircularProgress />
            ) : (
              <Typography gutterBottom variant="subtitle1">
                {props.title}
              </Typography>
            )}
          </Grid>
          <Grid item>
            {props.isLoadingUpdate && props.isMutating ? (
              <CircularProgress />
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={done}
                    onChange={checkBoxHandler}
                    name="checkedB"
                    color="primary"
                  />
                }
                label="Done"
              />
            )}
          </Grid>
          <Grid item className={classes.mobile}>
            {props.isLoadingRemove && props.isMutating ? (
              <CircularProgress />
            ) : (
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
              >
                <MoreVertIcon />
              </IconButton>
            )}
          </Grid>
          <Grid item className={classes.desktop}>
            <Button
              variant="contained"
              color="primary"
              onClick={editCancelHandler}
            >
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </Grid>
          <Grid item className={classes.desktop}>
            {props.isLoadingRemove && props.isMutating ? (
              <CircularProgress />
            ) : (
              <IconButton onClick={removeHandler}>
                <DeleteIcon />
              </IconButton>
            )}
          </Grid>
        </Grid>
      </Paper>
      {renderMenu}
    </div>
  );
};

export default Todo;

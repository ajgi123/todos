import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../context/AuthProvider";
import useInterceptor from "./useInterceptor";

export interface TodoInterface {
  id: number;
  title: string;
  done: boolean;
}

const todoApi = axios.create({
  baseURL: `${process.env.REACT_APP_FIREBASE_URL}`,
});

const getTodos = (localId: string): Promise<TodoInterface[]> =>
  todoApi
    .get(`/users/${localId}/todo.json`)
    .then((res) => res.data)
    .then((data) => {
      if (data) {
        return Object.values(data);
      }
      return [];
    });

export type UpdateAddArgsType = {
  localId: string;
  todo: TodoInterface;
};

const updateTodo = ({ localId, todo }: UpdateAddArgsType) =>
  todoApi.patch(`/users/${localId}/todo/${todo.id}.json`, todo);

const deleteTodo = ({ localId, id }: { localId: string; id: number }) =>
  todoApi.delete(`/users/${localId}/todo/${id}.json`);

const date = new Date();
let counter = date.getTime();

const addTodo = ({ localId, todo }: UpdateAddArgsType) => {
  const id = (counter += 1);
  todo.id = id;
  return todoApi.put(`/users/${localId}/todo/${id}.json`, todo);
};

const initialId = -1;

const useTodos = (initialState: TodoInterface[]) => {
  const { userData, addTokenToHeader, refreshTokenOn401 } = useAuth();
  useInterceptor(todoApi, {
    requestFunc: addTokenToHeader,
    responseErrorFunc: refreshTokenOn401,
  });
  const [mutatingTodoId, setMutatingTodoId] = useState(initialId);
  const localId = userData ? userData.localId : "";
  const queryClient = useQueryClient();
  const {
    data,
    isError: isErrorGet,
    isLoading,
    isFetching,
  } = useQuery(["todo", localId], () => getTodos(localId), {
    initialData: initialState,
  });
  const configMutate = {
    onSuccess: () => {
      setMutatingTodoId(-1);
      queryClient.invalidateQueries();
    },
  };
  const {
    isLoading: isLoadingAdd,
    isError: isErrorAdd,
    isSuccess: isSuccessAdd,
    mutate: add,
  } = useMutation(addTodo, configMutate);
  const {
    isLoading: isLoadingUpdate,
    isError: isErrorUpdate,
    mutate: update,
  } = useMutation(updateTodo, {
    ...configMutate,
    onMutate: (object) => {
      setMutatingTodoId(object.todo.id);
    },
  });
  const {
    isLoading: isLoadingRemove,
    isError: isErrorRemove,
    mutate: remove,
  } = useMutation(deleteTodo, {
    ...configMutate,
    onMutate: (object) => {
      setMutatingTodoId(object.id);
    },
  });

  const isError = isErrorAdd || isErrorGet || isErrorRemove || isErrorUpdate;

  return {
    data,
    isError,
    isLoading,
    isFetching,
    isLoadingAdd,
    isErrorAdd,
    isSuccessAdd,
    add,
    isLoadingUpdate,
    isErrorUpdate,
    update,
    isLoadingRemove,
    isErrorRemove,
    remove,
    mutatingTodoId,
  };
};

export default useTodos;

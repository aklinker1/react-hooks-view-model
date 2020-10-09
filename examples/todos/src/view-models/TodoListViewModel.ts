import { useMemo, useState } from "react";
import { defineViewModel, useViewModel } from "react-hooks-view-model";
import * as uuid from "uuid";

defineViewModel("TodoList", {
  initialState: {
    todos: [],
  },
  created() {
    // blank
  },
});

export function useTodoListViewModel() {
  const { todos, setState } = useViewModel("TodoList");
  const completedCount = useMemo<number>(
    () =>
      todos.reduce(
        (count: number, todo: TodoDto) => count + (todo.complete ? 1 : 0),
        0
      ),
    [todos]
  );

  const findTodo = (id?: string): number => {
    const index = todos.findIndex((todo: TodoDto) => todo.id === id);
    if (index < 0) {
      throw Error(`Todo with id=${id} does not exist`);
    }
    return index;
  };
  const createTodo = (name: string) => {
    const newTodos = [
      ...todos,
      {
        id: uuid.v4(),
        name: name,
        complete: false,
      },
    ];
    setState({ todos: newTodos });
  };
  const toggleTodo = (id?: string) => {
    const index = findTodo(id);
    const todo: TodoDto = todos[index];
    const newTodos = [...todos];
    newTodos.splice(index, 1, {
      ...todo,
      complete: !todo.complete,
    });
    setState({
      todos: newTodos,
    });
  };
  const deleteTodo = (id?: string) => {
    const newTodos = [...todos];
    newTodos.splice(findTodo(id), 1);
    setState({
      todos: newTodos,
    });
  };

  return {
    todos,
    completedCount,

    createTodo,
    toggleTodo,
    deleteTodo,
  };
}

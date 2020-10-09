import React, { ReactElement } from "react";
import TodoList from "../components/TodoList";
import { useTodoListViewModel } from "../view-models/TodoListViewModel";
import "./TodoListDetails.scss";
import faker from "faker";

export default (): ReactElement => {
  const { todos, completedCount, createTodo } = useTodoListViewModel();
  const onClickCreateNew = () => {
    createTodo(faker.finance.currencyName());
  };

  return (
    <div className="TodoListDetails">
      <h1>Todo List</h1>
      <h4>
        {todos.length} todos&emsp;|&emsp;{completedCount} completed
      </h4>
      <button className="create-todo" onClick={onClickCreateNew}>
        Create TODO
      </button>
      <div className="columns">
        <TodoList />
        <TodoList />
      </div>
    </div>
  );
};

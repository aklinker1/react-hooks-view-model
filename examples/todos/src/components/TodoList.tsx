import React, { ReactElement } from "react";
import { useTodoListViewModel } from "../view-models/TodoListViewModel";
import TodoListItem from "../components/TodoListItem";
import "./TodoList.css";

export default (): ReactElement => {
  const { todos, deleteTodo, toggleTodo } = useTodoListViewModel();

  return (
    <div className="TodoList">
      {todos.map((todo: TodoDto) => (
        <TodoListItem
          key={todo.id}
          id={todo.id}
          complete={todo.complete}
          name={todo.name}
          onClickDelete={deleteTodo}
          onToggleCompleted={toggleTodo}
        />
      ))}
    </div>
  );
};

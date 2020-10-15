# react-hooks-view-model

This library is meant to give a similar feel of Android native development to React development, and follow similar practices.

In summary, this library uses singleton "View Models" to store state for a set of data.

```ts
import { defineViewModel, useViewModel } from 'react-hooks-view-model';

defineViewModel("TodoList", {
  state: {
    todos: [],
  },
  created() {
    console.log("TodoList created (only called once)");
  }
});

/**
 * All business logic (what is disabled, data mapping, ui values) should be in this function
 */
export function useTodoListViewModel() {
  const { todos, setState } = useViewModel("TodoList");
  const todoCount = useMemo(() => todos.length, [todos]);
  
  return {
    addTodo(name: string) {
      const newTodos = [...todos];
      newTodos.push({ completed: false, name });
      setState({ todos: newTodos });
    },
    todos,
    todoCount: todoCount.current,
  }
}
```

A view model like that can be re-used by multiple components at the same time.

```ts
/**
 * Then you use only what you need for the UI
 */
export function TodoList() {
  const { todos } = useTodoListViewModel();
  return (
    <>
      {todos.map(todo => (
        <span>
         <input type="checkbox" checked={todo.completed} />
         {todo.name}
        </span>
      ))}
    </>
  );
}

export function ParentComponent() {
  const { todoCount, addTodo } = useTodoListViewModel();
  return (
    <div>
      <h1>{todoCount} TODOs</h1>
      <button onClick={addTodo}>Add Todo</button>
      <TodoList />
      <TodoList />
    </div>
  );
}
```

> View models can also have arguments! When there are no arguments, a view model will be a singleton, but with arguments a view model singleton is created for each set of arguments, 
>
> This means something like `useTodoViewModel(123)` and `useTodoViewModel(321)` would not share state like the example above (`useTodoListViewModel()`).

## Exmaple

You can run the example in `examples/todo` to see it work

import has from "lodash.has";
import set from "lodash.set";
import get from "lodash.get";
import { createGlobalState } from "react-hooks-global-state";

export interface Created<S> {
  (setState: SetState<S>): void;
}
export interface SetState<S> {
  (newState: Partial<S>): void;
}
export interface ViewModelDefinition<S> {
  created?: Created<S>;
  initialState: S;
}
export interface StoredViewModel<S> {
  state: Readonly<S>;
  setState: SetState<S>;
}

export type ExposedViewModel<
  T extends string | symbol
> = ViewModels.State[T] & {
  setState: SetState<ViewModels.State[T]>;
};

export declare namespace ViewModels {
  type Args = { [name in string | symbol]: any[] };
  type State = { [name in string | symbol]: any };
}

const definitions: {
  [name in string | symbol]:
    | ViewModelDefinition<any>
    | ((...args: any[]) => ViewModelDefinition<any>)
    | undefined;
} = {};
const singletons: any = {};

export function defineViewModel<T extends string | symbol, S>(
  viewModelName: T,
  initialState: ((...args: ViewModels.Args[T]) => S) | object
): void {
  set(definitions, viewModelName, initialState);
  // console.log(
  //   `Defined ${viewModelName}`,
  //   JSON.parse(JSON.stringify({ definitions }))
  // );
}

export function useViewModel<T extends string | symbol, S = ViewModels.State[T]>(
  viewModelName: T,
  ...args: ViewModels.Args[T]
): ExposedViewModel<T> {
  const key = [viewModelName, ...args];
  // console.log(
  //   `Using ${viewModelName}`,
  //   JSON.parse(JSON.stringify({ args, singletons }))
  // );

  let storedViewModel;
  if (has(singletons, key)) {
    storedViewModel = get(singletons, key);
  } else {
    storedViewModel = createViewModel(viewModelName, key);
    set(singletons, key, {
      initialState: storedViewModel.initialState,
      useViewModelState: storedViewModel.useViewModelState,
    });
  }
  const { initialState, useViewModelState, created } = storedViewModel;

  // Do it
  // console.log(`Connecting ${viewModelName} listeners to global state`, JSON.parse(JSON.stringify({ initialState, useViewModelState, created })))
  const setters: any = {};
  // @ts-ignore - filled later
  const state: S = {};
  Object.keys(initialState).forEach((field) => {
    const [value, setValue] = useViewModelState(field as keyof S);
    // console.log(
    //   `Preparing field=${field}`,
    //   JSON.parse(
    //     JSON.stringify({
    //       value,
    //       setValue,
    //       // @ts-ignore
    //       initialValue: initialState[field],
    //     })
    //   )
    // );
    setters[field as keyof S] = setValue;
    state[field as keyof S] = value;
  });
  // console.log(`Finished setting up ${viewModelName} listeners`, JSON.parse(JSON.stringify({ state, setters })));

  const setState: SetState<S> = (partialState: any) => {
    Object.keys(partialState).forEach((field) => {
      setters[field](partialState[field]);
      // console.log(
      //   `Set ${field} = `,
      //   partialState[field],
      //   JSON.parse(
      //     JSON.stringify({
      //       setters,
      //       state,
      //       partialState,
      //     })
      //   )
      // );
    });
  };

  if (created) {
    // console.log(`Running created() from ${viewModelName}`, JSON.parse(JSON.stringify({ args })))
    created(setState);
  }
  return {
    ...state,
    setState,
  };
}

function createViewModel<T extends string | symbol, S = ViewModels.State[T]>(
  name: T,
  key: any[]
) {
  // console.log(
  //   `Creating new view model instance: ${name}`,
  //   JSON.parse(
  //     JSON.stringify({
  //       key,
  //       singletons,
  //       definitions,
  //     })
  //   )
  // );
  const definitionBuilder = definitions[name];
  // console.log(
  //   `Using builder`,
  //   JSON.parse(JSON.stringify({ definitionBuilder }))
  // );
  if (definitionBuilder == null) {
    throw Error(`Attempted to instantiate a not-defined view model: ${name}`);
  }

  let definition: ViewModelDefinition<S>;
  if (typeof definitionBuilder === "function") {
    definition = definitionBuilder(...key);
  } else {
    definition = definitionBuilder as any;
  }
  // console.log(
  //   `Build view model definition`,
  //   JSON.parse(JSON.stringify({ definition }))
  // );

  const { created, initialState } = definition;
  // console.log(
  //   "Destrcutured definition",
  //   JSON.parse(JSON.stringify({ created, initialState }))
  // );
  const { useGlobalState: useViewModelState } = createGlobalState(initialState);

  return { useViewModelState, initialState, created };
}

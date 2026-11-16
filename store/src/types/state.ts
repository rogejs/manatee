type InitState<S> = S extends (...args: never[]) => unknown
  ? never
  : S extends undefined
    ? never
    : S;

type BoxCreate<S, A> = {
  box_id: string;
  get_state: () => InitState<S>;
  dispatch: A;
  subscribe: (cb: (state: InitState<S>) => void) => () => boolean;
};

export type { InitState, BoxCreate };

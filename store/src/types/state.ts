import type { StorageConfig } from "./persists.ts";

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

type BoxBuilder<S, A> = {
  persist: (name: string, storage?: StorageConfig) => void;
  create: () => BoxCreate<S, A>;
};

export type { InitState, BoxCreate, BoxBuilder };

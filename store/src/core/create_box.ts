import { check_env } from "../libs/check_env.js";
import { init_state_err, storage_name_err } from "../libs/check_err.js";
import { get_storage, storage_mutate, storage_query } from "../libs/storage.js";
import type { PersistsConfig, StorageConfig } from "../types/persists.ts";
import type { BoxBuilder, InitState } from "../types/state.ts";

export const create_box = <S, A>(
  init_state: InitState<S>,
  actions: (
    set: (next: InitState<S> | ((prev: InitState<S>) => InitState<S>)) => void,
  ) => A,
): BoxBuilder<S, A> => {
  const { is_production, is_test } = check_env();
  let persist_cfg: PersistsConfig = {
    name: null,
    storage: "local",
  };

  const builder = {
    persist: (name: string, storage: StorageConfig = "local") => {
      if (is_production || is_test) {
        storage_name_err(name);
      }

      persist_cfg = { name, storage };
    },
    create: () => {
      let state = init_state;
      const listeners = new Set<(state: InitState<S>) => void>();

      if (is_production || is_test) {
        init_state_err(state);
      }

      const storage_key = persist_cfg.name;
      const storage = get_storage(persist_cfg.storage);

      if (storage_key && storage !== null) {
        const saved_state = storage_query<S>({
          key: storage_key,
          storage,
        });

        if (saved_state !== undefined) {
          state = saved_state;
        }
      }

      const set = (
        next: InitState<S> | ((prev: InitState<S>) => InitState<S>),
      ) => {
        const next_state =
          typeof next === "function"
            ? (next as (prev: InitState<S>) => InitState<S>)(state)
            : next;

        if (!Object.is(next_state, state)) {
          state = next_state;

          if (typeof window !== "undefined") {
            if (storage_key && storage) {
              storage_mutate({ key: storage_key, storage, value: next_state });
            }
          }

          listeners.forEach((listener) => listener(state));
        }
      };

      const dispatch = actions(set);
      const box_id = `box-${Math.random().toString(36).substring(2, 9)}`;
      const subscribe = (cb: (state: InitState<S>) => void) => {
        listeners.add(cb);
        return () => listeners.delete(cb);
      };

      return {
        box_id,
        get_state: () => state,
        dispatch,
        subscribe,
      };
    },
  };

  return builder;
};

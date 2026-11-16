import type { StorageConfig } from "../types/persists.js";
import type { InitState } from "../types/state.ts";

const get_storage = (storage: StorageConfig) => {
  if (typeof window === "undefined") return null;
  return storage === "local" ? window.localStorage : window.sessionStorage;
};

const storage_query = <S>({
  key,
  storage,
}: {
  storage: Storage;
  key: string;
}): InitState<S> | undefined => {
  const storage_value = storage.getItem(key);

  if (storage_value === null) return undefined;
  return JSON.parse(storage_value);
};

const storage_mutate = <S>({
  key,
  storage,
  value,
}: {
  key: string;
  storage: Storage;
  value: InitState<S>;
}) => {
  const to_str_value = JSON.stringify(value);
  storage.setItem(key, to_str_value);
};

export { get_storage, storage_query, storage_mutate };

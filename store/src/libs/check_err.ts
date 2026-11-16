const init_state_err = <S>(init_state: S) => {
  if (init_state === undefined) {
    throw new Error("'init_state' cannot be undefined.");
  }

  if (typeof init_state === "function") {
    throw new Error("'init_state' cannot be a function.");
  }
};

const storage_name_err = (name: string) => {
  if (!name) throw new Error("'name' cannot be empty string.");
};

export { init_state_err, storage_name_err };

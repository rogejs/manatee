export const check_env = () => {
  const prcss =
    typeof process !== "undefined" && process.env
      ? process.env.NODE_ENV
      : undefined;
  const vite =
    typeof import.meta !== "undefined" && (import.meta as any).env
      ? ((import.meta as any).env.NODE_ENV ?? (import.meta as any).env.MODE)
      : undefined;

  const is_production =
    (prcss && prcss === "production") || (vite && vite === "production")
      ? true
      : false;

  const is_test =
    (prcss && prcss === "test") || (vite && vite === "test") ? true : false;

  return { is_production, is_test };
};

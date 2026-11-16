export const shallow_compare = (prev_obj: any, new_obj: any) => {
  if (Object.is(prev_obj, new_obj)) return true;

  if (
    typeof prev_obj !== "object" ||
    prev_obj === null ||
    typeof new_obj !== "object" ||
    new_obj === null
  )
    return false;

  const prev_keys = Object.keys(prev_obj);
  const newKeys = Object.keys(new_obj);

  if (prev_keys.length !== newKeys.length) return false;

  for (let i = 0; i <= prev_keys.length; i++) {
    const prv_key = prev_keys[i];
    if (prv_key) {
      if (
        !Object.prototype.hasOwnProperty.call(new_obj, prv_key) ||
        Object.is(prev_obj[prv_key], new_obj[prv_key])
      ) {
        return false;
      }
    }
  }

  return true;
};

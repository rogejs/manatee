import { check_env } from "../libs/check_env.js";
import type { BoxCreate } from "../types/state.ts";

export const create_store = <S, A>(boxes: Record<string, BoxCreate<S, A>>) => {
  const { is_production, is_test } = check_env();

  if (is_production || is_test) {
    const keys = Object.keys(boxes);
    const box_list = new Map<string, string>();

    if (keys.length === 0) {
      throw new Error("'store' cannot be empty object.");
    }

    for (const [key, box] of Object.entries(boxes)) {
      if (box_list.get(box.box_id)) {
        throw new Error(
          `Conflict. The box you are trying to assign to "${key}" is already used by "${box.box_id}."`,
        );
      }

      box_list.set(box.box_id, key);
    }
  }

  const boxes_without_id = Object.values(boxes).map((item) => {
    const { box_id: _b, ...rest } = item;
    return rest;
  });

  return boxes_without_id;
};

import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";
import type { BoxCreate } from "../types/state.ts";
import { shallow_compare } from "../libs/shallow_compare.js";

export const useAppStore = <S, A, R>(
  box: Omit<BoxCreate<S, A>, "box_id">,
  selector: (state: S) => R = (s) => s as unknown as R,
) => {
  const lastSnapshot = useRef<R | undefined>(undefined);

  const getSnapshot = useCallback(() => {
    const newSnapshot = selector(box.get_state());

    if (
      lastSnapshot.current === undefined ||
      !shallow_compare(lastSnapshot, newSnapshot)
    ) {
      lastSnapshot.current = newSnapshot;
      return newSnapshot;
    }

    return lastSnapshot.current;
  }, [selector, box]);

  const state = useSyncExternalStore(box.subscribe, getSnapshot, getSnapshot);
  const dispatch = useMemo(() => box.dispatch, [box.dispatch]);

  return [state, dispatch] as const;
};

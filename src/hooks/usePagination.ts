import { useState } from "react";

export function usePagination<T, C>(
  data: { items: T[]; nextCursor: C | undefined } | undefined,
  onCursorUpdate: (cursor: C | undefined) => void
) {
  const [cursors, setCursors] = useState<C[]>([]);
  const [pagesCount, setPagesCount] = useState<number[]>([]);

  const cursor = cursors.length > 0 ? cursors[cursors.length - 1] : undefined;

  const nextCursor = data?.nextCursor;
  const nextPage = nextCursor
    ? () => {
        setCursors([...cursors, nextCursor]);
        setPagesCount([...pagesCount, data.items.length]);
        onCursorUpdate(nextCursor);
      }
    : undefined;

  const previousPage = cursor
    ? () => {
        setCursors(cursors.slice(0, -1));
        setPagesCount(pagesCount.slice(0, -1));
        onCursorUpdate(
          cursors.length > 1 ? cursors[cursors.length - 2] : undefined
        );
      }
    : undefined;

  return {
    nextPage,
    previousPage,
    viewedCount: pagesCount.reduce((prev, curr) => prev + curr, 0),
  };
}

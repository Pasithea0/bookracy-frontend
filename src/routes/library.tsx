import { searchBooksByMd5QueryOptions } from "@/api/backend/search/books";
import { useQuery } from "@tanstack/react-query";
import { getBooksByMd5sQueryOptions } from "@/api/backend/search/search";
import { BookList } from "@/components/books/book-list";
import { BookGallery } from "@/components/books/book-gallery";
import { NavLink } from "@/components/ui/nav-link";
import { useBookmarksStore } from "@/stores/bookmarks";
import { useReadingProgressStore } from "@/stores/progress";
import { createFileRoute } from "@tanstack/react-router";
import { ResultViewSelect, ResultViewOptions } from "@/components/books/filters";
import { useState } from "react";

export const Route = createFileRoute("/library")({
  component: Library,
  async beforeLoad(ctx) {
    const bookmarks = useBookmarksStore.getState().bookmarks;
    await ctx.context.queryClient.ensureQueryData(searchBooksByMd5QueryOptions(bookmarks));
    const readingProgress = useReadingProgressStore
      .getState()
      .readingProgress.filter((p) => p.totalPages > 0)
      .filter((p) => p.currentPage < p.totalPages);
    await ctx.context.queryClient.ensureQueryData(getBooksByMd5sQueryOptions(readingProgress.map((p) => p.md5)));
  },
});

export function Library() {
  const [readingProgressView, setReadingProgressView] = useState<ResultViewOptions>("list");
  const [bookmarksView, setBookmarksView] = useState<ResultViewOptions>("list");

  const bookmarks = useBookmarksStore((state) => state.bookmarks);
  const readingProgress = useReadingProgressStore((state) => state.readingProgress)
    .filter((p) => p.totalPages > 0)
    .filter((p) => p.currentPage < p.totalPages);

  const { data } = useQuery(getBooksByMd5sQueryOptions(readingProgress.map((p) => p.md5)));
  const { data: bookmarksData } = useQuery(searchBooksByMd5QueryOptions(bookmarks));

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex w-full flex-col gap-4">
        {data?.length && data?.length > 0 ? (
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Reading Progress</h1>
            <ResultViewSelect view={readingProgressView} setView={setReadingProgressView} />
          </div>
        ) : null}
        {readingProgress.length === 0 && (
          <div>
            <h1 className="text-2xl font-bold">No Reading Progress</h1>
            <p className="flex gap-1 text-sm text-muted-foreground">Start reading some books and your progress will show up here.</p>
          </div>
        )}
        {data?.length && data?.length > 0 ? readingProgressView === "list" ? <BookList books={data} /> : <BookGallery books={data} /> : null}
      </div>

      <div className="flex w-full flex-col gap-4">
        {bookmarks.length > 0 ? (
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold">Bookmarks</h1>
            <ResultViewSelect view={bookmarksView} setView={setBookmarksView} />
          </div>
        ) : null}

        {bookmarks.length === 0 && (
          <div>
            <h1 className="text-2xl font-bold">No Bookmarks</h1>
            <p className="flex gap-1 text-sm text-muted-foreground">
              Start adding some books using the bookmark button. Start searching
              <NavLink to={"/?q="}>here</NavLink>
            </p>
          </div>
        )}

        {bookmarksData?.results && bookmarksData.results.length > 0 ? bookmarksView === "list" ? <BookList books={bookmarksData.results} /> : <BookGallery books={bookmarksData.results} /> : null}
      </div>
    </div>
  );
}

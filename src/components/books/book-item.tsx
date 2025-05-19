import { useState, useMemo } from "react";
import { BookItem, BookItemWithExternalDownloads } from "@/api/backend/types";
import { Card, CardContent } from "../ui/card";
import PlaceholderImage from "@/assets/placeholder.png";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import { EpubReader } from "../epub-reader/epub-reader";
import { BookmarkButton } from "./bookmark";
import { BookDownloadButton } from "./download-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Progress } from "../ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { useReadingProgressStore } from "@/stores/progress";

type BookItemProps = BookItemWithExternalDownloads | BookItem;

export function BookItemCard(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const findReadingProgress = useReadingProgressStore((state) => state.findReadingProgress);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));

  const progress = useMemo(() => {
    const progress = findReadingProgress(props.md5);
    if (progress && progress.totalPages > 0) {
      return (progress.currentPage / progress.totalPages) * 100;
    }
  }, [props.md5, findReadingProgress]);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.22)]">
      <CardContent className="relative flex h-full w-full items-center p-4">
        <div className="absolute right-2 top-2 z-10">
          <BookmarkButton book={props} />
        </div>

        <div className="flex w-full flex-col gap-6 pt-12 sm:pt-0 md:flex-row md:gap-8">
          <div className="mx-auto flex w-full max-w-[220px] flex-col items-center justify-center md:w-1/4">
            <AspectRatio ratio={5 / 8} className="flex items-center transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_2px_20px_rgb(0,0,0,0.22)]">
              <div className="relative h-full w-full">
                <img
                  src={props.book_image ?? PlaceholderImage}
                  alt={props.title}
                  className="h-full w-full rounded-lg object-cover transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = PlaceholderImage;
                  }}
                  onClick={() => setIsReaderOpen(true)}
                />
                {progress != null && (
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <div className="relative">
                      <div className="absolute inset-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent" />
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Progress value={progress} className="h-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs text-muted-foreground">Progress: {progress!.toFixed(2)}%</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                )}
              </div>
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <h2 className="line-clamp-1 max-w-[90%] text-2xl font-bold">{props.title.length > 50 ? `${props.title.slice(0, 50)}...` : props.title}</h2>
                <p className="text-md line-clamp-1 text-muted-foreground">{props.author.length > 50 ? `${props.author.slice(0, 50)}...` : props.author}</p>
              </div>
              <p className="line-clamp-3 break-all text-sm text-muted-foreground">{props.description}</p>
              <p className="text-sm text-muted-foreground">File size: {props.book_size}</p>
              <p className="text-sm text-muted-foreground">File type: {props.book_filetype}</p>
              <p className="text-sm text-muted-foreground">MD5: {props.md5}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              {"externalDownloads" in props && <BookDownloadButton title={props.title} extension={props.book_filetype} externalDownloads={props.externalDownloads} primaryLink={props.link} />}
              {isEpub && <EpubReader title={props.title} md5={props.md5} link={props.link} open={isReaderOpen} setIsOpen={setIsReaderOpen} />}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonBookItem() {
  return (
    <Card className="shadow-md">
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
          <div className="mx-auto flex w-full max-w-[220px] flex-col items-center justify-center md:w-1/4">
            <AspectRatio ratio={5 / 8} className="w-full">
              <Skeleton className="h-full w-full rounded-lg" />
            </AspectRatio>
          </div>
          <div className="flex flex-1 flex-col justify-between">
            <div>
              <Skeleton className="mb-2 h-8 w-3/4 rounded" />
              <Skeleton className="h-5 w-1/2 rounded" />
              <Skeleton className="mt-2 h-4 w-full rounded" />
              <Skeleton className="mt-2 h-4 w-1/3 rounded" />
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <Skeleton className="h-10 w-32 rounded" />
              <Skeleton className="h-10 w-32 rounded" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SkeletonBookItemGrid() {
  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <CardContent className="h-full">
        <div className="relative flex h-full flex-col gap-3 pt-6">
          <Skeleton className="aspect-[10/16] w-full rounded-lg" />
          <div className="absolute right-1 top-7">
            <Skeleton className="rounded-half h-10 w-10" />
          </div>
          <div className="flex flex-col gap-1.5 px-1">
            <Skeleton className="h-6 w-3/4 rounded" />
            <Skeleton className="h-4 w-1/2 rounded" />
            <Skeleton className="h-3 w-1/4 rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function BookItemDialog(props: BookItemProps) {
  const [isReaderOpen, setIsReaderOpen] = useState(false);
  const findReadingProgress = useReadingProgressStore((state) => state.findReadingProgress);

  const isEpub = Boolean(props.link?.toLowerCase().endsWith(".epub"));

  const progress = useMemo(() => {
    const progress = findReadingProgress(props.md5);
    if (progress && progress.totalPages > 0) {
      return (progress.currentPage / progress.totalPages) * 100;
    }
  }, [props.md5, findReadingProgress]);

  return (
    <Dialog>
      <div className="flex flex-col">
        <Card className="group h-full overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgb(0,0,0,0.22)]">
          <CardContent className="h-full p-4">
            <div className="relative flex h-full flex-col gap-3">
              <DialogTrigger asChild>
                <div className="relative">
                  <AspectRatio ratio={10 / 16} className="overflow-hidden rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_2px_20px_rgb(0,0,0,0.22)]">
                    <img
                      src={props.book_image ?? PlaceholderImage}
                      alt={props.title}
                      className="h-full w-full object-cover transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = PlaceholderImage;
                      }}
                    />
                  </AspectRatio>
                  {progress != null && (
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent" />
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Progress value={progress} className="h-2" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs text-muted-foreground">Progress: {progress!.toFixed(2)}%</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  )}
                </div>
              </DialogTrigger>
              <div className="absolute right-2 top-2 z-10">
                <BookmarkButton book={props} />
              </div>
              <div className="flex flex-col gap-1.5 px-1">
                <h2 className="line-clamp-1 text-lg font-semibold">{props.title.length > 50 ? `${props.title.slice(0, 50)}...` : props.title}</h2>
                <p className="line-clamp-1 text-sm text-muted-foreground">{props.author.length > 50 ? `${props.author.slice(0, 50)}...` : props.author}</p>
                <p className="text-xs text-muted-foreground">{props.book_filetype}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{props.title.length > 100 ? `${props.title.slice(0, 100)}...` : props.title}</DialogTitle>
          <DialogDescription>By {props.author.length > 100 ? `${props.author.slice(0, 100)}...` : props.author}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="flex flex-col gap-4">
            <p>File size: {props.book_size}</p>
            <p>File type: {props.book_filetype}</p>
            <p>MD5: {props.md5}</p>
            <p className="break-all">{props.description}</p>
          </div>
        </ScrollArea>
        <DialogFooter className="flex flex-row justify-between md:justify-end">
          {"externalDownloads" in props && <BookDownloadButton title={props.title} extension={props.book_filetype} externalDownloads={props.externalDownloads} primaryLink={props.link} />}

          {isEpub && <EpubReader title={props.title} md5={props.md5} link={props.link} open={isReaderOpen} setIsOpen={setIsReaderOpen} />}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { useDownloadMutation } from "@/api/backend/downloads/external";
import { Button } from "../ui/button";
import { ChevronDown, Loader2 } from "lucide-react";
import { saveAs } from "@/lib/saveAs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ExternalDownloadResponse } from "@/api/backend/downloads/types";
import { toast } from "sonner";
import { titleToSlug } from "@/lib/string";

interface BookDownloadButtonProps {
  title: string;
  extension: string;
  primaryLink?: string;
  externalDownloads?: ExternalDownloadResponse[number]["external_downloads"];
}

export function BookDownloadButton(props: BookDownloadButtonProps) {
  const { mutate, isPending: isDownloading } = useDownloadMutation();
  if (props.externalDownloads?.length === 0 || !props.primaryLink) return null;

  const handleDownload = (link?: string) => {
    if (!link) return;
    mutate(link, {
      onSuccess: (url) => saveAs(url, `${titleToSlug(props.title)}.${props.extension}`, link.includes("ipfs")),

      onError: () => toast.error("Failed to download file"),
    });
  };

  return (
    <div className="flex items-center">
      <Button
        className={cn({
          "rounded-r-none border-r-0": props.externalDownloads?.length ?? 0 > 0,
        })}
        onClick={() => handleDownload(props.primaryLink)}
      >
        {isDownloading && <Loader2 className="animate-spin" />}
        {!isDownloading ? "Download" : ""}
      </Button>
      {(props.externalDownloads?.length ?? 0 > 0) && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-none border-l-0 px-2">
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {props.externalDownloads?.map((download) => (
              <DropdownMenuItem key={download.link} onClick={() => handleDownload(download.link)} className="w-full text-left">
                {download.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

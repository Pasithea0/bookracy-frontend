import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { SingleBookForm } from "@/components/upload/SingleBookForm";
import { BulkUploadForm } from "@/components/upload/BulkUploadForm";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/", search: { q: "" } });
  },
});

function Upload() {
  const [bulk, setBulk] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);

  // Listen for the bulkFilesAdded event
  useEffect(() => {
    const handleBulkFilesAdded = (e: Event) => {
      const customEvent = e as CustomEvent<{ files: File[] }>;
      if (customEvent.detail && customEvent.detail.files) {
        setBulkFiles(customEvent.detail.files);
      }
    };

    window.addEventListener("bulkFilesAdded", handleBulkFilesAdded);

    return () => {
      window.removeEventListener("bulkFilesAdded", handleBulkFilesAdded);
    };
  }, []);

  return (
    <div className="flex w-full items-start justify-center">
      <div className="container mx-auto px-0">
        <Card className="w-full border border-border bg-card shadow-md dark:bg-card">
          <CardHeader className="pb-4">
            <CardTitle>Upload a Book</CardTitle>
            <CardDescription>Share your books with the world. Fill in the details and upload your file. Allowed types: epub, pdf, txt, mobi, etc. Max size: 100MB.</CardDescription>
            <div className="mt-4 flex items-center gap-4">
              <Label className="flex cursor-pointer select-none items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  checked={bulk}
                  onChange={() => {
                    setBulk(!bulk);
                    setBulkFiles([]);
                  }}
                  className="accent-blue-500"
                />
                Bulk Upload Mode
              </Label>
            </div>
          </CardHeader>

          <div className="px-6 pb-6">
            {bulk ? (
              <BulkUploadForm files={bulkFiles} onClearFiles={() => setBulkFiles([])} onAddFiles={(files) => setBulkFiles(files)} />
            ) : (
              <SingleBookForm
                onSubmit={async (formData) => {
                  return new Promise((resolve) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://backend.bookracy.ru/upload");
                    xhr.onload = () => {
                      try {
                        const res = JSON.parse(xhr.responseText);
                        if (xhr.status === 200 && res.success) {
                          resolve({ success: true, md5: res.md5 });
                        } else {
                          resolve({ error: res.error || "Upload failed." });
                        }
                      } catch {
                        resolve({ error: "Unexpected server response." });
                      }
                    };
                    xhr.onerror = () => {
                      resolve({ error: "Network error." });
                    };
                    xhr.send(formData);
                  });
                }}
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

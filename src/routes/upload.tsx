import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconButton } from "@/components/ui/icon-button";
import { ArrowUpFromLine } from "lucide-react";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/", search: { q: "" } });
  },
});

function Upload() {
  const [step, setStep] = useState(1);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBookFile(event.target.files[0]);
    }
  };

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverFile(event.target.files[0]);
    }
  };

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  return (
    <div className="flex w-full items-center justify-center">
      <Card className="w-[90%] p-6 text-left">
        <CardHeader>
          <CardTitle className="mb-4 text-2xl">Upload a Book</CardTitle>
          <CardDescription>
            {step === 1 && (
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col gap-4">
                  <div>
                    <Label>
                      Book Title <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="A Scanner Darkly" required className="w-full" />
                  </div>
                  <div>
                    <Label>
                      Author <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="Philip K Dick" required className="w-full" />
                  </div>
                  <div>
                    <Label>
                      Publisher <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="Doubleday & Company" required className="w-full" />
                  </div>
                  <div>
                    <Label>
                      Year Published <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="1977" required className="w-full" />
                  </div>
                  <div>
                    <Label>
                      File Format <span className="text-red-500">*</span>
                    </Label>
                    <Input placeholder="epub" accept="epub, mobi, pdf" required className="w-full" />
                  </div>
                </div>

                <div className="flex flex-col justify-center gap-6">
                  <div className="mt-4 flex flex-col gap-6">
                    <div className="flex flex-col items-center">
                      <Label className="pb-2 pl-1">Book Upload</Label>
                      <Input
                        onChange={handleBookFileChange}
                        className="h-11 w-72 items-center"
                        type="file"
                        accept=".epub,.mobi,.pdf"
                        iconRight={
                          <IconButton>
                            <ArrowUpFromLine />
                          </IconButton>
                        }
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <Label className="pb-2 pl-1">Cover Upload</Label>
                      <Input onChange={handleCoverFileChange} className="h-11 w-72 items-center" type="file" accept=".png,.jpg" iconRight={<ArrowUpFromLine />} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleNext} className="col-span-2 mt-6">
                  Next (Optional Fields)
                </Button>
              </div>
            )}
            {step === 2 && (
              <div className="flex flex-col gap-4">
                <p className="text-l">These fields are optional but highly enouraged!</p>
                <div>
                  <Label>Series</Label>
                  <Input placeholder="science fiction, dystopian, thriller" className="w-full" />
                </div>
                <div>
                  <Label>ISBN</Label>
                  <Input placeholder="9788834718674" className="w-full" />
                </div>
                <div>
                  <Label>CID</Label>
                  <Input placeholder="A IPFS node upload of the book" className="w-full" />
                </div>
                <div>
                  <Label>Other Titles</Label>
                  <Input placeholder="Scanner Darkly" className="w-full" />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Description" className="w-full" />
                </div>
                <div className="mt-6 flex justify-between">
                  <Button onClick={handleBack}>Back</Button>
                  <Button>Finish</Button>
                </div>
              </div>
            )}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

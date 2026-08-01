"use client";

import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Button } from "@/components/ui";

export function ArticleFeedback({ articleTitle }: { articleTitle: string }) {
  const [answer, setAnswer] = useState<"yes" | "no" | null>(null);
  const { toast } = useToast();

  const respond = (nextAnswer: "yes" | "no") => {
    setAnswer(nextAnswer);
    toast({
      title: "Thanks for the feedback",
      description: nextAnswer === "yes" ? "We’ll keep this guide current." : "Your response will help us improve this guide.",
      variant: "success",
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/45 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-semibold">Was this guide helpful?</p>
        <p className="mt-1 text-xs text-muted-foreground">Feedback for “{articleTitle}” is recorded as a local demo.</p>
      </div>
      <div className="flex gap-2">
        <Button type="button" variant={answer === "yes" ? "soft" : "outline"} leadingIcon={ThumbsUp} onClick={() => respond("yes")}>Yes</Button>
        <Button type="button" variant={answer === "no" ? "soft" : "outline"} leadingIcon={ThumbsDown} onClick={() => respond("no")}>Not yet</Button>
      </div>
    </div>
  );
}

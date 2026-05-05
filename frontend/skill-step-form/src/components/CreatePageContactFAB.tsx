import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { feedbackAPI } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const SUPPORT_EMAIL = "contact@123resume.de";

/**
 * Always-visible contact / feedback entry on the resume builder (/create).
 * Sends via the same backend as the preview feedback form.
 */
export function CreatePageContactFAB() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setEmail(user.email);
    } else {
      setEmail("");
    }
    if (user) {
      const parts = [user.first_name, user.last_name].map((s) => s?.trim()).filter(Boolean);
      if (parts.length) {
        setName(parts.join(" "));
      }
    } else {
      setName("");
    }
  }, [user]);

  const handleSend = async () => {
    const resolved = (user?.email || email).trim();
    if (!resolved || !message.trim()) {
      toast({
        title: t("common.error") || "Error",
        description:
          t("resume.feedback.validation") ||
          "Please provide your email and a short message.",
        variant: "destructive",
      });
      return;
    }

    try {
      setSending(true);
      await feedbackAPI.sendFeedback({
        name: name.trim() || undefined,
        email: resolved,
        message: message.trim(),
        context: "Page: /create (resume builder)",
      });
      setOpen(false);
      setMessage("");
      toast({
        title: t("resume.feedback.thankYouTitle") || "Thank you!",
        description:
          t("resume.feedback.thankYouDesc") ||
          "We have received your message and will review it soon.",
      });
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast({
        title: t("common.error") || "Error",
        description:
          err?.message ||
          t("resume.feedback.error") ||
          "We could not send your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <Button
          type="button"
          size="lg"
          className={cn(
            "group relative h-12 overflow-hidden rounded-full px-4 shadow-lg shadow-primary/25 sm:px-5",
            "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "hover:-translate-y-1.5 hover:scale-[1.06] hover:shadow-2xl hover:shadow-primary/40",
            "hover:ring-4 hover:ring-primary/15",
            "active:translate-y-0 active:scale-[0.98] active:shadow-lg active:shadow-primary/25 active:ring-2 active:ring-primary/20",
            "motion-reduce:transition-colors motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 motion-reduce:hover:shadow-lg motion-reduce:hover:ring-0",
          )}
          onClick={() => setOpen(true)}
          aria-label={
            t("resume.feedback.contactFabAria") ||
            "Contact us or send feedback"
          }
        >
          <span
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden motion-reduce:group-hover:opacity-0"
            aria-hidden
          >
            <span className="absolute inset-y-0 -left-full w-[70%] skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[220%]" />
          </span>
          <MessageCircle
            className="relative h-5 w-5 shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-safe:group-hover:scale-110 motion-safe:group-hover:-rotate-6 sm:mr-2"
            aria-hidden
          />
          <span className="relative hidden font-medium sm:inline">
            {t("resume.feedback.contactFab") || "Contact"}
          </span>
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {t("resume.feedback.title") || "Send feedback"}
            </DialogTitle>
            <DialogDescription className="text-left">
              {t("resume.feedback.description") ||
                "Share ideas, issues, or questions with the 123Resume team."}
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {t("resume.feedback.contactEmailIntro") ||
              "You can also email us directly at"}{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              {SUPPORT_EMAIL}
            </a>
            .
          </p>

          <div className="grid gap-4 py-2">
            <div className="grid gap-2">
              <Label htmlFor="create-contact-name">
                {t("resume.feedback.name") || "Name (optional)"}
              </Label>
              <Input
                id="create-contact-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={
                  t("resume.feedback.namePlaceholder") || "Your name"
                }
                autoComplete="name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-contact-email">
                {t("resume.feedback.email") || "Email"}
              </Label>
              <Input
                id="create-contact-email"
                type="email"
                value={user?.email ?? email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!!user?.email}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-contact-message">
                {t("resume.feedback.message") || "Your message"}
              </Label>
              <Textarea
                id="create-contact-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  t("resume.feedback.messagePlaceholder") ||
                  "What can we help you with?"
                }
                rows={5}
                className="resize-y min-h-[120px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={sending}
            >
              {t("common.cancel") || "Cancel"}
            </Button>
            <Button type="button" onClick={handleSend} disabled={sending}>
              {sending
                ? t("common.sending") || "Sending…"
                : t("resume.feedback.submit") || "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

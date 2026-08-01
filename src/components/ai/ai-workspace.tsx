"use client";

import {
  AlertCircle,
  BarChart3,
  Check,
  CheckCircle2,
  CircleDollarSign,
  Clipboard,
  Copy,
  FileText,
  History,
  LoaderCircle,
  Menu,
  MessageSquarePlus,
  MoreHorizontal,
  PackageSearch,
  PanelRightClose,
  PanelRightOpen,
  Paperclip,
  RefreshCw,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  WifiOff,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import {
  Badge,
  Button,
  CurrencyDisplay,
  Progress,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  Tooltip,
  buttonStyles,
} from "@/components/ui";
import { cn, formatDate } from "@/lib/utils";
import type { AIConversation, Business, Subscription } from "@/types";

type Activity = "idle" | "thinking" | "tool";
type DemoState = "ready" | "offline" | "limit" | "error";

type ChatCard = {
  type: "invoice" | "analytics" | "inventory";
  title: string;
  summary: string;
  fields: Array<{ label: string; value: string | number }>;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  status?: "success" | "confirmation" | "failed";
  card?: ChatCard;
  feedback?: "up" | "down" | null;
};

const starterSuggestions = [
  { label: "Create an invoice", prompt: "Create an invoice for Rahul Sharma for 2 boAt earphones", icon: FileText, tone: "bg-primary-soft text-primary" },
  { label: "Check today’s sales", prompt: "Show me today’s sales and compare them with yesterday", icon: BarChart3, tone: "bg-success-soft text-success" },
  { label: "Find unpaid customers", prompt: "Who has not paid me yet?", icon: CircleDollarSign, tone: "bg-warning-soft text-warning" },
  { label: "Show low-stock items", prompt: "Show all low-stock items and suggest reorder quantities", icon: PackageSearch, tone: "bg-danger-soft text-danger" },
  { label: "Add a new product", prompt: "Help me add a new product", icon: Clipboard, tone: "bg-info-soft text-info" },
  { label: "Monthly report", prompt: "Generate my monthly business report", icon: Sparkles, tone: "bg-secondary-soft text-secondary" },
];

function toChatMessages(conversation: AIConversation): ChatMessage[] {
  return conversation.messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .map((message) => ({
      id: message.id,
      role: message.role as "user" | "assistant",
      content: message.content,
      time: new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(new Date(message.timestamp)),
      status: message.status === "failed" ? "failed" : "success",
      card: message.resultCard ? {
        type: message.resultCard.type === "analytics" ? "analytics" : message.resultCard.type === "inventory" ? "inventory" : "invoice",
        title: message.resultCard.title,
        summary: message.resultCard.summary,
        fields: message.resultCard.fields,
      } : undefined,
      feedback: message.feedback,
    }));
}

export function AIActionCard({ card, confirmation, onConfirm, onEdit, onCancel }: { card: ChatCard; confirmation?: boolean; onConfirm?: () => void; onEdit?: () => void; onCancel?: () => void }) {
  const Icon = card.type === "invoice" ? FileText : card.type === "analytics" ? BarChart3 : PackageSearch;
  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-border bg-card text-foreground shadow-sm">
      <div className="flex items-start gap-3 border-b border-border bg-muted/55 p-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Icon className="size-4.5" /></span>
        <div className="min-w-0"><p className="text-sm font-semibold">{card.title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{card.summary}</p></div>
      </div>
      <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3">
        {card.fields.map((field) => (
          <div key={field.label} className="bg-card p-3.5"><dt className="text-[0.68rem] font-medium uppercase tracking-wide text-muted-foreground">{field.label}</dt><dd className="mt-1.5 text-sm font-semibold tabular-nums">{field.value}</dd></div>
        ))}
      </dl>
      {card.type === "analytics" ? (
        <div className="flex h-24 items-end gap-2 border-t border-border px-4 pb-3 pt-4" aria-label="Seven day sales chart">
          {[42, 56, 48, 72, 64, 86, 76].map((height, index) => <span key={index} className="flex-1 rounded-t-md bg-primary/80" style={{ height: `${height}%` }} />)}
        </div>
      ) : null}
      {confirmation ? (
        <div className="border-t border-border p-4">
          <div className="mb-3 flex gap-2 rounded-lg bg-warning-soft px-3 py-2.5 text-xs leading-5 text-warning"><AlertCircle className="mt-0.5 size-4 shrink-0" />Please confirm before this financial action is completed.</div>
          <div className="flex flex-wrap gap-2"><Button size="sm" onClick={onConfirm}><Check className="size-4" />Confirm invoice</Button><Button size="sm" variant="outline" onClick={onEdit}>Edit details</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancel</Button></div>
        </div>
      ) : null}
    </div>
  );
}

export function AIChatMessage({ message, onFeedback, onConfirm, onEdit, onCancel, onRetry }: { message: ChatMessage; onFeedback: (id: string, feedback: "up" | "down") => void; onConfirm: () => void; onEdit: (id: string, card: ChatCard) => void; onCancel: () => void; onRetry: (id: string) => void }) {
  const { toast } = useToast();
  const isUser = message.role === "user";

  const copyMessage = async () => {
    await navigator.clipboard?.writeText(message.content);
    toast({ title: "Response copied", variant: "success" });
  };

  return (
    <article className={cn("group flex gap-3", isUser && "justify-end")}>
      {!isUser ? <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span> : null}
      <div className={cn("min-w-0 max-w-[min(46rem,88%)]", isUser && "order-first")}>
        <div className={cn("rounded-2xl px-4 py-3 text-sm leading-6", isUser ? "rounded-br-md bg-primary text-primary-foreground" : message.status === "failed" ? "rounded-bl-md border border-danger/25 bg-danger-soft text-foreground" : "rounded-bl-md border border-border bg-card text-foreground")}>
          {message.status === "failed" ? <div className="mb-2 flex items-center gap-2 font-semibold text-danger"><AlertCircle className="size-4" />Request failed</div> : null}
          <p>{message.content}</p>
          {message.card ? <AIActionCard card={message.card} confirmation={message.status === "confirmation"} onConfirm={onConfirm} onEdit={() => onEdit(message.id, message.card!)} onCancel={onCancel} /> : null}
        </div>
        <div className={cn("mt-1.5 flex min-h-8 items-center gap-1 text-[0.68rem] text-muted-foreground", isUser && "justify-end")}>
          <span>{message.time}</span>
          {!isUser ? (
            <>
              <Tooltip content="Copy response"><button type="button" onClick={copyMessage} className="ml-1 grid size-8 place-items-center rounded-lg opacity-70 hover:bg-muted hover:opacity-100" aria-label="Copy response"><Copy className="size-3.5" /></button></Tooltip>
              <Tooltip content="Helpful"><button type="button" onClick={() => onFeedback(message.id, "up")} aria-pressed={message.feedback === "up"} className={cn("grid size-8 place-items-center rounded-lg opacity-70 hover:bg-muted hover:opacity-100", message.feedback === "up" && "bg-success-soft text-success opacity-100")} aria-label="Mark response helpful"><ThumbsUp className="size-3.5" /></button></Tooltip>
              <Tooltip content="Not helpful"><button type="button" onClick={() => onFeedback(message.id, "down")} aria-pressed={message.feedback === "down"} className={cn("grid size-8 place-items-center rounded-lg opacity-70 hover:bg-muted hover:opacity-100", message.feedback === "down" && "bg-danger-soft text-danger opacity-100")} aria-label="Mark response not helpful"><ThumbsDown className="size-3.5" /></button></Tooltip>
              {message.status === "failed" ? <button type="button" onClick={() => onRetry(message.id)} className="ml-1 inline-flex min-h-8 items-center gap-1 rounded-lg px-2 font-semibold text-primary hover:bg-primary-soft"><RefreshCw className="size-3.5" />Retry</button> : null}
            </>
          ) : null}
        </div>
      </div>
      {isUser ? <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"><UserRound className="size-4" /></span> : null}
    </article>
  );
}

function ActivityCard({ activity }: { activity: Exclude<Activity, "idle"> }) {
  return (
    <div className="flex gap-3" role="status" aria-live="polite">
      <span className="mt-1 grid size-8 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="size-4" /></span>
      <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3.5 text-sm">
        {activity === "thinking" ? (
          <div className="flex items-center gap-3 text-muted-foreground"><span className="flex gap-1"><i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-.2s]" /><i className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-.1s]" /><i className="size-1.5 animate-bounce rounded-full bg-primary" /></span>Thinking through your business data…</div>
        ) : (
          <div className="min-w-56"><div className="flex items-center gap-2 font-semibold"><LoaderCircle className="size-4 animate-spin text-primary" />Checking invoices</div><p className="mt-1.5 text-xs text-muted-foreground">Reading connected mock business records</p><Progress className="mt-3" /></div>
        )}
      </div>
    </div>
  );
}

function ConversationList({ conversations, activeId, onSelect, onNew }: { conversations: AIConversation[]; activeId: string | null; onSelect: (conversation: AIConversation) => void; onNew: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-3"><Button block onClick={onNew}><MessageSquarePlus className="size-4" />New conversation</Button></div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        <p className="px-2 pb-2 pt-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Recent</p>
        {conversations.map((conversation) => (
          <button key={conversation.id} type="button" onClick={() => onSelect(conversation)} className={cn("mb-1 flex min-h-14 w-full items-center gap-3 rounded-xl px-3 text-left transition-colors", activeId === conversation.id ? "bg-primary-soft text-primary" : "hover:bg-muted")}>
            <History className="size-4 shrink-0" /><span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{conversation.title}</span><span className="mt-0.5 block text-[0.68rem] text-muted-foreground">{formatDate(conversation.updatedAt, { day: "numeric", month: "short" })}</span></span><MoreHorizontal className="size-4 shrink-0 opacity-60" />
          </button>
        ))}
      </div>
      <div className="border-t border-border p-3 text-xs text-muted-foreground"><p className="flex items-center justify-between"><span>History</span><span>2 conversations</span></p><p className="mt-1">Stored securely in this demo workspace.</p></div>
    </div>
  );
}

export function AIWorkspace({ conversations, business, subscription, monthlySales, outstanding, lowStock }: { conversations: AIConversation[]; business: Business; subscription: Subscription; monthlySales: number; outstanding: number; lowStock: number }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [composer, setComposer] = useState("");
  const [activity, setActivity] = useState<Activity>("idle");
  const [historyOpen, setHistoryOpen] = useState(false);
  const [contextOpen, setContextOpen] = useState(true);
  const [demoState, setDemoState] = useState<DemoState>("ready");
  const [attachmentName, setAttachmentName] = useState<string | null>(null);
  const [businessDataEnabled, setBusinessDataEnabled] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const attachmentInputRef = useRef<HTMLInputElement>(null);
  const sequence = useRef(100);
  const { toast } = useToast();

  useEffect(() => { messageEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [activity, messages]);
  useEffect(() => {
    const setOffline = () => setDemoState("offline");
    const setOnline = () => setDemoState((state) => state === "offline" ? "ready" : state);
    window.addEventListener("offline", setOffline); window.addEventListener("online", setOnline);
    return () => { window.removeEventListener("offline", setOffline); window.removeEventListener("online", setOnline); };
  }, []);

  const selectConversation = (conversation: AIConversation) => {
    setActiveId(conversation.id); setMessages(toChatMessages(conversation)); setHistoryOpen(false); setActivity("idle"); setAttachmentName(null);
  };

  const startNew = () => { setActiveId(null); setMessages([]); setHistoryOpen(false); setActivity("idle"); setAttachmentName(null); setTimeout(() => textareaRef.current?.focus(), 50); };

  const makeResponse = (prompt: string, bypassFailure = false): ChatMessage => {
    const lower = prompt.toLowerCase(); sequence.current += 1;
    if (!bypassFailure && (demoState === "error" || lower.includes("fail"))) return { id: `msg-${sequence.current}`, role: "assistant", content: "I couldn’t complete that request because the business data service did not respond. Your data was not changed.", time: "Now", status: "failed" };
    if (!businessDataEnabled) return { id: `msg-${sequence.current}`, role: "assistant", content: "Business data access is paused for this conversation. Turn it back on so I can safely read customers, invoices, stock and sales before answering.", time: "Now", status: "success" };
    if (lower.includes("invoice") || lower.includes("bill")) return { id: `msg-${sequence.current}`, role: "assistant", content: "I found Rahul Sharma and the matching product. I’ve prepared a draft invoice for your review.", time: "Now", status: "confirmation", card: { type: "invoice", title: "Draft invoice SME-1045", summary: "Review the customer, quantity and total before creating this invoice.", fields: [{ label: "Customer", value: "Rahul Sharma" }, { label: "Products", value: "2 × boAt Earphones" }, { label: "Total", value: "₹2,998" }, { label: "Payment", value: "Unpaid" }, { label: "Due date", value: "8 Aug 2026" }, { label: "Stock after", value: "6 units" }] } };
    if (lower.includes("stock") || lower.includes("product")) return { id: `msg-${sequence.current}`, role: "assistant", content: "Three products need attention. The power bank is out of stock, while boAt earphones and cotton shirts are below their thresholds.", time: "Now", status: "success", card: { type: "inventory", title: "3 products need attention", summary: "Prioritise fast-moving earphones to avoid missed sales this week.", fields: [{ label: "Out of stock", value: "1 product" }, { label: "Low stock", value: "2 products" }, { label: "Restock value", value: "₹32,528" }] } };
    return { id: `msg-${sequence.current}`, role: "assistant", content: "Sales are up 12.4% this month. You have collected ₹8,493, with ₹8,390 still outstanding. Following up with Amit Patel is the clearest next action.", time: "Now", status: "success", card: { type: "analytics", title: "Monthly business summary", summary: "Revenue is growing, but collections need attention.", fields: [{ label: "Gross sales", value: "₹16,883" }, { label: "Collected", value: "₹8,493" }, { label: "Outstanding", value: "₹8,390" }] } };
  };

  const queueResponse = (prompt: string, bypassFailure = false) => {
    setActivity("thinking");
    window.setTimeout(() => setActivity("tool"), 650);
    window.setTimeout(() => {
      setMessages((current) => [...current, makeResponse(prompt, bypassFailure)]);
      setActivity("idle");
    }, 1550);
  };

  const sendPrompt = (rawPrompt?: string) => {
    const prompt = (rawPrompt ?? composer).trim();
    if (!prompt || activity !== "idle") return;
    if (demoState === "offline") { toast({ title: "You’re offline", description: "Reconnect to ask AI. Your typed message is still here.", variant: "warning" }); return; }
    if (demoState === "limit") { toast({ title: "AI usage limit reached", description: "Upgrade your plan or wait until usage resets on 1 September.", variant: "warning" }); return; }
    sequence.current += 1;
    const content = attachmentName ? `${prompt}\nAttached: ${attachmentName}` : prompt;
    setMessages((current) => [...current, { id: `msg-${sequence.current}`, role: "user", content, time: "Now", status: "success" }]);
    setComposer(""); setAttachmentName(null);
    if (attachmentInputRef.current) attachmentInputRef.current.value = "";
    queueResponse(prompt);
  };

  const retryMessage = (messageId: string) => {
    if (activity !== "idle") return;
    if (demoState === "offline") {
      toast({ title: "Still offline", description: "Reconnect before retrying this request.", variant: "warning" });
      return;
    }
    const failedIndex = messages.findIndex((message) => message.id === messageId);
    const userMessage = [...messages.slice(0, failedIndex)].reverse().find((message) => message.role === "user");
    if (!userMessage) {
      toast({ title: "Request unavailable", description: "Start a new prompt instead of retrying this response.", variant: "warning" });
      return;
    }
    setDemoState((state) => state === "error" ? "ready" : state);
    setMessages((current) => current.filter((message) => message.id !== messageId));
    queueResponse(userMessage.content.split("\nAttached:")[0].trim(), true);
    toast({ title: "Retrying request", description: "The failed response was cleared and the business data check restarted.", variant: "info" });
  };

  const editAction = (messageId: string, card: ChatCard) => {
    const detailSummary = card.fields.slice(0, 3).map((field) => `${field.label}: ${field.value}`).join(", ");
    setMessages((current) => current.map((message) => message.id === messageId ? { ...message, status: "success", content: "The draft is open for editing. Tell me what should change before you confirm it." } : message));
    setComposer(`Update ${card.title}. Current details: ${detailSummary}. Change `);
    window.setTimeout(() => textareaRef.current?.focus(), 50);
    toast({ title: "Draft opened for editing", description: "Describe the change in the composer, then send it for a fresh confirmation.", variant: "info" });
  };

  const chooseAttachment = () => attachmentInputRef.current?.click();
  const attachFile = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Attachment is too large", description: "Choose a file smaller than 10 MB for this mock upload.", variant: "warning" });
      if (attachmentInputRef.current) attachmentInputRef.current.value = "";
      return;
    }
    setAttachmentName(file.name);
    setComposer((current) => current || "Review this attachment and summarise the business impact");
    toast({ title: "Attachment ready", description: `${file.name} will be included with your next message.`, variant: "success" });
  };

  const toggleBusinessData = () => {
    setBusinessDataEnabled((enabled) => {
      const next = !enabled;
      toast({ title: next ? "Business data enabled" : "Business data paused", description: next ? "AI can use connected mock records again." : "AI will not read customers, invoices, stock or sales.", variant: next ? "success" : "warning" });
      return next;
    });
  };

  const confirmAction = () => {
    sequence.current += 1;
    setMessages((current) => [...current.map((message) => message.status === "confirmation" ? { ...message, status: "success" as const } : message), { id: `msg-${sequence.current}`, role: "assistant", content: "Invoice SME-1045 was created successfully. Stock has been updated and the invoice is ready to share.", time: "Now", status: "success", card: { type: "invoice", title: "Invoice created", summary: "SME-1045 · Rahul Sharma", fields: [{ label: "Total", value: "₹2,998" }, { label: "Status", value: "Unpaid" }, { label: "Delivery", value: "Not sent" }] } }]);
    toast({ title: "Invoice created", description: "SME-1045 is ready to send to Rahul Sharma.", variant: "success" });
  };

  const cancelAction = () => { setMessages((current) => current.map((message) => message.status === "confirmation" ? { ...message, status: "success" as const, content: "The draft was cancelled. Nothing was created and no stock was changed.", card: undefined } : message)); toast({ title: "Draft cancelled" }); };
  const feedback = (id: string, value: "up" | "down") => setMessages((current) => current.map((message) => message.id === id ? { ...message, feedback: message.feedback === value ? null : value } : message));

  const currentTitle = activeId ? conversations.find((conversation) => conversation.id === activeId)?.title : "New conversation";
  const empty = messages.length === 0 && activity === "idle";
  return (
    <div className="-mx-4 -mt-5 overflow-hidden border-y border-border bg-card sm:-mx-5 lg:-mx-7 lg:-mt-7 lg:rounded-xl lg:border 2xl:-mx-9" style={{ height: "calc(100dvh - 8.25rem)", minHeight: "620px" }}>
      <div className={cn("grid h-full", contextOpen ? "lg:grid-cols-[16.5rem_minmax(0,1fr)] xl:grid-cols-[16.5rem_minmax(0,1fr)_17rem]" : "lg:grid-cols-[16.5rem_minmax(0,1fr)]")}>
        <aside className="hidden min-h-0 border-r border-border bg-muted/35 lg:block" aria-label="Conversation history"><ConversationList conversations={conversations} activeId={activeId} onSelect={selectConversation} onNew={startNew} /></aside>

        <section className="flex min-h-0 min-w-0 flex-col" aria-label="AI Assistant conversation">
          <header className="flex min-h-16 items-center gap-2 border-b border-border px-3 sm:px-4">
            <button type="button" onClick={() => setHistoryOpen(true)} className="grid size-11 place-items-center rounded-xl text-muted-foreground hover:bg-muted lg:hidden" aria-label="Open conversation history"><Menu className="size-5" /></button>
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary"><Sparkles className="size-4.5" /></span>
            <div className="min-w-0 flex-1"><h1 className="truncate text-sm font-semibold">{currentTitle}</h1><p className="mt-0.5 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground"><span className={cn("size-1.5 rounded-full", demoState === "offline" ? "bg-danger" : businessDataEnabled ? "bg-success" : "bg-warning")} />{demoState === "offline" ? "Offline" : businessDataEnabled ? "Business data connected" : "Business data paused"}</p></div>
            <select value={demoState} onChange={(event) => setDemoState(event.target.value as DemoState)} className="hidden h-9 rounded-lg border border-border bg-card px-2 text-xs text-muted-foreground sm:block" aria-label="Preview AI state"><option value="ready">Demo: Ready</option><option value="offline">Demo: Offline</option><option value="limit">Demo: Limit reached</option><option value="error">Demo: Failed request</option></select>
            <Tooltip content={contextOpen ? "Hide business context" : "Show business context"}><button type="button" onClick={() => setContextOpen((value) => !value)} className="hidden size-10 place-items-center rounded-xl text-muted-foreground hover:bg-muted xl:grid" aria-label={contextOpen ? "Hide business context" : "Show business context"}>{contextOpen ? <PanelRightClose className="size-4.5" /> : <PanelRightOpen className="size-4.5" />}</button></Tooltip>
          </header>

          {demoState === "offline" ? <div className="flex items-center justify-center gap-2 border-b border-danger/20 bg-danger-soft px-4 py-2.5 text-xs font-medium text-danger" role="status"><WifiOff className="size-4" />You’re offline. Reconnect to continue; conversation history remains available.</div> : null}
          {demoState === "limit" ? <div className="flex items-center justify-center gap-2 border-b border-warning/20 bg-warning-soft px-4 py-2.5 text-xs font-medium text-warning" role="status"><AlertCircle className="size-4" />AI limit reached for this month. <Link href="/subscription/plans" className="font-bold underline">View upgrade options</Link></div> : null}

          <div className="min-h-0 flex-1 overflow-y-auto bg-background/45 px-3 py-5 sm:px-5" aria-live="polite">
            <div className="mx-auto w-full max-w-3xl">
              {empty ? (
                <div className="flex min-h-[30rem] flex-col items-center justify-center py-8 text-center">
                  <span className="relative grid size-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Sparkles className="size-7" /><span className="absolute -right-1 -top-1 size-4 rounded-full border-2 border-background bg-secondary" /></span>
                  <Badge variant="primary" className="mt-5">AI Business Assistant</Badge>
                  <h2 className="mt-3 text-balance text-2xl font-bold tracking-[-0.035em] sm:text-3xl">What would you like to get done?</h2>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">Ask in plain language. I can read your mock business data, prepare actions, and always ask before changing money or stock.</p>
                  <div className="mt-7 grid w-full gap-2 sm:grid-cols-2">
                    {starterSuggestions.map((suggestion) => (
                      <button key={suggestion.label} type="button" onClick={() => sendPrompt(suggestion.prompt)} className="group flex min-h-16 items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/35 hover:bg-primary-soft/30">
                        <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl", suggestion.tone)}><suggestion.icon className="size-4.5" /></span><span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{suggestion.label}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{suggestion.prompt}</span></span><Send className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  {messages.map((message) => <AIChatMessage key={message.id} message={message} onFeedback={feedback} onConfirm={confirmAction} onEdit={editAction} onCancel={cancelAction} onRetry={retryMessage} />)}
                  {activity !== "idle" ? <ActivityCard activity={activity} /> : null}
                </div>
              )}
              <div ref={messageEndRef} />
            </div>
          </div>

          <footer className="sticky bottom-[calc(4.75rem+env(safe-area-inset-bottom))] border-t border-border bg-card p-3 lg:bottom-0 sm:p-4">
            <form onSubmit={(event) => { event.preventDefault(); sendPrompt(); }} className="mx-auto max-w-3xl">
              <div className={cn("rounded-2xl border bg-background p-2 shadow-sm transition-colors focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10", demoState !== "ready" && demoState !== "error" ? "border-border opacity-75" : "border-border-strong")}>
                {attachmentName ? <div className="mb-1 flex items-center gap-2 rounded-xl bg-primary-soft px-3 py-2 text-xs text-primary"><Paperclip className="size-3.5 shrink-0" /><span className="min-w-0 flex-1 truncate font-medium">{attachmentName}</span><button type="button" onClick={() => { setAttachmentName(null); if (attachmentInputRef.current) attachmentInputRef.current.value = ""; }} className="grid size-7 place-items-center rounded-lg hover:bg-primary/10" aria-label={`Remove ${attachmentName}`}><X className="size-3.5" /></button></div> : null}
                <textarea ref={textareaRef} value={composer} onChange={(event) => setComposer(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendPrompt(); } }} rows={1} placeholder={demoState === "offline" ? "Reconnect to ask AI…" : demoState === "limit" ? "AI limit reached…" : "Ask about sales, stock, customers, invoices…"} className="max-h-32 min-h-11 w-full resize-none bg-transparent px-2.5 py-2.5 text-sm leading-6 placeholder:text-muted-foreground" aria-label="Message AI Assistant" />
                <div className="flex items-center justify-between gap-2 border-t border-border/70 px-1 pt-2">
                  <div className="flex items-center gap-1"><Tooltip content="Attach a file (demo)"><button type="button" onClick={chooseAttachment} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted" aria-label="Attach a file"><Paperclip className="size-4" /></button></Tooltip><input ref={attachmentInputRef} type="file" accept="image/*,.pdf,.csv" className="sr-only" onChange={(event) => attachFile(event.target.files?.[0])} /><button type="button" onClick={toggleBusinessData} aria-pressed={businessDataEnabled} className={cn("flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-xs font-medium hover:bg-muted", businessDataEnabled ? "text-success" : "text-muted-foreground")}><span className={cn("size-2 rounded-full", businessDataEnabled ? "bg-success" : "bg-border-strong")} /><span className="hidden sm:inline">Business data {businessDataEnabled ? "on" : "off"}</span><span className="sr-only sm:hidden">{businessDataEnabled ? "Disable" : "Enable"} business data</span></button></div>
                  <Button type="submit" size="icon" disabled={!composer.trim() || activity !== "idle" || demoState === "offline" || demoState === "limit"} aria-label="Send message">{activity !== "idle" ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}</Button>
                </div>
              </div>
              <p className="mt-2 text-center text-[0.65rem] text-muted-foreground">AI can make mistakes. Review business actions before confirming.</p>
            </form>
          </footer>
        </section>

        {contextOpen ? (
          <aside className="hidden min-h-0 overflow-y-auto border-l border-border bg-muted/25 p-4 xl:block" aria-label="Business context">
            <div className="flex items-center justify-between"><h2 className="text-sm font-semibold">Business context</h2><Badge variant="success">Live mock</Badge></div>
            <div className="mt-4 rounded-xl border border-border bg-card p-4"><p className="text-xs text-muted-foreground">Current business</p><p className="mt-1.5 text-sm font-semibold">{business.name}</p><p className="mt-1 text-xs text-muted-foreground">Jaipur · Mobile shop</p></div>
            <dl className="mt-3 space-y-2">
              <div className="rounded-xl border border-border bg-card p-3.5"><dt className="text-xs text-muted-foreground">Monthly sales</dt><dd className="mt-1 text-lg font-bold"><CurrencyDisplay amount={monthlySales} /></dd></div>
              <div className="rounded-xl border border-border bg-card p-3.5"><dt className="text-xs text-muted-foreground">Outstanding</dt><dd className="mt-1 text-lg font-bold text-warning"><CurrencyDisplay amount={outstanding} /></dd></div>
              <div className="rounded-xl border border-border bg-card p-3.5"><dt className="text-xs text-muted-foreground">Stock alerts</dt><dd className="mt-1 flex items-center gap-2 text-lg font-bold">{lowStock}<Badge variant="warning">Needs attention</Badge></dd></div>
            </dl>
            <div className="mt-5"><Progress value={subscription.aiUsage.used} max={subscription.aiUsage.limit ?? 200} showValue label="AI actions used" valueLabel={`${subscription.aiUsage.used} of ${subscription.aiUsage.limit}`} /><p className="mt-2 text-[0.68rem] leading-5 text-muted-foreground">Pro plan · Resets 1 September</p><Link href="/subscription" className={buttonStyles({ variant: "outline", size: "sm", block: true, className: "mt-3" })}>Manage plan</Link></div>
            <div className="mt-5 border-t border-border pt-4"><h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Available tools</h3><ul className="mt-3 space-y-2 text-xs text-muted-foreground"><li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-success" />Customers and ledger</li><li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-success" />Products and stock</li><li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-success" />Invoices and payments</li><li className="flex items-center gap-2"><CheckCircle2 className="size-3.5 text-success" />Sales analytics</li></ul></div>
          </aside>
        ) : null}
      </div>

      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}><SheetContent side="left" className="w-[min(22rem,calc(100%-2rem))] p-0"><SheetHeader className="sr-only"><SheetTitle>Conversation history</SheetTitle><SheetDescription>Select an AI Assistant conversation.</SheetDescription></SheetHeader><ConversationList conversations={conversations} activeId={activeId} onSelect={selectConversation} onNew={startNew} /></SheetContent></Sheet>
    </div>
  );
}

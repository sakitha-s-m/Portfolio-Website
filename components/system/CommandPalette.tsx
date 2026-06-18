"use client";

import { useCallback, useEffect, useState } from "react";
import { Command } from "cmdk";
import { AnimatePresence, motion } from "framer-motion";
import {
  User,
  Cpu,
  FolderGit2,
  GitCommitHorizontal,
  TerminalSquare,
  FileDown,
  Github,
  Linkedin,
  Mail,
  Copy,
  ArrowUp,
} from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import { PROFILE } from "@/lib/profile";

type Item = {
  label: string;
  hint?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string;
};

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  const run = useCallback((fn: () => void) => {
    setOpen(false);
    setTimeout(fn, 80);
  }, []);

  const nav: Item[] = [
    { label: "go to top", hint: "home", icon: <ArrowUp className="size-4" />, action: () => scrollToId("top") },
    { label: "view about", hint: "the journey", icon: <User className="size-4" />, action: () => scrollToId("about"), keywords: "story timeline" },
    { label: "view skills", hint: "tech ecosystem", icon: <Cpu className="size-4" />, action: () => scrollToId("skills"), keywords: "stack technologies" },
    { label: "view projects", hint: "the good stuff", icon: <FolderGit2 className="size-4" />, action: () => scrollToId("projects"), keywords: "work mazerunner trading" },
    { label: "view experience", hint: "git log", icon: <GitCommitHorizontal className="size-4" />, action: () => scrollToId("experience"), keywords: "work history mcdonalds" },
    { label: "contact me", hint: "say hello", icon: <TerminalSquare className="size-4" />, action: () => scrollToId("contact"), keywords: "email message hire" },
  ];

  const actions: Item[] = [
    {
      label: "download resume",
      hint: "pdf",
      icon: <FileDown className="size-4" />,
      action: () => window.open(PROFILE.resume, "_blank"),
      keywords: "cv resume",
    },
    {
      label: "copy email",
      hint: copied ? "copied!" : PROFILE.email,
      icon: <Copy className="size-4" />,
      action: () => {
        navigator.clipboard?.writeText(PROFILE.email);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      keywords: "email clipboard",
    },
  ];

  const links: Item[] = [
    { label: "github", hint: "sakitha-s-m", icon: <Github className="size-4" />, action: () => window.open(PROFILE.github, "_blank") },
    { label: "linkedin", hint: "sakitha-manamperi", icon: <Linkedin className="size-4" />, action: () => window.open(PROFILE.linkedin, "_blank") },
    { label: "send email", hint: PROFILE.email, icon: <Mail className="size-4" />, action: () => window.open(`mailto:${PROFILE.email}`) },
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[18vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full max-w-xl"
          >
            <Command
              label="Command palette"
              className="glass panel-glow overflow-hidden rounded-2xl"
            >
              <div className="flex items-center gap-3 border-b border-line px-4">
                <span className="font-mono text-sm text-accent">&gt;</span>
                <Command.Input
                  autoFocus
                  placeholder="type a command or search…"
                  className="h-13 w-full bg-transparent py-4 font-mono text-sm text-ink outline-none placeholder:text-faint"
                />
                <kbd className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[10px] text-muted">esc</kbd>
              </div>
              <Command.List className="max-h-[46vh] overflow-y-auto p-2">
                <Command.Empty className="px-4 py-8 text-center font-mono text-sm text-faint">
                  command not found <span className="text-rose">✗</span>
                </Command.Empty>
                {[
                  { heading: "navigate", items: nav },
                  { heading: "actions", items: actions },
                  { heading: "links", items: links },
                ].map((group) => (
                  <Command.Group
                    key={group.heading}
                    heading={group.heading}
                    className="mb-1 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest [&_[cmdk-group-heading]]:text-faint"
                  >
                    {group.items.map((item) => (
                      <Command.Item
                        key={item.label}
                        value={`${item.label} ${item.keywords ?? ""}`}
                        onSelect={() => run(item.action)}
                        className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 font-mono text-sm text-muted transition-colors duration-150 data-[selected=true]:bg-accent/10 data-[selected=true]:text-ink"
                      >
                        <span className="text-accent/80">{item.icon}</span>
                        <span>{item.label}</span>
                        {item.hint && (
                          <span className="ml-auto text-[11px] text-faint">{item.hint}</span>
                        )}
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
              <div className="flex items-center justify-between border-t border-line px-4 py-2 font-mono text-[10px] text-faint">
                <span>↑↓ navigate · ↵ run</span>
                <span>sakitha.os</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

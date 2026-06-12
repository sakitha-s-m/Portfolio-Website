"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Linkedin, Mail, Send } from "lucide-react";
import { PROFILE } from "@/lib/profile";
import { FadeUp, TextReveal } from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

type Status = "idle" | "sending" | "sent";

export default function Contact() {
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") ?? "");
    const message = String(data.get("message") ?? "");
    const from = String(data.get("email") ?? "");
    setStatus("sending");
    const subject = encodeURIComponent(`Hello from ${name} — portfolio`);
    const body = encodeURIComponent(`${message}\n\n— ${name}\n${from}`);
    setTimeout(() => {
      window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
      setStatus("sent");
    }, 900);
  };

  return (
    <section id="contact" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-36">
      <div className="mx-auto max-w-3xl">
        <FadeUp>
          <div className="glass panel-glow overflow-hidden rounded-2xl">
            {/* terminal header */}
            <div className="flex items-center gap-2 border-b border-line px-5 py-3.5">
              <span className="size-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
              <span className="size-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
              <span className="size-3 rounded-full bg-[#28c840]" aria-hidden="true" />
              <span className="ml-3 font-mono text-xs text-faint">contact — zsh</span>
            </div>

            <div className="p-6 sm:p-10">
              <p className="font-mono text-xs text-faint sm:text-sm">
                <span className="text-accent">sakitha@melbourne</span>:~$ ./connect --init
              </p>

              <TextReveal
                text="Let's build something together."
                className="mt-5 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl"
              />
              <p className="mt-4 max-w-lg leading-relaxed text-muted">
                Internships, junior roles, collaborations or just a good conversation about
                software — my inbox compiles instantly.
              </p>

              {/* command buttons */}
              <div className="mt-8 flex flex-wrap gap-3 font-mono text-sm">
                <button
                  onClick={() => setFormOpen((o) => !o)}
                  aria-expanded={formOpen}
                  className={`cursor-pointer rounded-lg border px-4 py-2.5 transition-colors duration-200 ${
                    formOpen
                      ? "border-accent/60 bg-accent/10 text-accent"
                      : "border-line text-ink hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  &gt; send message
                </button>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-muted transition-colors duration-200 hover:border-accent/50 hover:text-ink"
                >
                  &gt; email
                </a>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-muted transition-colors duration-200 hover:border-accent/50 hover:text-ink"
                >
                  &gt; github
                </a>
                <a
                  href={PROFILE.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer rounded-lg border border-line px-4 py-2.5 text-muted transition-colors duration-200 hover:border-accent/50 hover:text-ink"
                >
                  &gt; linkedin
                </a>
              </div>

              {/* expanding form */}
              <AnimatePresence initial={false}>
                {formOpen && (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-8 grid gap-5 border-t border-line pt-8 sm:grid-cols-2">
                      <div>
                        <label htmlFor="c-name" className="mb-1.5 block font-mono text-xs text-faint">
                          --name
                        </label>
                        <input
                          id="c-name"
                          name="name"
                          required
                          autoComplete="name"
                          className="w-full rounded-lg border border-line bg-black/30 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors duration-200 placeholder:text-faint focus:border-accent/60"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="c-email" className="mb-1.5 block font-mono text-xs text-faint">
                          --reply-to
                        </label>
                        <input
                          id="c-email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="w-full rounded-lg border border-line bg-black/30 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors duration-200 placeholder:text-faint focus:border-accent/60"
                          placeholder="jane@company.com"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label htmlFor="c-msg" className="mb-1.5 block font-mono text-xs text-faint">
                          --message
                        </label>
                        <textarea
                          id="c-msg"
                          name="message"
                          required
                          rows={4}
                          className="w-full resize-y rounded-lg border border-line bg-black/30 px-4 py-3 font-mono text-sm text-ink outline-none transition-colors duration-200 placeholder:text-faint focus:border-accent/60"
                          placeholder="We'd love to talk about…"
                        />
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <MagneticButton
                        className={`rounded-full px-6 py-3 font-mono text-sm font-medium transition-colors duration-200 ${
                          status === "sending"
                            ? "pointer-events-none bg-accent/50 text-bg"
                            : "bg-accent text-bg hover:bg-accent-deep"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Send className="size-4" aria-hidden="true" />
                          {status === "sending" ? "transmitting…" : "transmit ⏎"}
                        </span>
                      </MagneticButton>
                      <AnimatePresence>
                        {status === "sent" && (
                          <motion.p
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="font-mono text-xs text-accent"
                          >
                            ✓ handshake complete — opening your mail client
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* direct coordinates */}
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6 font-mono text-xs text-muted">
                <a href={`mailto:${PROFILE.email}`} className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-accent">
                  <Mail className="size-3.5" aria-hidden="true" /> {PROFILE.email}
                </a>
                <a href={PROFILE.github} target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-accent">
                  <Github className="size-3.5" aria-hidden="true" /> sakitha-s-m
                </a>
                <a href={PROFILE.linkedin} target="_blank" rel="noopener noreferrer" className="flex cursor-pointer items-center gap-2 transition-colors duration-200 hover:text-accent">
                  <Linkedin className="size-3.5" aria-hidden="true" /> ssm2004
                </a>
              </div>
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

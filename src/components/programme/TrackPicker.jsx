import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import PickerTabs from "../motion/PickerTabs";
import { SectionHead } from "./ProgrammeParts";
import Reveal from "../motion/Reveal";

/**
 * Tap a track and see it on a small lesson screen: what it is, a taste of
 * the first lesson, and what it covers.
 *
 * `tracks`: [{ key, label, Icon, line, taste, tags }]. `enrol`: { to, state, label }.
 */
export default function TrackPicker({ eyebrow, title, tracks, enrol }) {
  const [track, setTrack] = useState(tracks[0].key);
  return (
    <section className="dark-surface relative overflow-hidden bg-[linear-gradient(135deg,var(--color-background-dark)_0%,var(--color-primary-deep)_60%,var(--color-primary)_100%)] py-20 md:py-24">
      <div className="container">
        <SectionHead eyebrow={eyebrow} title={title} dark className="mb-8" />
        <Reveal>
          <PickerTabs items={tracks} value={track} onChange={setTrack} label="Tracks" tone="dark">
            {(item) => (
              <div className="glass-dark overflow-hidden">
                <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-accent)]" />
                  <span className="ml-3 text-xs font-medium text-[var(--color-text-on-dark-muted)]">{item.label}</span>
                </div>
                <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
                  <div>
                    <p className="text-xl font-bold leading-snug text-white sm:text-2xl">{item.line}</p>
                    <p className="mt-5 w-fit max-w-full break-words rounded-[var(--radius-sm)] bg-black/30 px-4 py-3 font-mono text-sm text-[var(--color-accent-text-on-hero)]">
                      {item.taste}
                    </p>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="What it covers">
                      {item.tags.map((tag) => (
                        <li key={tag} className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link to={enrol.to} state={enrol.state} className="btn-primary btn-on-dark w-fit whitespace-nowrap">
                    {enrol.label}
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </Link>
                </div>
              </div>
            )}
          </PickerTabs>
        </Reveal>
      </div>
    </section>
  );
}

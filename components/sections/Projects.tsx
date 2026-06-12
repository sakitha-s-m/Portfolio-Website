"use client";

import { PROJECTS } from "@/lib/profile";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectShowcase from "./ProjectShowcase";

export default function Projects() {
  return (
    <section id="projects" className="relative mx-auto max-w-7xl px-5 py-28 sm:px-8 md:py-36">
      <SectionHeading
        index="03"
        slug="projects"
        title="Projects run like programs."
        sub="No cards, no thumbnails — each project boots in front of you as you scroll, the way software should."
      />
      <div className="space-y-6">
        {PROJECTS.map((p, i) => (
          <ProjectShowcase key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}

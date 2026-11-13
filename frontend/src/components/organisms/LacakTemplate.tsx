"use client";

import { useState } from "react";
import ReportSection from "@/components/organisms/ReportSection";
import TrackHero from "@/components/organisms/TrackHero";
import TrackResults from "@/components/organisms/TrackResults";
import VerifySection from "@/components/organisms/VerifySection";
import VillageFilterSection from "@/components/organisms/VillageFilterSection";
import { useLacak } from "@/hooks/use-lacak";
import { useReveal } from "@/hooks/use-reveal";

export default function LacakTemplate() {
  useReveal();
  const { resultRef, reportRef, q, input, setInput, registry, loading, error, found, reportCode, setReportCode, reportError, open, search, goReport } = useLacak();
  const [village, setVillage] = useState<string | null>(null);
  const filtered = village ? registry.filter((c) => c.village === village) : registry;

  const pickVillage = (next: string | null) => {
    setVillage(next);
    requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <main>
      <TrackHero registry={registry} input={input} onInput={setInput} onSearch={search} onOpen={open} />
      <TrackResults ref={resultRef} registry={filtered} loading={loading} error={error} query={q} found={found} onOpen={open} onReport={goReport} activeVillage={village} onClearVillage={() => setVillage(null)} />
      <VillageFilterSection registry={registry} active={village} onPick={pickVillage} />
      <VerifySection onOpen={open} />
      <ReportSection ref={reportRef} registry={registry} code={reportCode} onCode={setReportCode} error={reportError} onOpen={open} />
    </main>
  );
}

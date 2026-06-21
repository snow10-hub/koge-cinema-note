"use client";

import { useState } from "react";

type ExpandableOverviewProps = {
  overview: string;
  maxLength?: number;
};

export function ExpandableOverview({
  overview,
  maxLength = 200,
}: ExpandableOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const text = overview.trim() || "あらすじ情報はありません。";
  const shouldCollapse = text.length > maxLength;
  const visibleText =
    shouldCollapse && !isExpanded ? `${text.slice(0, maxLength)}…` : text;

  return (
    <div>
      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-200">
        {visibleText}
      </p>

      {shouldCollapse && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          className="mt-4 cursor-pointer text-xs font-bold tracking-wider text-sky-400 transition hover:text-sky-300"
        >
          {isExpanded ? "閉じる" : "続きを読む"}
        </button>
      )}
    </div>
  );
}
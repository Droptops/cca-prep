import { useState, useEffect, useMemo } from "react";

const STORAGE_KEY = "cca-prep-progress-v1";

const PREREQS = [
  { id: "node",         name: "Node.js v18+",                        cmd: "https://nodejs.org/",                                         note: "Required for Claude Code CLI & MCP SDK" },
  { id: "python",       name: "Python 3.10+",                        cmd: "https://python.org/",                                         note: "Required for MCP Python SDK & Anthropic courses" },
  { id: "git",          name: "Git",                                 cmd: "https://git-scm.com/",                                        note: "Version control — every Claude Code workflow uses it" },
  { id: "claude-code",  name: "Claude Code CLI",                     cmd: "npm install -g @anthropic-ai/claude-code",                    note: "Core tool. Requires Pro/Max/Team subscription." },
  { id: "sub",          name: "Claude Pro / Max / Team sub",         cmd: "https://claude.ai/",                                          note: "Required to actually run Claude Code" },
  { id: "api-key",      name: "Anthropic API key + credits",         cmd: "https://console.anthropic.com/",                              note: "For SDK and API exercises" },
  { id: "uv",           name: "uv (Python package manager)",         cmd: "https://docs.astral.sh/uv/",                                  note: "Recommended for MCP server development" },
  { id: "vscode",       name: "VS Code or Cursor",                   cmd: "https://code.visualstudio.com/",                              note: "IDE with Claude Code integration" },
  { id: "agent-sdk-py", name: "claude-agent-sdk (Python)",           cmd: "pip install claude-agent-sdk",                                note: "Agentic architecture exercises" },
  { id: "agent-sdk-ts", name: "@anthropic-ai/claude-agent-sdk (TS)", cmd: "npm install @anthropic-ai/claude-agent-sdk",                  note: "TypeScript Agent SDK" },
  { id: "mcp-sdk",      name: "MCP Python SDK",                      cmd: "pip install mcp",                                             note: "Build MCP servers" },
  { id: "anthropic-py", name: "anthropic (Python)",                  cmd: "pip install anthropic",                                       note: "API client for prompt engineering exercises" },
];

const MODULES = [
  {
    id: "w0",
    week: "Week 0",
    title: "Setup & Claude Fundamentals",
    domain: null,
    weight: null,
    accent: "#94a3b8",
    summary: "Get tooling installed, learn the Claude platform surface area, verify your API + Claude Code environment works end-to-end.",
    lessons: [
      { id: "w0-1", title: "Complete the prerequisites checklist above", type: "task", time: "30m", note: "Don't skip. Later exercises assume every item is installed." },
      { id: "w0-2", title: "Anthropic Academy — Claude 101", type: "course", time: "1h", url: "https://anthropic.skilljar.com/", note: "Free course with certificate. Foundational." },
      { id: "w0-3", title: "Read: Exam Guide (cover to cover)", type: "read", time: "45m", url: "https://www.anthropic.com/certification", note: "Know the 5 domains, weights, and 12 sample questions before starting Week 1." },
      { id: "w0-4", title: "Run: claude --help and /init in a fresh repo", type: "task", time: "30m", note: "Confirm CLI works, auth is set, and a CLAUDE.md generates correctly." },
      { id: "w0-5", title: "Run: a basic Anthropic API call in Python", type: "task", time: "30m", url: "https://docs.anthropic.com/en/api/getting-started", note: "Confirm credentials + billing work before Week 4." },
    ],
  },
  {
    id: "w1",
    week: "Week 1",
    title: "Agentic Architecture & Orchestration",
    domain: "Domain 1",
    weight: "27%",
    accent: "#f59e0b",
    summary: "Largest exam domain. Multi-agent orchestration, subagent delegation, tool integration, lifecycle hooks, error handling.",
    lessons: [
      { id: "w1-1", title: "Read: Building Effective AI Agents (Anthropic)", type: "read", time: "45m", url: "https://www.anthropic.com/engineering/building-effective-agents", note: "Foundational reading. Workflow vs. agent distinction is on the exam." },
      { id: "w1-2", title: "Agent SDK overview + quickstart", type: "read", time: "1h", url: "https://docs.claude.com/en/api/agent-sdk/overview", note: "Understand ClaudeSDKClient, tools, subagents, hooks." },
      { id: "w1-3", title: "Course: DeepLearning.AI — Building Agentic Apps with Claude", type: "course", time: "2h", url: "https://www.deeplearning.ai/short-courses/", note: "Free. Walks through coordinator/worker patterns." },
      { id: "w1-4", title: "Hands-on: build an agentic loop (Python)", type: "task", time: "2h", note: "Single agent with 2–3 tools. Add a lifecycle hook. Log every tool call." },
      { id: "w1-5", title: "Hands-on: build a coordinator + 2 subagents", type: "task", time: "2h", note: "One subagent for research, one for writing. Coordinator decides routing." },
      { id: "w1-6", title: "Study: error handling + human-in-the-loop patterns", type: "read", time: "45m", note: "When to retry, when to escalate, how to suspend mid-task. Exam Q8-ish territory." },
    ],
  },
  {
    id: "w2",
    week: "Week 2",
    title: "Tool Design & MCP Integration",
    domain: "Domain 4",
    weight: "18%",
    accent: "#10b981",
    summary: "MCP servers, tool schemas, resource vs. tool, .mcp.json config, trust boundaries.",
    lessons: [
      { id: "w2-1", title: "Read: MCP official docs (Intro + Server quickstart)", type: "read", time: "1h", url: "https://modelcontextprotocol.io/docs/develop/build-server", note: "Start here. Concepts first, then build." },
      { id: "w2-2", title: "Course: MCP Academy (Anthropic)", type: "course", time: "1.5h", url: "https://anthropic.skilljar.com/", note: "Official MCP training." },
      { id: "w2-3", title: "Hands-on: build a minimal MCP server", type: "task", time: "2h", note: "2 tools + 1 resource. Use the Python SDK. Test it against Claude Code." },
      { id: "w2-4", title: "Configure .mcp.json in a Claude Code project", type: "task", time: "30m", note: "Point Claude Code at your server. Verify tools show up in /mcp." },
      { id: "w2-5", title: "Study: tool_choice auto / any / forced", type: "read", time: "30m", url: "https://docs.anthropic.com/en/docs/build-with-claude/tool-use", note: "Know when each is correct. Exam-relevant." },
      { id: "w2-6", title: "Study: when to use MCP vs. API tools vs. Claude Code tools", type: "read", time: "30m", note: "Decision framework is tested." },
    ],
  },
  {
    id: "w3",
    week: "Week 3",
    title: "Claude Code Configuration & Workflows",
    domain: "Domain 2",
    weight: "20%",
    accent: "#3b82f6",
    summary: "CLAUDE.md hierarchy, Agent Skills, hooks vs. prompts, plan mode, CI/CD integration with -p flag.",
    lessons: [
      { id: "w3-1", title: "Claude Code docs — full quickstart", type: "read", time: "1h", url: "https://code.claude.com/docs/en/quickstart", note: "Every page. Dense but tested." },
      { id: "w3-2", title: "Study: CLAUDE.md hierarchy (project / parent / user)", type: "read", time: "30m", note: "Order of precedence is an exam favorite." },
      { id: "w3-3", title: "Study: Agent Skills + SKILL.md structure", type: "read", time: "45m", url: "https://docs.claude.com/en/docs/claude-code/skills", note: "When skills activate, how they're discovered." },
      { id: "w3-4", title: "Study: hooks (100%) vs. prompts (~70% adherence)", type: "read", time: "30m", note: "Memorize: hooks = enforcement, prompts = guidance. Exam Q." },
      { id: "w3-5", title: "Hands-on: use -p flag in CI/CD", type: "task", time: "1h", note: "Non-interactive Claude Code run in a GitHub Action. Write the YAML yourself." },
      { id: "w3-6", title: "Hands-on: build a hook that blocks unsafe file writes", type: "task", time: "1h", note: "PreToolUse hook. Deny writes outside the repo." },
      { id: "w3-7", title: "Study: plan mode vs. direct execution", type: "read", time: "20m", note: "When to require explicit approval before action." },
    ],
  },
  {
    id: "w4",
    week: "Week 4",
    title: "Prompt Engineering & Structured Output",
    domain: "Domain 3",
    weight: "20%",
    accent: "#8b5cf6",
    summary: "XML tags, few-shot examples, JSON schema outputs, extraction patterns, batch API for cost.",
    lessons: [
      { id: "w4-1", title: "Anthropic Prompt Engineering docs", type: "read", time: "1.5h", url: "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview", note: "Read every page. Exam is prompt-pattern heavy." },
      { id: "w4-2", title: "Course: Anthropic Prompting Course (GitHub)", type: "course", time: "2h", url: "https://github.com/anthropics/courses", note: "Work through the notebooks. Hands-on." },
      { id: "w4-3", title: "Hands-on: structured JSON extraction from unstructured doc", type: "task", time: "1h", note: "Parse a contract. Return a validated schema. Handle missing fields gracefully." },
      { id: "w4-4", title: "Study: Batch API — 50% cost, up to 24h latency", type: "read", time: "20m", url: "https://docs.anthropic.com/en/api/creating-message-batches", note: "Know when batch beats real-time. Exam Q." },
      { id: "w4-5", title: "Study: prefill, stop sequences, XML output tags", type: "read", time: "30m", note: "Prefill is the cleanest way to force JSON-only responses." },
      { id: "w4-6", title: "Study: few-shot example selection strategy", type: "read", time: "20m", note: "Diversity > quantity. Cover edge cases in examples." },
    ],
  },
  {
    id: "w5",
    week: "Week 5",
    title: "Context Management & Reliability",
    domain: "Domain 5",
    weight: "15%",
    accent: "#ec4899",
    summary: "Context window strategy, scratchpad files, error propagation, confidence calibration, escalation patterns.",
    lessons: [
      { id: "w5-1", title: "Study: context window management for long documents", type: "read", time: "45m", note: "Chunking, summarization, retrieval. When each pattern wins." },
      { id: "w5-2", title: "Study: scratchpad files & --resume sessions", type: "read", time: "30m", url: "https://code.claude.com/docs/en/how-claude-code-works", note: "Persistence across context boundaries. fork_session for parallel exploration." },
      { id: "w5-3", title: "Study: error propagation in multi-agent pipelines", type: "read", time: "30m", note: "Distinguish access failures from valid-empty results. Never silently suppress." },
      { id: "w5-4", title: "Study: confidence calibration + human review sampling", type: "read", time: "30m", note: "Stratified sampling, field-level confidence, validation sets." },
      { id: "w5-5", title: "Study: information provenance in synthesis", type: "read", time: "30m", note: "Claim-source mappings. Conflicting data → annotate both. Publication dates matter." },
      { id: "w5-6", title: "Hands-on: build a pipeline with explicit error escalation", type: "task", time: "1.5h", note: "3 stages. Each can pass, fail-retry, or fail-escalate to human." },
    ],
  },
  {
    id: "w6",
    week: "Week 6",
    title: "Review & Practice Exam",
    domain: "Final",
    weight: null,
    accent: "#0ea5e9",
    summary: "Consolidate, take the practice exam, remediate weak domains, sit the real thing.",
    lessons: [
      { id: "w6-1", title: "Re-read the 12 sample questions in the exam guide", type: "read", time: "1h", note: "For each wrong answer: re-study that domain. For each right answer: articulate why each distractor fails." },
      { id: "w6-2", title: "Take the official CCA Practice Exam", type: "task", time: "1.5h", url: "https://anthropic.skilljar.com/", note: "Same format as the real exam. Explanations after each answer." },
      { id: "w6-3", title: "Remediate weak domains", type: "task", time: "2h", note: "Go back to the hands-on exercises for any domain where you scored under 75%." },
      { id: "w6-4", title: "Flashcard drill: key thresholds & facts", type: "read", time: "30m", note: "Hooks = 100%, prompts ≈ 70%. Batch API = 50% off, up to 24h. -p for CI. tool_choice modes. CLAUDE.md hierarchy. .claude/rules glob patterns." },
      { id: "w6-5", title: "🎯 Sit the CCA Foundations Exam", type: "task", time: "2h", url: "https://anthropic.skilljar.com/", note: "60 questions. Passing score 720/1000. You've got this." },
    ],
  },
];

const QUICK_LINKS = [
  ["Anthropic Academy",                 "https://anthropic.skilljar.com/"],
  ["Claude Code docs",                  "https://code.claude.com/docs/en/quickstart"],
  ["Agent SDK overview",                "https://docs.claude.com/en/api/agent-sdk/overview"],
  ["MCP official docs",                 "https://modelcontextprotocol.io/docs/develop/build-server"],
  ["Anthropic Courses (GitHub)",        "https://github.com/anthropics/courses"],
  ["Prompt engineering docs",           "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"],
  ["CCA certification page",            "https://www.anthropic.com/certification"],
];

const TYPE_STYLE = {
  task:   { label: "HANDS-ON", bg: "rgba(245,158,11,0.12)", fg: "#f59e0b" },
  course: { label: "COURSE",   bg: "rgba(139,92,246,0.12)", fg: "#a78bfa" },
  read:   { label: "READ",     bg: "rgba(59,130,246,0.12)", fg: "#60a5fa" },
};

export default function CCAPrepCourse() {
  const [done, setDone] = useState({});
  const [open, setOpen] = useState({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setDone(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {}
  }, [done]);

  const toggle = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const toggleOpen = (id) => setOpen((o) => ({ ...o, [id]: !o[id] }));
  const resetAll = () => {
    if (confirm("Reset all progress?")) setDone({});
  };

  const totals = useMemo(() => {
    const allLessonIds = MODULES.flatMap((m) => m.lessons.map((l) => l.id));
    const allPrereqIds = PREREQS.map((p) => p.id);
    const allIds = [...allLessonIds, ...allPrereqIds];
    const doneCount = allIds.filter((id) => done[id]).length;
    return { total: allIds.length, doneCount, pct: Math.round((doneCount / allIds.length) * 100) };
  }, [done]);

  const prereqDone = PREREQS.filter((p) => done[p.id]).length;

  return (
    <div style={styles.page}>
      <style>{globalCSS}</style>

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.tag}>CLAUDE CERTIFIED ARCHITECT — FOUNDATIONS</div>
        <h1 style={styles.h1}>Six weeks. Five domains. One exam.</h1>
        <p style={styles.subtitle}>
          Self-paced prep course for the CCA Foundations certification. Progress auto-saves to this browser.
        </p>

        <div style={styles.progressWrap}>
          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressBar, width: `${totals.pct}%` }} />
          </div>
          <div style={styles.progressMeta}>
            <span><b>{totals.doneCount}</b> / {totals.total} complete</span>
            <span>{totals.pct}%</span>
            <button onClick={resetAll} style={styles.resetBtn}>Reset</button>
          </div>
        </div>
      </header>

      {/* Prerequisites */}
      <section style={styles.section}>
        <div style={styles.sectionHead}>
          <h2 style={styles.h2}>Prerequisites</h2>
          <span style={styles.sectionMeta}>{prereqDone} / {PREREQS.length}</span>
        </div>
        <div style={styles.prereqGrid}>
          {PREREQS.map((p) => (
            <label key={p.id} style={{ ...styles.prereqCard, ...(done[p.id] ? styles.prereqCardDone : {}) }}>
              <input
                type="checkbox"
                checked={!!done[p.id]}
                onChange={() => toggle(p.id)}
                style={styles.checkbox}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={styles.prereqName}>{p.name}</div>
                <div style={styles.prereqCmd}>
                  {p.cmd.startsWith("http") ? (
                    <a href={p.cmd} target="_blank" rel="noopener noreferrer" style={styles.link}>{p.cmd} ↗</a>
                  ) : (
                    <code style={styles.code}>{p.cmd}</code>
                  )}
                </div>
                <div style={styles.prereqNote}>{p.note}</div>
              </div>
            </label>
          ))}
        </div>
      </section>

      {/* Modules */}
      {MODULES.map((m) => {
        const moduleDone = m.lessons.filter((l) => done[l.id]).length;
        const moduleTotal = m.lessons.length;
        const modulePct = Math.round((moduleDone / moduleTotal) * 100);
        const isOpen = open[m.id] ?? true;

        return (
          <section key={m.id} style={{ ...styles.module, borderLeft: `3px solid ${m.accent}` }}>
            <button onClick={() => toggleOpen(m.id)} style={styles.moduleHead}>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={styles.moduleWeek}>
                  <span style={{ color: m.accent }}>{m.week}</span>
                  {m.domain && (
                    <span style={styles.moduleDomain}>
                      {m.domain} · <b>{m.weight}</b>
                    </span>
                  )}
                </div>
                <h3 style={styles.moduleTitle}>{m.title}</h3>
                <p style={styles.moduleSummary}>{m.summary}</p>
              </div>
              <div style={styles.moduleRight}>
                <div style={styles.moduleCount}>{moduleDone}/{moduleTotal}</div>
                <div style={styles.moduleBarTrack}>
                  <div style={{ ...styles.moduleBar, width: `${modulePct}%`, background: m.accent }} />
                </div>
                <div style={{ ...styles.caret, transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}>▾</div>
              </div>
            </button>

            {isOpen && (
              <div style={styles.lessonList}>
                {m.lessons.map((l) => {
                  const style = TYPE_STYLE[l.type] ?? TYPE_STYLE.read;
                  return (
                    <label key={l.id} style={{ ...styles.lesson, ...(done[l.id] ? styles.lessonDone : {}) }}>
                      <input
                        type="checkbox"
                        checked={!!done[l.id]}
                        onChange={() => toggle(l.id)}
                        style={styles.checkbox}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={styles.lessonTopRow}>
                          <span style={{ ...styles.typeBadge, background: style.bg, color: style.fg }}>{style.label}</span>
                          <span style={styles.time}>{l.time}</span>
                        </div>
                        <div style={styles.lessonTitle}>{l.title}</div>
                        {l.note && <div style={styles.lessonNote}>{l.note}</div>}
                        {l.url && (
                          <a href={l.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
                            {l.url} ↗
                          </a>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {/* Quick links */}
      <section style={styles.quickLinks}>
        <h3 style={styles.h3}>Quick reference</h3>
        <div style={styles.linkList}>
          {QUICK_LINKS.map(([label, url]) => (
            <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={styles.quickLink}>
              {label} <span style={{ opacity: 0.4 }}>↗</span>
            </a>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        Self-study resource · Not affiliated with Anthropic · Progress stored locally in this browser
      </footer>
    </div>
  );
}

const globalCSS = `
  body { margin: 0; background: #0a0a0b; }
  * { box-sizing: border-box; }
  ::selection { background: rgba(245, 158, 11, 0.3); }
`;

const styles = {
  page: {
    maxWidth: 960,
    margin: "0 auto",
    padding: "48px 24px 80px",
    color: "rgba(255,255,255,0.92)",
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    lineHeight: 1.5,
    background: "#0a0a0b",
    minHeight: "100vh",
  },
  header: { marginBottom: 48 },
  tag: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.18em",
    color: "#f59e0b",
    marginBottom: 16,
  },
  h1: {
    fontSize: 44,
    fontWeight: 800,
    margin: "0 0 12px",
    letterSpacing: "-0.02em",
    lineHeight: 1.05,
  },
  subtitle: { fontSize: 15, color: "rgba(255,255,255,0.55)", margin: "0 0 28px", maxWidth: 640 },
  progressWrap: { marginTop: 8 },
  progressTrack: {
    height: 6, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden",
  },
  progressBar: {
    height: "100%", background: "linear-gradient(90deg, #f59e0b, #ec4899)", transition: "width 0.4s ease",
  },
  progressMeta: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    marginTop: 10, fontSize: 13, color: "rgba(255,255,255,0.6)",
  },
  resetBtn: {
    background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.6)", padding: "4px 10px", fontSize: 12, borderRadius: 6,
    cursor: "pointer",
  },
  section: { marginBottom: 40 },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 },
  h2: { fontSize: 22, fontWeight: 700, margin: 0, letterSpacing: "-0.01em" },
  sectionMeta: { fontSize: 13, color: "rgba(255,255,255,0.5)" },
  prereqGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 },
  prereqCard: {
    display: "flex", gap: 12, padding: 14,
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
  },
  prereqCardDone: { background: "rgba(245,158,11,0.04)", borderColor: "rgba(245,158,11,0.2)" },
  prereqName: { fontSize: 14, fontWeight: 600, marginBottom: 4 },
  prereqCmd: { fontSize: 12, marginBottom: 4, wordBreak: "break-all" },
  prereqNote: { fontSize: 12, color: "rgba(255,255,255,0.45)" },
  checkbox: { marginTop: 3, accentColor: "#f59e0b", cursor: "pointer", flexShrink: 0 },
  module: {
    marginBottom: 20, paddingLeft: 20,
    background: "rgba(255,255,255,0.015)", borderRadius: 8, overflow: "hidden",
  },
  moduleHead: {
    width: "100%", display: "flex", alignItems: "center", gap: 20,
    padding: "20px 20px 20px 0", background: "transparent", border: "none",
    color: "inherit", cursor: "pointer", fontFamily: "inherit",
  },
  moduleWeek: {
    fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
    display: "flex", gap: 12, alignItems: "center", marginBottom: 8,
  },
  moduleDomain: { color: "rgba(255,255,255,0.4)" },
  moduleTitle: { fontSize: 20, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.01em" },
  moduleSummary: { fontSize: 13, color: "rgba(255,255,255,0.55)", margin: 0 },
  moduleRight: { display: "flex", alignItems: "center", gap: 16, flexShrink: 0 },
  moduleCount: { fontSize: 13, color: "rgba(255,255,255,0.6)", minWidth: 40, textAlign: "right" },
  moduleBarTrack: { width: 80, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.06)", overflow: "hidden" },
  moduleBar: { height: "100%", transition: "width 0.3s ease" },
  caret: { fontSize: 14, color: "rgba(255,255,255,0.4)", transition: "transform 0.2s" },
  lessonList: { display: "flex", flexDirection: "column", gap: 6, padding: "0 20px 20px 0" },
  lesson: {
    display: "flex", gap: 12, padding: 14,
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: 6, cursor: "pointer", transition: "all 0.15s",
  },
  lessonDone: { opacity: 0.55 },
  lessonTopRow: { display: "flex", gap: 10, alignItems: "center", marginBottom: 6 },
  typeBadge: {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
    padding: "3px 8px", borderRadius: 4,
  },
  time: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
  lessonTitle: { fontSize: 14, fontWeight: 500, marginBottom: 4 },
  lessonNote: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, lineHeight: 1.45 },
  link: { fontSize: 12, color: "#60a5fa", textDecoration: "none", wordBreak: "break-all" },
  code: {
    fontFamily: '"SF Mono", Menlo, monospace', fontSize: 11,
    padding: "2px 6px", background: "rgba(255,255,255,0.06)", borderRadius: 4,
    color: "rgba(255,255,255,0.8)",
  },
  quickLinks: {
    marginTop: 48, padding: 24,
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10,
  },
  h3: { fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", margin: "0 0 14px", color: "rgba(255,255,255,0.6)" },
  linkList: { display: "flex", flexDirection: "column", gap: 8 },
  quickLink: { fontSize: 13, color: "#60a5fa", textDecoration: "none" },
  footer: {
    marginTop: 48, fontSize: 12, color: "rgba(255,255,255,0.35)",
    textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 24,
  },
};

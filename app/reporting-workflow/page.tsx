"use client";

import React, { useMemo, useState } from "react";

type ReportState =
  | "Not Started"
  | "In Progress"
  | "Paused"
  | "Ready for Authorization"
  | "Authorized";

type NotificationState = "Pending" | "Sent" | "Failed";
type IntegrationState = "Connected" | "Pending" | "Error";

type ReportTemplate = {
  id: number;
  name: string;
  modality: string;
  exam: string;
};

type Macro = {
  id: number;
  label: string;
  content: string;
};

type ReferenceItem = {
  id: number;
  title: string;
  content: string;
};

type PatientDocument = {
  id: number;
  name: string;
  type: string;
  uploadedAt: string;
};

type Addendum = {
  id: number;
  author: string;
  time: string;
  text: string;
};

type ReportLog = {
  id: number;
  state: ReportState;
  time: string;
  by: string;
  note: string;
};

type WorklistStudy = {
  id: number;
  patient: string;
  ageSex: string;
  study: string;
  date: string;
  modality: string;
  priority: "Pending" | "In Progress" | "Ready" | "Authorized";
};

const panelClass =
  "rounded-[22px] border border-[#17355c] bg-[#041126]/95 backdrop-blur-sm";
const subPanelClass =
  "rounded-[18px] border border-[#1e406a] bg-[#09162d]/90";
const inputClass =
  "h-9 w-full rounded-xl border border-[#29446d] bg-[#0c1830] px-3 text-[12px] text-white outline-none placeholder:text-white/35";
const selectClass =
  "h-9 w-full rounded-xl border border-[#29446d] bg-[#0c1830] px-3 text-[12px] text-white outline-none";
const buttonClass =
  "h-9 rounded-xl px-4 text-[12px] font-bold transition";

const templates: ReportTemplate[] = [
  { id: 1, name: "CT LS Standard", modality: "CT", exam: "CT Lumbosacral Spine" },
  { id: 2, name: "CT LS Degenerative", modality: "CT", exam: "CT Lumbosacral Spine" },
  { id: 3, name: "CT Abdomen", modality: "CT", exam: "CT Abdomen" },
  { id: 4, name: "US Abdomen", modality: "US", exam: "Abdominal Ultrasound" }
];

const macros: Macro[] = [
  { id: 1, label: "abdomen atherosclerosis", content: "Atherosclerotic calcification of the abdominal aorta is noted." },
  { id: 2, label: "ACL graft", content: "Prior ACL graft reconstruction is seen." },
  { id: 3, label: "addendum", content: "Addendum: Additional review confirms the previously described findings." },
  { id: 4, label: "arthritis", content: "Degenerative arthritic changes are present." }
];

const references: ReferenceItem[] = [
  { id: 1, title: "Grade Osteopenia", content: "Use standard wording for osteopenia severity only if clinically supported." },
  { id: 2, title: "Cambium", content: "Reference note placeholder for external reporting phrase set." },
  { id: 3, title: "Laterality Check", content: "Verify right / left consistency before authorization." }
];

const documents: PatientDocument[] = [
  { id: 1, name: "Referral.pdf", type: "Referral", uploadedAt: "24 Apr 2024 09:00 AM" },
  { id: 2, name: "Prior Report.pdf", type: "Prior Report", uploadedAt: "18 Mar 2024 02:15 PM" },
  { id: 3, name: "Clinical Note.png", type: "Clinical Attachment", uploadedAt: "24 Apr 2024 09:05 AM" }
];

const worklistStudies: WorklistStudy[] = [
  {
    id: 1,
    patient: "Ms HALL, Susan",
    ageSex: "65yF",
    study: "CT Lumbosacral scan",
    date: "29/12/2025",
    modality: "CT",
    priority: "Pending"
  },
  {
    id: 2,
    patient: "Ms HALL, Susan",
    ageSex: "65yF",
    study: "CT Upper Limb Non",
    date: "17/10/2023",
    modality: "CT",
    priority: "Authorized"
  },
  {
    id: 3,
    patient: "Ms HALL, Susan",
    ageSex: "65yF",
    study: "US Wrist Left",
    date: "17/10/2023",
    modality: "US",
    priority: "Ready"
  },
  {
    id: 4,
    patient: "Ms HALL, Susan",
    ageSex: "65yF",
    study: "US CV Veins Right L",
    date: "29/03/2023",
    modality: "US",
    priority: "Authorized"
  },
  {
    id: 5,
    patient: "Ms HALL, Susan",
    ageSex: "65yF",
    study: "US DVT Right Leg",
    date: "23/02/2022",
    modality: "US",
    priority: "Authorized"
  }
];

const initialLogs: ReportLog[] = [
  {
    id: 1,
    state: "In Progress",
    time: "24 Apr 2024 11:20 AM",
    by: "Dr Smith",
    note: "Reporting started from exam worklist."
  },
  {
    id: 2,
    state: "Paused",
    time: "24 Apr 2024 11:28 AM",
    by: "Dr Smith",
    note: "Paused during call interruption."
  },
  {
    id: 3,
    state: "In Progress",
    time: "24 Apr 2024 11:34 AM",
    by: "Dr Smith",
    note: "Reporting resumed."
  }
];

const lateralityWords = [
  "right",
  "left",
  "superior",
  "inferior",
  "anterior",
  "posterior",
  "high",
  "low",
  "less",
  "more"
];

function highlightProofing(text: string) {
  const words = text.split(/(\s+)/);
  return words.map((word, idx) => {
    const normalized = word.toLowerCase().replace(/[^a-z]/g, "");
    const isDirectional = lateralityWords.includes(normalized);
    const className = isDirectional ? "text-amber-300" : "text-white";
    return (
      <span key={idx} className={className}>
        {word}
      </span>
    );
  });
}

export default function ReportingWorkflowPage() {
  const [reportState, setReportState] = useState<ReportState>("In Progress");
  const [selectedTemplate, setSelectedTemplate] = useState<number>(1);
  const [selectedStudyId, setSelectedStudyId] = useState<number>(1);
  const [templateSearch, setTemplateSearch] = useState("");
  const [macroSearch, setMacroSearch] = useState("");
  const [referenceSearch, setReferenceSearch] = useState("");
  const [documentSearch, setDocumentSearch] = useState("");
  const [worklistSearch, setWorklistSearch] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [micState, setMicState] = useState<"Ready" | "Recording" | "Paused">("Ready");
  const [pacsState, setPacsState] = useState<IntegrationState>("Connected");
  const [notificationState, setNotificationState] = useState<NotificationState>("Pending");
  const [logs, setLogs] = useState<ReportLog[]>(initialLogs);
  const [addendums, setAddendums] = useState<Addendum[]>([]);
  const [newAddendum, setNewAddendum] = useState("");
  const [message, setMessage] = useState("");

  const [reportText, setReportText] = useState(`CT LUMBOSACRAL SPINE

CLINICAL HISTORY:
65Y Female | History of right sided leg pain/cramps. ?Nerve impingement

COMPARISON:

TECHNIQUE:

FINDINGS:

CONCLUSION:
1.`);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) =>
      `${t.name} ${t.modality} ${t.exam}`
        .toLowerCase()
        .includes(templateSearch.toLowerCase())
    );
  }, [templateSearch]);

  const filteredMacros = useMemo(() => {
    return macros.filter((m) =>
      `${m.label} ${m.content}`.toLowerCase().includes(macroSearch.toLowerCase())
    );
  }, [macroSearch]);

  const filteredReferences = useMemo(() => {
    return references.filter((r) =>
      `${r.title} ${r.content}`.toLowerCase().includes(referenceSearch.toLowerCase())
    );
  }, [referenceSearch]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) =>
      `${d.name} ${d.type}`.toLowerCase().includes(documentSearch.toLowerCase())
    );
  }, [documentSearch]);

  const filteredWorklist = useMemo(() => {
    return worklistStudies.filter((item) =>
      `${item.patient} ${item.study} ${item.modality} ${item.date}`
        .toLowerCase()
        .includes(worklistSearch.toLowerCase())
    );
  }, [worklistSearch]);

  const currentTemplate = templates.find((t) => t.id === selectedTemplate);
  const selectedStudy =
    worklistStudies.find((item) => item.id === selectedStudyId) ?? worklistStudies[0];

  const pushLog = (state: ReportState, note: string) => {
    setLogs((prev) => [
      {
        id: Date.now(),
        state,
        time: new Date().toLocaleString(),
        by: "Dr Smith",
        note
      },
      ...prev
    ]);
  };

  const handleStart = () => {
    setReportState("In Progress");
    pushLog("In Progress", "Reporting initiated.");
    setMessage("Reporting started.");
  };

  const handlePause = () => {
    setReportState("Paused");
    setMicState("Paused");
    pushLog("Paused", "Reporting paused.");
    setMessage("Reporting paused.");
  };

  const handleResume = () => {
    setReportState("In Progress");
    setMicState("Recording");
    pushLog("In Progress", "Reporting resumed.");
    setMessage("Reporting resumed.");
  };

  const handleReady = () => {
    setReportState("Ready for Authorization");
    pushLog("Ready for Authorization", "Report marked ready for authorization.");
    setMessage("Report ready for authorization.");
  };

  const handleAuthorize = () => {
    setReportState("Authorized");
    setMicState("Ready");
    setNotificationState("Sent");
    pushLog("Authorized", "Report authorized and locked.");
    setMessage("Report authorized. Further changes require addendum.");
  };

  const handleInsertMacro = (content: string) => {
    if (reportState === "Authorized") {
      setMessage("Authorized reports are locked. Use addendum.");
      return;
    }
    setReportText((prev) => `${prev}\n${content}`);
    setMessage("Macro inserted.");
  };

  const handleVoiceToggle = () => {
    if (!voiceEnabled) {
      setVoiceEnabled(true);
      setMicState("Ready");
      return;
    }

    if (micState === "Ready") {
      setMicState("Recording");
      setMessage("Voice recognition started.");
    } else if (micState === "Recording") {
      setMicState("Paused");
      setMessage("Voice recognition paused.");
    } else {
      setMicState("Recording");
      setMessage("Voice recognition resumed.");
    }
  };

  const handlePacsLaunch = () => {
    setMessage("PACS viewer launch triggered with accession number ACC-OP-240424-1185.");
  };

  const handleWorksheetMetadata = () => {
    setMessage("Automated image metadata extracted from PACS / DICOM study.");
  };

  const handleAddendum = () => {
    if (!newAddendum.trim()) {
      setMessage("Enter addendum text first.");
      return;
    }
    if (reportState !== "Authorized") {
      setMessage("Addendum is only available after authorization.");
      return;
    }

    setAddendums((prev) => [
      {
        id: Date.now(),
        author: "Dr Smith",
        time: new Date().toLocaleString(),
        text: newAddendum
      },
      ...prev
    ]);
    setNewAddendum("");
    setMessage("Addendum added with audit trail.");
  };

  const aiHistorySummary = [
    "Prior lumbar and abdominal studies reviewed.",
    "History of right-sided leg pain/cramps noted in referral.",
    "Previous clinical documents mention intermittent worsening over past 2 weeks."
  ];

  const proofreadingFlags = [
    "Check right / left consistency.",
    "Confirm whether comparison section is intentionally blank.",
    "Low-confidence dictated phrase detected near clinical history."
  ];

  const worklistCounts = useMemo(() => {
    return {
      pending: worklistStudies.filter((w) => w.priority === "Pending").length,
      inProgress: worklistStudies.filter((w) => w.priority === "In Progress").length,
      ready: worklistStudies.filter((w) => w.priority === "Ready").length,
      authorized: worklistStudies.filter((w) => w.priority === "Authorized").length
    };
  }, []);

  const stateColor =
    reportState === "Authorized"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/50"
      : reportState === "Ready for Authorization"
      ? "bg-sky-500/15 text-sky-300 border-sky-400/50"
      : reportState === "Paused"
      ? "bg-amber-500/15 text-amber-300 border-amber-400/50"
      : "bg-violet-500/15 text-violet-300 border-violet-400/50";

  const priorityPill = (priority: WorklistStudy["priority"]) => {
    if (priority === "Pending") {
      return "bg-rose-500/15 text-rose-300";
    }
    if (priority === "In Progress") {
      return "bg-amber-500/15 text-amber-300";
    }
    if (priority === "Ready") {
      return "bg-sky-500/15 text-sky-300";
    }
    return "bg-emerald-500/15 text-emerald-300";
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#132b60_0%,#07122a_28%,#020814_60%,#01040c_100%)] text-white">
      <div className="mx-auto max-w-[1700px] p-3">
        <div className={`${panelClass} mb-3 px-4 py-3`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/logo.jpg"
                alt="EsyRIS logo"
                className="h-11 w-11 rounded-xl border border-[#2a4570] bg-[#102349] object-cover"
              />
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-sky-300">
                  RADIOLOGY REPORTING
                </div>
                <div className="truncate text-[16px] font-extrabold">
                  Build reporting workflow UI and state transition interactions
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                Accession: ACC-OP-240424-1185
              </div>
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                PACS: {pacsState}
              </div>
              <div className={`inline-flex h-9 items-center rounded-xl border px-4 text-[12px] font-bold ${stateColor}`}>
                State: {reportState}
              </div>
            </div>
          </div>
        </div>

        {message ? (
          <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] font-semibold text-emerald-300">
            {message}
          </div>
        ) : null}

        <div className="grid gap-3 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          <aside className={`${panelClass} min-h-[860px] p-3`}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-extrabold">Worklist</div>
                <div className="text-[12px] text-white/55">
                  Active studies and reporting queue
                </div>
              </div>
              <button className="text-[12px] font-bold text-sky-300">Reports</button>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              {[
                ["Pending", worklistCounts.pending],
                ["In Progress", worklistCounts.inProgress],
                ["Ready", worklistCounts.ready],
                ["Authorized", worklistCounts.authorized]
              ].map(([label, value]) => (
                <div key={label} className={`${subPanelClass} px-3 py-3 text-center`}>
                  <div className="text-[10px] text-white/55">{label}</div>
                  <div className="mt-1 text-[18px] font-extrabold">{value}</div>
                </div>
              ))}
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Search Worklist</div>
              <input
                className={inputClass}
                placeholder="Search study or patient..."
                value={worklistSearch}
                onChange={(e) => setWorklistSearch(e.target.value)}
              />
            </div>

            <div className="max-h-[560px] space-y-2 overflow-y-auto pr-1">
              {filteredWorklist.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedStudyId(item.id);
                    setMessage(`${item.study} loaded into reporting view.`);
                  }}
                  className={`w-full rounded-2xl border p-3 text-left ${
                    selectedStudyId === item.id
                      ? "border-sky-400/60 bg-sky-500/10"
                      : "border-[#1e406a] bg-[#09162d]/80"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[12px] font-extrabold">
                        {item.patient}
                      </div>
                      <div className="mt-1 text-[10px] text-white/55">{item.ageSex}</div>
                    </div>
                    <div className={`rounded-full px-2 py-1 text-[10px] font-bold ${priorityPill(item.priority)}`}>
                      {item.priority}
                    </div>
                  </div>
                  <div className="mt-2 text-[12px] text-white/80">{item.study}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-white/45">
                    <span>{item.date}</span>
                    <span>{item.modality}</span>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          <main className={`${panelClass} min-h-[860px] p-3`}>
            <div className="grid gap-3 xl:grid-cols-[260px_minmax(0,1fr)]">
              <section className="space-y-3">
                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[13px] font-extrabold">Templates</div>
                    <button className="text-[11px] font-bold text-sky-300">+ Add</button>
                  </div>
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="Search templates..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                  />
                  <div className="max-h-[180px] space-y-1 overflow-y-auto pr-1">
                    {filteredTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template.id);
                          setMessage(`${template.name} template loaded.`);
                        }}
                        className={`w-full rounded-lg px-2 py-2 text-left text-[11px] ${
                          selectedTemplate === template.id
                            ? "bg-sky-500/15 text-sky-200"
                            : "bg-[#102349]/60 text-white/70"
                        }`}
                      >
                        {template.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[13px] font-extrabold">Macros</div>
                    <button className="text-[11px] font-bold text-sky-300">+ Add</button>
                  </div>
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="Search macros..."
                    value={macroSearch}
                    onChange={(e) => setMacroSearch(e.target.value)}
                  />
                  <div className="max-h-[180px] space-y-1 overflow-y-auto pr-1">
                    {filteredMacros.map((macro) => (
                      <button
                        key={macro.id}
                        onClick={() => handleInsertMacro(macro.content)}
                        className="w-full rounded-lg bg-[#102349]/60 px-2 py-2 text-left text-[11px] text-white/75"
                      >
                        {macro.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-[13px] font-extrabold">Reference</div>
                    <button className="text-[11px] font-bold text-sky-300">+ Add</button>
                  </div>
                  <input
                    className={`${inputClass} mb-2`}
                    placeholder="Search references..."
                    value={referenceSearch}
                    onChange={(e) => setReferenceSearch(e.target.value)}
                  />
                  <div className="max-h-[160px] space-y-2 overflow-y-auto pr-1">
                    {filteredReferences.map((ref) => (
                      <div key={ref.id} className="rounded-lg bg-[#102349]/60 px-3 py-2">
                        <div className="text-[11px] font-bold">{ref.title}</div>
                        <div className="mt-1 text-[10px] text-white/60">{ref.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="text-[14px] font-extrabold">
                        {selectedStudy.study}
                      </div>
                      <div className="text-[11px] text-white/55">
                        {selectedStudy.patient} • {selectedStudy.ageSex}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="rounded-lg border border-[#29446d] bg-[#102349] px-3 py-1.5 text-[11px]">
                        Local (Privacy)
                      </div>
                      <button
                        onClick={handleVoiceToggle}
                        className={`${buttonClass} border border-sky-400/50 bg-sky-500/10 text-sky-200`}
                      >
                        {micState === "Recording"
                          ? "Pause Mic"
                          : micState === "Paused"
                          ? "Resume Mic"
                          : "Start Mic"}
                      </button>
                    </div>
                  </div>

                  <div className="mb-3 grid grid-cols-2 gap-2 xl:grid-cols-4">
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      <div className="text-[10px] text-white/50">Template</div>
                      <div className="text-[12px] font-bold">{currentTemplate?.name}</div>
                    </div>
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      <div className="text-[10px] text-white/50">Voice</div>
                      <div className="text-[12px] font-bold">
                        {voiceEnabled ? micState : "Disabled"}
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      <div className="text-[10px] text-white/50">PACS</div>
                      <div className="text-[12px] font-bold">{pacsState}</div>
                    </div>
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      <div className="text-[10px] text-white/50">Notification</div>
                      <div className="text-[12px] font-bold">{notificationState}</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#29446d] bg-[#0d1526] p-4">
                    <div className="mb-2 text-[12px] font-bold text-white/75">
                      Report editor with direction-aware highlighting
                    </div>
                    <textarea
                      value={reportText}
                      onChange={(e) => {
                        if (reportState === "Authorized") {
                          setMessage("Authorized reports are immutable. Use addendum.");
                          return;
                        }
                        setReportText(e.target.value);
                      }}
                      className="min-h-[430px] w-full resize-none rounded-xl border border-[#29446d] bg-[#121212] p-4 text-[14px] leading-7 text-white outline-none"
                    />
                    <div className="mt-3 rounded-xl border border-[#29446d] bg-[#0c1830] p-3">
                      <div className="mb-1 text-[11px] text-white/55">
                        Proofread preview
                      </div>
                      <div className="text-[13px] leading-6">
                        {highlightProofing(reportText)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 xl:grid-cols-3">
                  <div className={`${subPanelClass} p-3`}>
                    <div className="mb-2 text-[13px] font-extrabold">
                      AI Report Proofreading
                    </div>
                    <div className="space-y-2">
                      {[
                        "Check right / left consistency.",
                        "Confirm whether comparison section is intentionally blank.",
                        "Low-confidence dictated phrase detected near clinical history."
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`${subPanelClass} p-3`}>
                    <div className="mb-2 text-[13px] font-extrabold">
                      Authorization
                    </div>
                    <div className="mb-3 rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                      Authorized reports become locked and cannot be edited directly.
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={handlePause}
                        className={`${buttonClass} border border-amber-400/50 bg-amber-500/10 text-amber-200`}
                      >
                        Pause
                      </button>
                      <button
                        onClick={handleResume}
                        className={`${buttonClass} border border-sky-400/50 bg-sky-500/10 text-sky-200`}
                      >
                        Resume
                      </button>
                      <button
                        onClick={handleReady}
                        className={`${buttonClass} border border-sky-400/50 bg-sky-500/10 text-sky-200`}
                      >
                        Ready
                      </button>
                      <button
                        onClick={handleAuthorize}
                        className={`${buttonClass} border border-emerald-400/50 bg-emerald-500/10 text-emerald-200`}
                      >
                        Authorize
                      </button>
                    </div>
                  </div>

                  <div className={`${subPanelClass} p-3`}>
                    <div className="mb-2 text-[13px] font-extrabold">
                      Report Notifications
                    </div>
                    <div className="space-y-2 text-[12px]">
                      <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                        Referrer notification: <strong>{notificationState}</strong>
                      </div>
                      <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                        Patient notification: <strong>{notificationState}</strong>
                      </div>
                      <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                        Workflow state: <strong>{reportState}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </main>

          <aside className={`${panelClass} min-h-[860px] p-3`}>
            <div className="mb-3">
              <div className="text-[15px] font-extrabold">Reporting Side Console</div>
              <div className="text-[12px] text-white/55">
                Documents, AI assist, PACS launch and addendum
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[13px] font-extrabold">Document Viewer</div>
                <button className="text-[11px] font-bold text-sky-300">Viewer</button>
              </div>
              <input
                className={`${inputClass} mb-2`}
                placeholder="Search documents..."
                value={documentSearch}
                onChange={(e) => setDocumentSearch(e.target.value)}
              />
              <div className="max-h-[180px] space-y-2 overflow-y-auto pr-1">
                {filteredDocuments.map((doc) => (
                  <div key={doc.id} className="rounded-xl bg-[#102349]/70 px-3 py-3">
                    <div className="text-[12px] font-bold">{doc.name}</div>
                    <div className="mt-1 text-[11px] text-white/60">{doc.type}</div>
                    <div className="mt-1 text-[10px] text-white/45">{doc.uploadedAt}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">PACS Image Integration</div>
              <div className="space-y-2 text-[12px] text-white/72">
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  RIS does not render medical images inside this interface.
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  PACS viewer launch passes accession number to selected PACS.
                </div>
              </div>
              <button
                onClick={handlePacsLaunch}
                className="mt-3 h-9 w-full rounded-xl bg-violet-600 text-[12px] font-bold"
              >
                Launch PACS Viewer
              </button>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">AI Medical History Summary</div>
              <div className="space-y-2">
                {[
                  "Prior lumbar and abdominal studies reviewed.",
                  "History of right-sided leg pain/cramps noted in referral.",
                  "Previous clinical documents mention intermittent worsening over past 2 weeks."
                ].map((item) => (
                  <div key={item} className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Automated Image Metadata Extraction</div>
              <div className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                DICOM metadata can populate structured reporting fields where configured.
              </div>
              <button
                onClick={handleWorksheetMetadata}
                className="mt-3 h-9 w-full rounded-xl bg-sky-600 text-[12px] font-bold"
              >
                Extract Metadata
              </button>
            </div>

            <div className={`${subPanelClass} p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Authorization & Addendum</div>
              <div className="mb-3 rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                Addendum is available only after report authorization.
              </div>
              <textarea
                value={newAddendum}
                onChange={(e) => setNewAddendum(e.target.value)}
                placeholder="Enter addendum text..."
                className="min-h-[90px] w-full rounded-xl border border-[#29446d] bg-[#0c1830] p-3 text-[12px] text-white outline-none placeholder:text-white/35"
              />
              <button
                onClick={handleAddendum}
                className="mt-3 h-9 w-full rounded-xl bg-emerald-600 text-[12px] font-bold"
              >
                Add Addendum
              </button>

              <div className="mt-3 max-h-[140px] space-y-2 overflow-y-auto pr-1">
                {addendums.length === 0 ? (
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/55">
                    No addendums yet.
                  </div>
                ) : (
                  addendums.map((item) => (
                    <div key={item.id} className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      <div className="text-[11px] font-bold">{item.author}</div>
                      <div className="mt-1 text-[10px] text-white/45">{item.time}</div>
                      <div className="mt-1 text-[11px] text-white/75">{item.text}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
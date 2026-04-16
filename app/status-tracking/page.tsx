"use client";

import React, { useMemo, useState } from "react";

type StudyStatus =
  | "Registered"
  | "Arrived"
  | "Started"
  | "Paused"
  | "Finished";

type TimelineStatus = StudyStatus | "Referral Received";

type WorkflowBucket =
  | "Booked"
  | "Waiting"
  | "Scanning"
  | "Paused"
  | "Reporting"
  | "Completed";

type Clinic = "Orion Park" | "North Branch" | "South Branch";
type Modality = "Ultrasound" | "CT" | "MRI" | "X-Ray";
type IntegrationState = "Pending" | "Synced" | "Failed";

type StatusEvent = {
  id: number;
  status: TimelineStatus;
  time: string;
  date: string;
  by: string;
  note: string;
};

type StudyDocument = {
  id: number;
  name: string;
  type: "Referral" | "Consent" | "Clinical Note" | "Worksheet" | "Manual Worksheet";
  format: "pdf" | "png" | "jpg" | "bmp";
  uploadedAt: string;
};

type WorksheetField = {
  label: string;
  value: string;
};

type StudyRecord = {
  id: number;
  patientName: string;
  dob: string;
  studyName: string;
  clinic: Clinic;
  room: string;
  modality: Modality;
  radiographer: string;
  radiologist: string;
  accessionNumber: string;
  currentStatus: StudyStatus;
  bucket: WorkflowBucket;
  pacsState: IntegrationState;
  worksheetSubmitted: boolean;
  dicomReadState: IntegrationState;
  startedAt?: string;
  finishedAt?: string;
  timeline: StatusEvent[];
  documents: StudyDocument[];
  worksheetFields: WorksheetField[];
};

const studySeed: StudyRecord[] = [
  {
    id: 1,
    patientName: "John Smith",
    dob: "12/08/1975",
    studyName: "Abdominal Ultrasound",
    clinic: "Orion Park",
    room: "Room 2",
    modality: "Ultrasound",
    radiographer: "Nolan Davies",
    radiologist: "Dr Helen Morris",
    accessionNumber: "ACC-OP-240424-1185",
    currentStatus: "Finished",
    bucket: "Completed",
    pacsState: "Synced",
    worksheetSubmitted: true,
    dicomReadState: "Synced",
    startedAt: "11:20 AM",
    finishedAt: "11:45 AM",
    timeline: [
      {
        id: 1,
        status: "Referral Received",
        date: "24 Apr 2024",
        time: "09:00 AM",
        by: "Reception User",
        note: "Referral received from Dr. A Patel."
      },
      {
        id: 2,
        status: "Registered",
        date: "24 Apr 2024",
        time: "09:05 AM",
        by: "Reception User",
        note: "Study registered and linked to patient."
      },
      {
        id: 3,
        status: "Arrived",
        date: "24 Apr 2024",
        time: "09:15 AM",
        by: "Reception User",
        note: "Patient arrived. Accession number generated."
      },
      {
        id: 4,
        status: "Started",
        date: "24 Apr 2024",
        time: "11:20 AM",
        by: "Nolan Davies",
        note: "Scan in progress. Exam started."
      },
      {
        id: 5,
        status: "Finished",
        date: "24 Apr 2024",
        time: "11:45 AM",
        by: "Nolan Davies",
        note: "Scan completed. Images sent to PACS."
      }
    ],
    documents: [
      {
        id: 1,
        name: "Referral.pdf",
        type: "Referral",
        format: "pdf",
        uploadedAt: "24 Apr 2024 09:01 AM"
      },
      {
        id: 2,
        name: "Consent.jpg",
        type: "Consent",
        format: "jpg",
        uploadedAt: "24 Apr 2024 09:14 AM"
      },
      {
        id: 3,
        name: "US Worksheet.rtf",
        type: "Worksheet",
        format: "pdf",
        uploadedAt: "24 Apr 2024 11:48 AM"
      }
    ],
    worksheetFields: [
      { label: "Exam Region", value: "Abdomen" },
      { label: "Clinical History", value: "RUQ pain for 3 weeks" },
      { label: "Contrast", value: "Not applicable" },
      { label: "SR DICOM Prefill", value: "Measurements imported" }
    ]
  },
  {
    id: 2,
    patientName: "Sandra Mayes",
    dob: "02/02/1949",
    studyName: "CT Abdomen",
    clinic: "Orion Park",
    room: "CT Scanner 1",
    modality: "CT",
    radiographer: "Marcus Lee",
    radiologist: "Dr Olivia Kent",
    accessionNumber: "ACC-OP-240424-1191",
    currentStatus: "Paused",
    bucket: "Paused",
    pacsState: "Pending",
    worksheetSubmitted: false,
    dicomReadState: "Pending",
    startedAt: "10:50 AM",
    timeline: [
      {
        id: 1,
        status: "Referral Received",
        date: "24 Apr 2024",
        time: "09:10 AM",
        by: "Reception User",
        note: "Referral received from Dr. A Patel."
      },
      {
        id: 2,
        status: "Registered",
        date: "24 Apr 2024",
        time: "09:20 AM",
        by: "Reception User",
        note: "Study registered and waiting for arrival."
      },
      {
        id: 3,
        status: "Arrived",
        date: "24 Apr 2024",
        time: "10:05 AM",
        by: "Reception User",
        note: "Patient arrived and accession generated."
      },
      {
        id: 4,
        status: "Started",
        date: "24 Apr 2024",
        time: "10:50 AM",
        by: "Marcus Lee",
        note: "Study started on CT machine."
      },
      {
        id: 5,
        status: "Paused",
        date: "24 Apr 2024",
        time: "11:02 AM",
        by: "Marcus Lee",
        note: "Temporary pause due to patient movement and repositioning."
      }
    ],
    documents: [
      {
        id: 1,
        name: "Referral.pdf",
        type: "Referral",
        format: "pdf",
        uploadedAt: "24 Apr 2024 09:21 AM"
      }
    ],
    worksheetFields: [
      { label: "Protocol", value: "CT Abdomen Standard" },
      { label: "Pause Reason", value: "Patient repositioning" },
      { label: "SR DICOM Prefill", value: "Pending" }
    ]
  },
  {
    id: 3,
    patientName: "Robert Lang",
    dob: "09/08/1981",
    studyName: "Chest X-Ray",
    clinic: "North Branch",
    room: "X-Ray Room 1",
    modality: "X-Ray",
    radiographer: "Amy Song",
    radiologist: "Dr Patel",
    accessionNumber: "Not generated",
    currentStatus: "Registered",
    bucket: "Booked",
    pacsState: "Pending",
    worksheetSubmitted: false,
    dicomReadState: "Pending",
    timeline: [
      {
        id: 1,
        status: "Referral Received",
        date: "24 Apr 2024",
        time: "08:45 AM",
        by: "Booking User",
        note: "Referral received from external provider."
      },
      {
        id: 2,
        status: "Registered",
        date: "24 Apr 2024",
        time: "08:55 AM",
        by: "Booking User",
        note: "Study registered and awaiting arrival."
      }
    ],
    documents: [],
    worksheetFields: [
      { label: "Exam Region", value: "Chest" },
      { label: "Worksheet", value: "Not required for modality" }
    ]
  },
  {
    id: 4,
    patientName: "Amy Song",
    dob: "17/01/1992",
    studyName: "MRI Brain",
    clinic: "South Branch",
    room: "MRI Room 1",
    modality: "MRI",
    radiographer: "Lara White",
    radiologist: "Dr Nolan Hart",
    accessionNumber: "ACC-SB-240424-1201",
    currentStatus: "Started",
    bucket: "Scanning",
    pacsState: "Pending",
    worksheetSubmitted: false,
    dicomReadState: "Synced",
    startedAt: "01:15 PM",
    timeline: [
      {
        id: 1,
        status: "Referral Received",
        date: "24 Apr 2024",
        time: "11:30 AM",
        by: "Booking User",
        note: "Referral received and verified."
      },
      {
        id: 2,
        status: "Registered",
        date: "24 Apr 2024",
        time: "11:40 AM",
        by: "Booking User",
        note: "Study registered."
      },
      {
        id: 3,
        status: "Arrived",
        date: "24 Apr 2024",
        time: "12:50 PM",
        by: "Front Desk",
        note: "Patient arrived and checked in."
      },
      {
        id: 4,
        status: "Started",
        date: "24 Apr 2024",
        time: "01:15 PM",
        by: "Lara White",
        note: "MRI study started and scanner connected."
      }
    ],
    documents: [
      {
        id: 1,
        name: "Consent.pdf",
        type: "Consent",
        format: "pdf",
        uploadedAt: "24 Apr 2024 12:52 PM"
      }
    ],
    worksheetFields: [
      { label: "MRI Safety", value: "Cleared" },
      { label: "SR DICOM Prefill", value: "Header imported" }
    ]
  }
];

const statusOrder: StudyStatus[] = [
  "Registered",
  "Arrived",
  "Started",
  "Paused",
  "Finished"
];

const statusMeta: Record<
  TimelineStatus,
  {
    glow: string;
    border: string;
    bg: string;
    iconBg: string;
    label: string;
    bucket?: WorkflowBucket;
  }
> = {
  "Referral Received": {
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.35)]",
    border: "border-violet-400/60",
    bg: "bg-violet-500/10",
    iconBg: "bg-violet-500/20",
    label: "Referral Received"
  },
  Registered: {
    glow: "shadow-[0_0_24px_rgba(138,92,246,0.35)]",
    border: "border-violet-400/60",
    bg: "bg-violet-500/10",
    iconBg: "bg-violet-500/20",
    label: "Registered",
    bucket: "Booked"
  },
  Arrived: {
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.35)]",
    border: "border-sky-400/60",
    bg: "bg-sky-500/10",
    iconBg: "bg-sky-500/20",
    label: "Arrived",
    bucket: "Waiting"
  },
  Started: {
    glow: "shadow-[0_0_24px_rgba(249,115,22,0.35)]",
    border: "border-orange-400/60",
    bg: "bg-orange-500/10",
    iconBg: "bg-orange-500/20",
    label: "Started",
    bucket: "Scanning"
  },
  Paused: {
    glow: "shadow-[0_0_24px_rgba(234,179,8,0.35)]",
    border: "border-yellow-400/60",
    bg: "bg-yellow-500/10",
    iconBg: "bg-yellow-500/20",
    label: "Paused",
    bucket: "Paused"
  },
  Finished: {
    glow: "shadow-[0_0_24px_rgba(34,197,94,0.35)]",
    border: "border-emerald-400/60",
    bg: "bg-emerald-500/10",
    iconBg: "bg-emerald-500/20",
    label: "Finished",
    bucket: "Completed"
  }
};

const inputClass =
  "h-9 w-full rounded-xl border border-[#29446d] bg-[#0c1830] px-3 text-[12px] text-white outline-none placeholder:text-white/35";
const selectClass =
  "h-9 w-full rounded-xl border border-[#29446d] bg-[#0c1830] px-3 text-[12px] text-white outline-none";
const panelClass =
  "rounded-[22px] border border-[#17355c] bg-[#041126]/95 backdrop-blur-sm";
const subPanelClass =
  "rounded-[18px] border border-[#1e406a] bg-[#09162d]/90";

function nowStamp() {
  return {
    date: "24 Apr 2024",
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

function buildAccession(clinic: Clinic) {
  const prefix =
    clinic === "Orion Park"
      ? "OP"
      : clinic === "North Branch"
      ? "NB"
      : "SB";
  return `ACC-${prefix}-${Date.now().toString().slice(-8)}`;
}

export default function StudyStatusProgressionPage() {
  const [studies, setStudies] = useState<StudyRecord[]>(studySeed);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [bucketFilter, setBucketFilter] = useState<WorkflowBucket | "All">("All");
  const [message, setMessage] = useState("");
  const [docName, setDocName] = useState("");
  const [docType, setDocType] = useState<StudyDocument["type"]>("Clinical Note");
  const [docFormat, setDocFormat] = useState<StudyDocument["format"]>("pdf");

  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      const matchText = `${study.patientName} ${study.studyName} ${study.clinic} ${study.modality} ${study.accessionNumber}`.toLowerCase();
      const textOk = matchText.includes(search.toLowerCase());
      const bucketOk = bucketFilter === "All" || study.bucket === bucketFilter;
      return textOk && bucketOk;
    });
  }, [studies, search, bucketFilter]);

  const selectedStudy =
    studies.find((study) => study.id === selectedId) ?? studies[0];

  const dashboardCounts = useMemo(() => {
    return {
      booked: studies.filter((s) => s.bucket === "Booked").length,
      waiting: studies.filter((s) => s.bucket === "Waiting").length,
      scanning: studies.filter((s) => s.bucket === "Scanning").length,
      paused: studies.filter((s) => s.bucket === "Paused").length,
      reporting: studies.filter((s) => s.bucket === "Reporting").length,
      completed: studies.filter((s) => s.bucket === "Completed").length
    };
  }, [studies]);

  const utilizationInsights = useMemo(() => {
    const paused = studies.filter((s) => s.bucket === "Paused").length;
    const waiting = studies.filter((s) => s.bucket === "Waiting").length;
    const scanning = studies.filter((s) => s.bucket === "Scanning").length;

    return [
      paused > 0
        ? `${paused} study/studies currently paused — review interruption reasons.`
        : "No paused studies right now.",
      waiting > 2
        ? `${waiting} studies waiting for scan — possible front desk or room bottleneck.`
        : "Waiting queue is within normal range.",
      scanning === 0
        ? "No active scanning detected — possible equipment idle time."
        : `${scanning} study/studies actively scanning.`
    ];
  }, [studies]);

  const pushStatus = (nextStatus: StudyStatus) => {
    if (!selectedStudy) return;

    const currentIndex = statusOrder.indexOf(selectedStudy.currentStatus);
    const nextIndex = statusOrder.indexOf(nextStatus);

    if (
      nextStatus !== "Paused" &&
      selectedStudy.currentStatus !== "Paused" &&
      nextIndex < currentIndex
    ) {
      setMessage("Backward workflow transition is not allowed.");
      return;
    }

    const stamp = nowStamp();
    const accession =
      nextStatus === "Arrived" && selectedStudy.accessionNumber === "Not generated"
        ? buildAccession(selectedStudy.clinic)
        : selectedStudy.accessionNumber;

    const nextBucket =
      statusMeta[nextStatus].bucket === "Completed"
        ? "Completed"
        : nextStatus === "Arrived"
        ? "Waiting"
        : nextStatus === "Started"
        ? "Scanning"
        : nextStatus === "Paused"
        ? "Paused"
        : nextStatus === "Registered"
        ? "Booked"
        : "Completed";

    setStudies((prev) =>
      prev.map((study) =>
        study.id === selectedStudy.id
          ? {
              ...study,
              accessionNumber: accession,
              currentStatus: nextStatus,
              bucket: nextBucket,
              pacsState: nextStatus === "Finished" ? "Synced" : study.pacsState,
              startedAt:
                nextStatus === "Started" && !study.startedAt
                  ? stamp.time
                  : study.startedAt,
              finishedAt: nextStatus === "Finished" ? stamp.time : study.finishedAt,
              timeline: [
                ...study.timeline,
                {
                  id: Date.now(),
                  status: nextStatus,
                  date: stamp.date,
                  time: stamp.time,
                  by: study.radiographer,
                  note:
                    nextStatus === "Arrived"
                      ? "Patient arrived. Accession number generated."
                      : nextStatus === "Started"
                      ? "Scan in progress. Exam started."
                      : nextStatus === "Paused"
                      ? "Study paused and workflow history preserved."
                      : nextStatus === "Finished"
                      ? "Scan completed. Images sent to PACS."
                      : "Study state updated."
                }
              ]
            }
          : study
      )
    );

    setMessage(`Status changed to ${nextStatus}.`);
  };

  const resumeStudy = () => {
    if (selectedStudy.currentStatus !== "Paused") {
      setMessage("Only paused studies can be resumed.");
      return;
    }
    pushStatus("Started");
  };

  const attachDocument = () => {
    if (!docName.trim()) {
      setMessage("Enter a document name first.");
      return;
    }

    setStudies((prev) =>
      prev.map((study) =>
        study.id === selectedStudy.id
          ? {
              ...study,
              documents: [
                ...study.documents,
                {
                  id: Date.now(),
                  name: docName,
                  type: docType,
                  format: docFormat,
                  uploadedAt: "24 Apr 2024 02:08 PM"
                }
              ]
            }
          : study
      )
    );

    setDocName("");
    setMessage("Document attached to study.");
  };

  const submitWorksheet = () => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id === selectedStudy.id
          ? {
              ...study,
              worksheetSubmitted: true,
              bucket:
                study.currentStatus === "Finished" ? "Reporting" : study.bucket,
              documents: [
                ...study.documents,
                {
                  id: Date.now(),
                  name: `${study.modality} Worksheet`,
                  type: "Worksheet",
                  format: "pdf",
                  uploadedAt: "24 Apr 2024 02:15 PM"
                }
              ]
            }
          : study
      )
    );
    setMessage("Digital worksheet submitted.");
  };

  const syncPacs = () => {
    setStudies((prev) =>
      prev.map((study) =>
        study.id === selectedStudy.id
          ? {
              ...study,
              pacsState: "Synced",
              dicomReadState: "Synced"
            }
          : study
      )
    );
    setMessage("PACS synchronization completed.");
  };

  const statusCard = statusMeta[selectedStudy.currentStatus];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#132b60_0%,#07122a_28%,#020814_60%,#01040c_100%)] text-white">
      <div className="mx-auto max-w-[1600px] p-3">
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
                  STUDY WORKFLOW
                </div>
                <div className="truncate text-[16px] font-extrabold">
                  Build status progression UI and tracking visibility screens
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                Clinic: {selectedStudy.clinic}
              </div>
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                Accession: {selectedStudy.accessionNumber}
              </div>
              <div
                className={`inline-flex h-9 items-center rounded-xl px-4 text-[12px] font-bold ${statusCard.bg} ${statusCard.border}`}
              >
                Status: {selectedStudy.currentStatus}
              </div>
            </div>
          </div>
        </div>

        {message ? (
          <div className="mb-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-[12px] font-semibold text-emerald-300">
            {message}
          </div>
        ) : null}

        <div className="grid gap-3 xl:grid-cols-[320px_minmax(0,1fr)_360px]">
          <aside className={`${panelClass} min-h-[840px] p-3`}>
            <div className="mb-3">
              <div className="text-[15px] font-extrabold">Study Tracking Dashboard</div>
              <div className="text-[12px] text-white/55">
                Real-time study visibility across workflow states
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              {[
                ["Booked", dashboardCounts.booked],
                ["Waiting", dashboardCounts.waiting],
                ["Scanning", dashboardCounts.scanning],
                ["Paused", dashboardCounts.paused],
                ["Reporting", dashboardCounts.reporting],
                ["Completed", dashboardCounts.completed]
              ].map(([label, value]) => (
                <div
                  key={label}
                  className={`${subPanelClass} px-3 py-3 text-center`}
                >
                  <div className="text-[11px] text-white/55">{label}</div>
                  <div className="mt-1 text-[18px] font-extrabold">{value}</div>
                </div>
              ))}
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Search Studies</div>
              <input
                className={inputClass}
                placeholder="Patient, study, accession..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-2">
                <select
                  className={selectClass}
                  value={bucketFilter}
                  onChange={(e) =>
                    setBucketFilter(e.target.value as WorkflowBucket | "All")
                  }
                >
                  <option value="All">All buckets</option>
                  <option value="Booked">Booked</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Scanning">Scanning</option>
                  <option value="Paused">Paused</option>
                  <option value="Reporting">Reporting</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
              {filteredStudies.map((study) => (
                <button
                  key={study.id}
                  type="button"
                  onClick={() => setSelectedId(study.id)}
                  className={`w-full rounded-2xl border p-3 text-left ${
                    selectedId === study.id
                      ? "border-sky-400/60 bg-sky-500/10"
                      : "border-[#1e406a] bg-[#09162d]/80"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[13px] font-extrabold">
                      {study.patientName}
                    </div>
                    <div className="text-[10px] text-white/55">{study.modality}</div>
                  </div>
                  <div className="mt-1 text-[11px] text-white/65">
                    {study.studyName}
                  </div>
                  <div className="mt-1 text-[11px] text-white/50">
                    {study.clinic} • {study.room}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-[#102349] px-2 py-1 text-[10px] text-sky-200">
                      {study.bucket}
                    </span>
                    <span className="text-[10px] text-white/45">
                      {study.currentStatus}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className={`${subPanelClass} mt-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">
                Workflow Optimization Insights
              </div>
              <div className="space-y-2">
                {utilizationInsights.map((item) => (
                  <div
                    key={item}
                    className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <main className={`${panelClass} min-h-[840px] overflow-hidden`}>
            <div className="border-b border-[#17355c] px-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 flex-wrap items-center gap-3">
                  <div className="rounded-xl border border-[#2a4570] bg-[#102349] px-4 py-3 text-[14px] font-semibold">
                    <span className="text-white/70">Patient:</span>{" "}
                    {selectedStudy.patientName} | DOB: {selectedStudy.dob}
                  </div>
                  <div className="rounded-xl border border-[#2a4570] bg-[#102349] px-4 py-3 text-[14px] font-semibold">
                    <span className="text-white/70">Study:</span>{" "}
                    {selectedStudy.studyName} | {selectedStudy.clinic} -{" "}
                    {selectedStudy.room}
                  </div>
                </div>

                <div className="text-[12px] text-white/60">
                  Radiographer: {selectedStudy.radiographer}
                </div>
              </div>
            </div>

            <div className="grid gap-3 p-4 xl:grid-cols-[minmax(0,1fr)_300px]">
              <section className="min-h-[720px] rounded-[20px] border border-[#17355c] bg-[radial-gradient(circle_at_top,#16336d_0%,#0a1631_40%,#071124_100%)] p-5">
                <div className="mb-6 text-center">
                  <div className="text-[15px] font-bold uppercase tracking-[0.22em] text-sky-300/80">
                    Study Lifecycle
                  </div>
                  <div className="mt-2 text-[40px] font-extrabold leading-none text-sky-200">
                    Status Change Timeline
                  </div>
                </div>

                <div className="relative mx-auto max-w-[760px] pb-6 pl-16 pr-4 pt-2">
                  <div className="absolute left-[30px] top-0 h-full w-[3px] rounded-full bg-gradient-to-b from-sky-300 via-sky-500/80 to-sky-800" />

                  <div className="space-y-5">
                    {[...selectedStudy.timeline].reverse().map((event) => {
                      const meta = statusMeta[event.status];
                      return (
                        <div key={event.id} className="relative">
                          <div
                            className={`absolute left-[-2px] top-5 flex h-8 w-8 items-center justify-center rounded-full border-2 ${meta.border} ${meta.iconBg} ${meta.glow}`}
                          >
                            <div className="h-3 w-3 rounded-full bg-white" />
                          </div>

                          <div
                            className={`ml-10 rounded-2xl border px-4 py-4 ${meta.border} ${meta.bg} ${meta.glow}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full ${meta.iconBg} text-[16px]`}
                                >
                                  {event.status === "Finished"
                                    ? "✓"
                                    : event.status === "Started"
                                    ? "▶"
                                    : event.status === "Paused"
                                    ? "⏸"
                                    : event.status === "Arrived"
                                    ? "▣"
                                    : event.status === "Referral Received"
                                    ? "✉"
                                    : "✦"}
                                </div>
                                <div className="text-[18px] font-extrabold">
                                  {event.status}
                                </div>
                              </div>
                              <div className="text-[18px] font-extrabold">
                                {event.time}
                              </div>
                            </div>

                            <div className="mt-3 text-[14px] text-white/88">
                              {event.note}
                            </div>

                            <div className="mt-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-[12px] text-white/60">
                              {event.date} | {event.time} by {event.by}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              <aside className="space-y-3">
                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 text-[13px] font-extrabold">
                    Status Actions
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => pushStatus("Registered")}
                      className="h-9 rounded-xl border border-violet-400/50 bg-violet-500/10 text-[12px] font-bold text-violet-200"
                    >
                      Registered
                    </button>
                    <button
                      onClick={() => pushStatus("Arrived")}
                      className="h-9 rounded-xl border border-sky-400/50 bg-sky-500/10 text-[12px] font-bold text-sky-200"
                    >
                      Arrived
                    </button>
                    <button
                      onClick={() => pushStatus("Started")}
                      className="h-9 rounded-xl border border-orange-400/50 bg-orange-500/10 text-[12px] font-bold text-orange-200"
                    >
                      Started
                    </button>
                    <button
                      onClick={() => pushStatus("Paused")}
                      className="h-9 rounded-xl border border-yellow-400/50 bg-yellow-500/10 text-[12px] font-bold text-yellow-200"
                    >
                      Pause
                    </button>
                    <button
                      onClick={resumeStudy}
                      className="h-9 rounded-xl border border-sky-400/50 bg-sky-500/10 text-[12px] font-bold text-sky-200"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => pushStatus("Finished")}
                      className="h-9 rounded-xl border border-emerald-400/50 bg-emerald-500/10 text-[12px] font-bold text-emerald-200"
                    >
                      Finish
                    </button>
                  </div>
                </div>

                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 text-[13px] font-extrabold">
                    Study Summary
                  </div>
                  <div className="space-y-2 text-[12px]">
                    {[
                      ["Accession", selectedStudy.accessionNumber],
                      ["Current Status", selectedStudy.currentStatus],
                      ["Bucket", selectedStudy.bucket],
                      ["PACS", selectedStudy.pacsState],
                      ["DICOM Read", selectedStudy.dicomReadState],
                      [
                        "Worksheet",
                        selectedStudy.worksheetSubmitted ? "Submitted" : "Pending"
                      ]
                    ].map(([k, v]) => (
                      <div
                        key={k}
                        className="flex items-center justify-between border-b border-white/10 pb-2"
                      >
                        <span className="text-white/60">{k}</span>
                        <strong>{v}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 text-[13px] font-extrabold">
                    Document Attachment
                  </div>
                  <div className="space-y-2">
                    <input
                      className={inputClass}
                      placeholder="Document name"
                      value={docName}
                      onChange={(e) => setDocName(e.target.value)}
                    />
                    <select
                      className={selectClass}
                      value={docType}
                      onChange={(e) =>
                        setDocType(e.target.value as StudyDocument["type"])
                      }
                    >
                      <option>Clinical Note</option>
                      <option>Referral</option>
                      <option>Consent</option>
                      <option>Worksheet</option>
                      <option>Manual Worksheet</option>
                    </select>
                    <select
                      className={selectClass}
                      value={docFormat}
                      onChange={(e) =>
                        setDocFormat(e.target.value as StudyDocument["format"])
                      }
                    >
                      <option>pdf</option>
                      <option>png</option>
                      <option>jpg</option>
                      <option>bmp</option>
                    </select>
                    <button
                      onClick={attachDocument}
                      className="h-9 w-full rounded-xl bg-sky-600 text-[12px] font-bold"
                    >
                      Attach Document
                    </button>
                  </div>
                </div>

                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 text-[13px] font-extrabold">
                    Digital Worksheet
                  </div>
                  <div className="mb-3 space-y-2">
                    {selectedStudy.worksheetFields.map((field) => (
                      <div
                        key={field.label}
                        className="rounded-xl bg-[#102349]/70 px-3 py-2"
                      >
                        <div className="text-[10px] text-white/50">
                          {field.label}
                        </div>
                        <div className="text-[12px] font-semibold">
                          {field.value}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={submitWorksheet}
                    className="h-9 w-full rounded-xl bg-emerald-600 text-[12px] font-bold"
                  >
                    Submit Worksheet
                  </button>
                </div>

                <div className={`${subPanelClass} p-3`}>
                  <div className="mb-2 text-[13px] font-extrabold">
                    PACS / DICOM
                  </div>
                  <div className="space-y-2 text-[12px] text-white/72">
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      RIS maintains study linkage via accession number.
                    </div>
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                      SR DICOM parser prefill visible in worksheet section.
                    </div>
                  </div>
                  <button
                    onClick={syncPacs}
                    className="mt-3 h-9 w-full rounded-xl bg-violet-600 text-[12px] font-bold"
                  >
                    Sync PACS
                  </button>
                </div>
              </aside>
            </div>
          </main>

          <aside className={`${panelClass} min-h-[840px] p-3`}>
            <div className="mb-3">
              <div className="text-[15px] font-extrabold">Tracking Visibility</div>
              <div className="text-[12px] text-white/55">
                Study, documents and reporting readiness
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">
                Patient / Study Header
              </div>
              <div className="space-y-2 text-[12px]">
                {[
                  ["Patient", selectedStudy.patientName],
                  ["DOB", selectedStudy.dob],
                  ["Study", selectedStudy.studyName],
                  ["Clinic", selectedStudy.clinic],
                  ["Room", selectedStudy.room],
                  ["Radiographer", selectedStudy.radiographer],
                  ["Radiologist", selectedStudy.radiologist]
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between border-b border-white/10 pb-2"
                  >
                    <span className="text-white/60">{k}</span>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">
                Uploaded Documents
              </div>
              <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {selectedStudy.documents.length === 0 ? (
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-3 text-[12px] text-white/55">
                    No documents attached.
                  </div>
                ) : (
                  selectedStudy.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-xl border border-[#29446d] bg-[#102349]/70 px-3 py-3"
                    >
                      <div className="text-[12px] font-bold">{doc.name}</div>
                      <div className="mt-1 text-[11px] text-white/60">
                        {doc.type} • {doc.format.toUpperCase()}
                      </div>
                      <div className="mt-1 text-[10px] text-white/45">
                        {doc.uploadedAt}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">
                Lifecycle Visibility
              </div>
              <div className="space-y-2">
                {statusOrder.map((status) => {
                  const reached = selectedStudy.timeline.some(
                    (item) => item.status === status
                  );
                  return (
                    <div
                      key={status}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-[12px] ${
                        reached
                          ? "bg-emerald-500/10 text-emerald-200"
                          : "bg-[#102349]/70 text-white/45"
                      }`}
                    >
                      <span>{status}</span>
                      <span>{reached ? "Reached" : "Pending"}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${subPanelClass} p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">
                Reporting Readiness
              </div>
              <div className="space-y-2 text-[12px]">
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  Images in PACS:{" "}
                  <strong>{selectedStudy.pacsState === "Synced" ? "Yes" : "No"}</strong>
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  Worksheet submitted:{" "}
                  <strong>{selectedStudy.worksheetSubmitted ? "Yes" : "No"}</strong>
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  DICOM parsing: <strong>{selectedStudy.dicomReadState}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
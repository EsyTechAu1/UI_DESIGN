"use client";

import React, { useMemo, useState } from "react";

type Clinic = "Main Clinic" | "North Branch" | "South Branch";
type RoomStatus = "Active" | "Inactive" | "Maintenance";
type EquipmentStatus = "Online" | "Offline" | "Maintenance";
type Modality = "CT" | "Ultrasound" | "MRI" | "X-Ray" | "General";
type Capability =
  | "Contrast"
  | "Doppler"
  | "3D Imaging"
  | "Trauma"
  | "Interventional"
  | "Portable"
  | "Cardiac"
  | "MSK";

type RoomRecord = {
  id: number;
  roomName: string;
  clinic: Clinic;
  roomCode: string;
  roomType: string;
  status: RoomStatus;
  modalities: Modality[];
  linkedMachineIds: number[];
  schedulingEnabled: boolean;
  notes: string;
};

type EquipmentRecord = {
  id: number;
  machineName: string;
  clinic: Clinic;
  linkedRoomId: number | null;
  equipmentCode: string;
  model: string;
  modality: Modality;
  status: EquipmentStatus;
  capabilities: Capability[];
  competencyRequired: string;
  schedulingEnabled: boolean;
  pacsLinked: boolean;
  dicomEnabled: boolean;
  notes: string;
};

const panelClass =
  "rounded-[22px] border border-[#17355c] bg-[#041126]/95 backdrop-blur-sm";
const subPanelClass =
  "rounded-[18px] border border-[#1e406a] bg-[#09162d]/90";
const inputClass =
  "h-9 w-full rounded-xl border border-[#29446d] bg-[#0c1830] px-3 text-[12px] text-white outline-none placeholder:text-white/35";
const selectClass =
  "h-9 w-full rounded-xl border border-[#29446d] bg-[#0c1830] px-3 text-[12px] text-white outline-none";
const labelClass = "mb-1 block text-[11px] font-semibold text-white/75";
const smallBtn = "h-9 rounded-xl px-4 text-[12px] font-bold transition";

const clinicOptions: Clinic[] = ["Main Clinic", "North Branch", "South Branch"];
const modalityOptions: Modality[] = [
  "CT",
  "Ultrasound",
  "MRI",
  "X-Ray",
  "General"
];
const capabilityOptions: Capability[] = [
  "Contrast",
  "Doppler",
  "3D Imaging",
  "Trauma",
  "Interventional",
  "Portable",
  "Cardiac",
  "MSK"
];

const initialRooms: RoomRecord[] = [
  {
    id: 1,
    roomName: "CT Room 1",
    clinic: "Main Clinic",
    roomCode: "RM-CT-01",
    roomType: "Imaging Suite",
    status: "Active",
    modalities: ["CT"],
    linkedMachineIds: [1],
    schedulingEnabled: true,
    notes: "Primary CT room for scheduled scans."
  },
  {
    id: 2,
    roomName: "Ultrasound Bay A",
    clinic: "Main Clinic",
    roomCode: "RM-US-01",
    roomType: "Ultrasound Room",
    status: "Active",
    modalities: ["Ultrasound"],
    linkedMachineIds: [2],
    schedulingEnabled: true,
    notes: "Used for abdomen and pelvic studies."
  },
  {
    id: 3,
    roomName: "General X-Ray",
    clinic: "North Branch",
    roomCode: "RM-XR-01",
    roomType: "Radiography Room",
    status: "Maintenance",
    modalities: ["X-Ray"],
    linkedMachineIds: [3],
    schedulingEnabled: false,
    notes: "Temporarily unavailable due to calibration."
  }
];

const initialEquipment: EquipmentRecord[] = [
  {
    id: 1,
    machineName: "GE CT 128",
    clinic: "Main Clinic",
    linkedRoomId: 1,
    equipmentCode: "EQ-CT-128",
    model: "GE Revolution 128",
    modality: "CT",
    status: "Online",
    capabilities: ["Contrast", "3D Imaging", "Trauma"],
    competencyRequired: "CT Advanced",
    schedulingEnabled: true,
    pacsLinked: true,
    dicomEnabled: true,
    notes: "Primary CT scanner connected to PACS."
  },
  {
    id: 2,
    machineName: "Philips EPIQ 7",
    clinic: "Main Clinic",
    linkedRoomId: 2,
    equipmentCode: "EQ-US-007",
    model: "Philips EPIQ 7",
    modality: "Ultrasound",
    status: "Online",
    capabilities: ["Doppler", "Cardiac", "MSK"],
    competencyRequired: "Ultrasound Senior",
    schedulingEnabled: true,
    pacsLinked: true,
    dicomEnabled: true,
    notes: "Supports vascular and abdominal exams."
  },
  {
    id: 3,
    machineName: "Shimadzu X-Ray",
    clinic: "North Branch",
    linkedRoomId: 3,
    equipmentCode: "EQ-XR-002",
    model: "Shimadzu RADspeed",
    modality: "X-Ray",
    status: "Maintenance",
    capabilities: ["Portable", "Trauma"],
    competencyRequired: "Radiography",
    schedulingEnabled: false,
    pacsLinked: true,
    dicomEnabled: true,
    notes: "Awaiting service vendor visit."
  }
];

export default function RoomEquipmentConfigurationPage() {
  const [rooms, setRooms] = useState<RoomRecord[]>(initialRooms);
  const [equipment, setEquipment] = useState<EquipmentRecord[]>(initialEquipment);
  const [search, setSearch] = useState("");
  const [selectedClinic, setSelectedClinic] = useState<Clinic>("Main Clinic");
  const [selectedRoomId, setSelectedRoomId] = useState<number>(1);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number>(1);
  const [message, setMessage] = useState("");

  const selectedRoom =
    rooms.find((room) => room.id === selectedRoomId) ?? rooms[0];
  const selectedMachine =
    equipment.find((item) => item.id === selectedEquipmentId) ?? equipment[0];

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesClinic = room.clinic === selectedClinic;
      const text = `${room.roomName} ${room.roomCode} ${room.roomType} ${room.clinic}`.toLowerCase();
      return matchesClinic && text.includes(search.toLowerCase());
    });
  }, [rooms, search, selectedClinic]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesClinic = item.clinic === selectedClinic;
      const text =
        `${item.machineName} ${item.equipmentCode} ${item.model} ${item.modality}`.toLowerCase();
      return matchesClinic && text.includes(search.toLowerCase());
    });
  }, [equipment, search, selectedClinic]);

  const roomLinkedMachines = useMemo(() => {
    return equipment.filter((item) => item.linkedRoomId === selectedRoom.id);
  }, [equipment, selectedRoom.id]);

  const roomStats = {
    total: rooms.length,
    active: rooms.filter((r) => r.status === "Active").length,
    onlineMachines: equipment.filter((e) => e.status === "Online").length,
    schedulable: equipment.filter((e) => e.schedulingEnabled).length
  };

  const updateRoomField = <K extends keyof RoomRecord>(
    field: K,
    value: RoomRecord[K]
  ) => {
    setRooms((prev) =>
      prev.map((room) =>
        room.id === selectedRoom.id ? { ...room, [field]: value } : room
      )
    );
  };

  const updateEquipmentField = <K extends keyof EquipmentRecord>(
    field: K,
    value: EquipmentRecord[K]
  ) => {
    setEquipment((prev) =>
      prev.map((item) =>
        item.id === selectedMachine.id ? { ...item, [field]: value } : item
      )
    );
  };

  const toggleRoomModality = (modality: Modality) => {
    const exists = selectedRoom.modalities.includes(modality);
    updateRoomField(
      "modalities",
      exists
        ? selectedRoom.modalities.filter((m) => m !== modality)
        : [...selectedRoom.modalities, modality]
    );
  };

  const toggleEquipmentCapability = (capability: Capability) => {
    const exists = selectedMachine.capabilities.includes(capability);
    updateEquipmentField(
      "capabilities",
      exists
        ? selectedMachine.capabilities.filter((c) => c !== capability)
        : [...selectedMachine.capabilities, capability]
    );
  };

  const saveRoomConfig = () => {
    setMessage("Room configuration saved successfully.");
  };

  const saveEquipmentConfig = () => {
    setMessage("Equipment configuration saved successfully.");
  };

  const createRoom = () => {
    const newId = Date.now();
    const newRoom: RoomRecord = {
      id: newId,
      roomName: "New Room",
      clinic: selectedClinic,
      roomCode: `RM-${newId.toString().slice(-4)}`,
      roomType: "Imaging Room",
      status: "Active",
      modalities: ["General"],
      linkedMachineIds: [],
      schedulingEnabled: true,
      notes: ""
    };
    setRooms((prev) => [newRoom, ...prev]);
    setSelectedRoomId(newId);
    setMessage("New room created.");
  };

  const createMachine = () => {
    const newId = Date.now();
    const newMachine: EquipmentRecord = {
      id: newId,
      machineName: "New Machine",
      clinic: selectedClinic,
      linkedRoomId: selectedRoom.id,
      equipmentCode: `EQ-${newId.toString().slice(-4)}`,
      model: "Model",
      modality: "General",
      status: "Offline",
      capabilities: [],
      competencyRequired: "",
      schedulingEnabled: false,
      pacsLinked: false,
      dicomEnabled: false,
      notes: ""
    };
    setEquipment((prev) => [newMachine, ...prev]);
    setSelectedEquipmentId(newId);
    setMessage("New equipment item created.");
  };

  const statusPill = (value: string) => {
    if (value === "Active" || value === "Online") {
      return "bg-emerald-500/15 text-emerald-300";
    }
    if (value === "Maintenance") {
      return "bg-amber-500/15 text-amber-300";
    }
    return "bg-rose-500/15 text-rose-300";
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
                  ADMINISTRATION & SYSTEM CONFIGURATION
                </div>
                <div className="truncate text-[16px] font-extrabold">
                  Develop room and equipment configuration screens
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                Rooms: {roomStats.total}
              </div>
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                Active: {roomStats.active}
              </div>
              <div className="inline-flex h-9 items-center rounded-xl border border-[#2a4570] bg-[#102349] px-4 text-[12px] font-semibold text-sky-200">
                Schedulable: {roomStats.schedulable}
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
          <aside className={`${panelClass} min-h-[860px] p-3`}>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-[15px] font-extrabold">Resource Directory</div>
                <div className="text-[12px] text-white/55">
                  Rooms, machines and clinic mapping
                </div>
              </div>
              <div className="rounded-full bg-emerald-500/15 px-3 py-1 text-[11px] font-bold text-emerald-300">
                {selectedClinic}
              </div>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                onClick={createRoom}
                className={`${smallBtn} border border-sky-400/40 bg-sky-500/10 text-sky-200`}
              >
                + New Room
              </button>
              <button
                onClick={createMachine}
                className={`${smallBtn} border border-violet-400/40 bg-violet-500/10 text-violet-200`}
              >
                + New Machine
              </button>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <input
                className={inputClass}
                placeholder="Search room, machine, code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-2">
                <select
                  className={selectClass}
                  value={selectedClinic}
                  onChange={(e) => setSelectedClinic(e.target.value as Clinic)}
                >
                  {clinicOptions.map((clinic) => (
                    <option key={clinic}>{clinic}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-2 text-[13px] font-extrabold">Rooms</div>
              <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
                {filteredRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoomId(room.id)}
                    className={`w-full rounded-2xl border p-3 text-left ${
                      room.id === selectedRoomId
                        ? "border-sky-400/60 bg-sky-500/10"
                        : "border-[#1e406a] bg-[#09162d]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[12px] font-extrabold">
                        {room.roomName}
                      </div>
                      <div className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusPill(room.status)}`}>
                        {room.status}
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-white/55">
                      {room.roomCode} • {room.roomType}
                    </div>
                    <div className="mt-1 text-[10px] text-white/45">
                      {room.modalities.join(", ")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 text-[13px] font-extrabold">Equipment</div>
              <div className="max-h-[250px] space-y-2 overflow-y-auto pr-1">
                {filteredEquipment.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedEquipmentId(item.id)}
                    className={`w-full rounded-2xl border p-3 text-left ${
                      item.id === selectedEquipmentId
                        ? "border-violet-400/60 bg-violet-500/10"
                        : "border-[#1e406a] bg-[#09162d]/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-[12px] font-extrabold">
                        {item.machineName}
                      </div>
                      <div className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusPill(item.status)}`}>
                        {item.status}
                      </div>
                    </div>
                    <div className="mt-1 text-[11px] text-white/55">
                      {item.equipmentCode} • {item.model}
                    </div>
                    <div className="mt-1 text-[10px] text-white/45">
                      {item.modality}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className={`${panelClass} min-h-[860px] p-3`}>
            <div className="grid gap-3 xl:grid-cols-2">
              <section className={`${subPanelClass} p-3`}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-extrabold">Room Configuration</div>
                    <div className="text-[12px] text-white/55">
                      Configure room attributes and scheduling behavior
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusPill(selectedRoom.status)}`}>
                    {selectedRoom.status}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div>
                    <label className={labelClass}>Room Name</label>
                    <input
                      className={inputClass}
                      value={selectedRoom.roomName}
                      onChange={(e) => updateRoomField("roomName", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Room Code</label>
                      <input
                        className={inputClass}
                        value={selectedRoom.roomCode}
                        onChange={(e) => updateRoomField("roomCode", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Room Type</label>
                      <input
                        className={inputClass}
                        value={selectedRoom.roomType}
                        onChange={(e) => updateRoomField("roomType", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Clinic</label>
                      <select
                        className={selectClass}
                        value={selectedRoom.clinic}
                        onChange={(e) =>
                          updateRoomField("clinic", e.target.value as Clinic)
                        }
                      >
                        {clinicOptions.map((clinic) => (
                          <option key={clinic}>{clinic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Status</label>
                      <select
                        className={selectClass}
                        value={selectedRoom.status}
                        onChange={(e) =>
                          updateRoomField("status", e.target.value as RoomStatus)
                        }
                      >
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Supported Modalities</label>
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-[#29446d] bg-[#0c1830] p-3">
                      {modalityOptions.map((modality) => {
                        const active = selectedRoom.modalities.includes(modality);
                        return (
                          <button
                            key={modality}
                            type="button"
                            onClick={() => toggleRoomModality(modality)}
                            className={`rounded-lg px-3 py-2 text-[12px] font-bold ${
                              active
                                ? "bg-sky-500/15 text-sky-300 border border-sky-400/40"
                                : "bg-[#102349]/80 text-white/70 border border-[#35598b]"
                            }`}
                          >
                            {modality}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-[12px] text-white/85">
                    <input
                      type="checkbox"
                      checked={selectedRoom.schedulingEnabled}
                      onChange={(e) =>
                        updateRoomField("schedulingEnabled", e.target.checked)
                      }
                    />
                    <span>Scheduling enabled for room allocation</span>
                  </label>

                  <div>
                    <label className={labelClass}>Notes</label>
                    <textarea
                      className="min-h-[88px] w-full rounded-2xl border border-[#29446d] bg-[#0c1830] p-3 text-[12px] text-white outline-none"
                      value={selectedRoom.notes}
                      onChange={(e) => updateRoomField("notes", e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveRoomConfig}
                      className={`${smallBtn} border border-sky-400/40 bg-sky-600/80 text-white`}
                    >
                      Save Room
                    </button>
                  </div>
                </div>
              </section>

              <section className={`${subPanelClass} p-3`}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-extrabold">Equipment Configuration</div>
                    <div className="text-[12px] text-white/55">
                      Configure machines and capabilities for scheduling
                    </div>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-[11px] font-bold ${statusPill(selectedMachine.status)}`}>
                    {selectedMachine.status}
                  </div>
                </div>

                <div className="grid gap-3">
                  <div>
                    <label className={labelClass}>Machine Name</label>
                    <input
                      className={inputClass}
                      value={selectedMachine.machineName}
                      onChange={(e) =>
                        updateEquipmentField("machineName", e.target.value)
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Equipment Code</label>
                      <input
                        className={inputClass}
                        value={selectedMachine.equipmentCode}
                        onChange={(e) =>
                          updateEquipmentField("equipmentCode", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Model</label>
                      <input
                        className={inputClass}
                        value={selectedMachine.model}
                        onChange={(e) =>
                          updateEquipmentField("model", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Clinic</label>
                      <select
                        className={selectClass}
                        value={selectedMachine.clinic}
                        onChange={(e) =>
                          updateEquipmentField("clinic", e.target.value as Clinic)
                        }
                      >
                        {clinicOptions.map((clinic) => (
                          <option key={clinic}>{clinic}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Modality</label>
                      <select
                        className={selectClass}
                        value={selectedMachine.modality}
                        onChange={(e) =>
                          updateEquipmentField(
                            "modality",
                            e.target.value as Modality
                          )
                        }
                      >
                        {modalityOptions.map((modality) => (
                          <option key={modality}>{modality}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelClass}>Status</label>
                      <select
                        className={selectClass}
                        value={selectedMachine.status}
                        onChange={(e) =>
                          updateEquipmentField(
                            "status",
                            e.target.value as EquipmentStatus
                          )
                        }
                      >
                        <option>Online</option>
                        <option>Offline</option>
                        <option>Maintenance</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Linked Room</label>
                      <select
                        className={selectClass}
                        value={selectedMachine.linkedRoomId ?? ""}
                        onChange={(e) =>
                          updateEquipmentField(
                            "linkedRoomId",
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                      >
                        {rooms
                          .filter((room) => room.clinic === selectedMachine.clinic)
                          .map((room) => (
                            <option key={room.id} value={room.id}>
                              {room.roomName}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Capabilities</label>
                    <div className="flex flex-wrap gap-2 rounded-2xl border border-[#29446d] bg-[#0c1830] p-3">
                      {capabilityOptions.map((capability) => {
                        const active = selectedMachine.capabilities.includes(capability);
                        return (
                          <button
                            key={capability}
                            type="button"
                            onClick={() => toggleEquipmentCapability(capability)}
                            className={`rounded-lg px-3 py-2 text-[12px] font-bold ${
                              active
                                ? "bg-violet-500/15 text-violet-300 border border-violet-400/40"
                                : "bg-[#102349]/80 text-white/70 border border-[#35598b]"
                            }`}
                          >
                            {capability}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Competency Required</label>
                    <input
                      className={inputClass}
                      value={selectedMachine.competencyRequired}
                      onChange={(e) =>
                        updateEquipmentField(
                          "competencyRequired",
                          e.target.value
                        )
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2 xl:grid-cols-3">
                    <label className="flex items-center gap-2 text-[12px] text-white/85">
                      <input
                        type="checkbox"
                        checked={selectedMachine.schedulingEnabled}
                        onChange={(e) =>
                          updateEquipmentField(
                            "schedulingEnabled",
                            e.target.checked
                          )
                        }
                      />
                      <span>Scheduling enabled</span>
                    </label>

                    <label className="flex items-center gap-2 text-[12px] text-white/85">
                      <input
                        type="checkbox"
                        checked={selectedMachine.pacsLinked}
                        onChange={(e) =>
                          updateEquipmentField("pacsLinked", e.target.checked)
                        }
                      />
                      <span>PACS linked</span>
                    </label>

                    <label className="flex items-center gap-2 text-[12px] text-white/85">
                      <input
                        type="checkbox"
                        checked={selectedMachine.dicomEnabled}
                        onChange={(e) =>
                          updateEquipmentField("dicomEnabled", e.target.checked)
                        }
                      />
                      <span>DICOM enabled</span>
                    </label>
                  </div>

                  <div>
                    <label className={labelClass}>Notes</label>
                    <textarea
                      className="min-h-[88px] w-full rounded-2xl border border-[#29446d] bg-[#0c1830] p-3 text-[12px] text-white outline-none"
                      value={selectedMachine.notes}
                      onChange={(e) =>
                        updateEquipmentField("notes", e.target.value)
                      }
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={saveEquipmentConfig}
                      className={`${smallBtn} border border-violet-400/40 bg-violet-600/80 text-white`}
                    >
                      Save Equipment
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <div className="mt-3 grid gap-3 xl:grid-cols-3">
              <div className={`${subPanelClass} p-3`}>
                <div className="mb-2 text-[13px] font-extrabold">
                  Room to Machine Mapping
                </div>
                <div className="space-y-2">
                  {roomLinkedMachines.length === 0 ? (
                    <div className="rounded-xl bg-[#102349]/70 px-3 py-3 text-[12px] text-white/55">
                      No machines linked to this room.
                    </div>
                  ) : (
                    roomLinkedMachines.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#102349]/70 px-3 py-3"
                      >
                        <div className="text-[12px] font-bold">{item.machineName}</div>
                        <div className="mt-1 text-[11px] text-white/60">
                          {item.model} • {item.modality}
                        </div>
                        <div className="mt-1 text-[10px] text-white/45">
                          {item.equipmentCode}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className={`${subPanelClass} p-3`}>
                <div className="mb-2 text-[13px] font-extrabold">
                  Scheduling Readiness
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Room Active:{" "}
                    <strong>{selectedRoom.status === "Active" ? "Yes" : "No"}</strong>
                  </div>
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Room Scheduling:{" "}
                    <strong>{selectedRoom.schedulingEnabled ? "Enabled" : "Disabled"}</strong>
                  </div>
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Equipment Online:{" "}
                    <strong>{selectedMachine.status === "Online" ? "Yes" : "No"}</strong>
                  </div>
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Equipment Scheduling:{" "}
                    <strong>{selectedMachine.schedulingEnabled ? "Enabled" : "Disabled"}</strong>
                  </div>
                </div>
              </div>

              <div className={`${subPanelClass} p-3`}>
                <div className="mb-2 text-[13px] font-extrabold">
                  Configuration Summary
                </div>
                <div className="space-y-2 text-[12px]">
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Clinic: <strong>{selectedClinic}</strong>
                  </div>
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Selected Room: <strong>{selectedRoom.roomName}</strong>
                  </div>
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Selected Machine: <strong>{selectedMachine.machineName}</strong>
                  </div>
                  <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                    Capabilities:{" "}
                    <strong>
                      {selectedMachine.capabilities.length > 0
                        ? selectedMachine.capabilities.join(", ")
                        : "None"}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </main>

          <aside className={`${panelClass} min-h-[860px] p-3`}>
            <div className="mb-3">
              <div className="text-[15px] font-extrabold">Audit & Governance</div>
              <div className="text-[12px] text-white/55">
                Configuration visibility and compliance summary
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Audit Visibility</div>
              <div className="space-y-2">
                {[
                  "Updated room scheduling flag",
                  "Mapped machine to clinic resource",
                  "Changed equipment capability set",
                  "Enabled PACS and DICOM linkage"
                ].map((item, idx) => (
                  <div
                    key={item}
                    className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75"
                  >
                    {item}
                    <div className="mt-1 text-[10px] text-white/40">
                      2026-03-27 0{idx + 8}:15
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Operational Mapping</div>
              <div className="space-y-2 text-[12px]">
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  Clinics configured: <strong>{clinicOptions.length}</strong>
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  Rooms configured: <strong>{rooms.length}</strong>
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  Machines configured: <strong>{equipment.length}</strong>
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2">
                  Resource allocation ready: <strong>Yes</strong>
                </div>
              </div>
            </div>

            <div className={`${subPanelClass} mb-3 p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Competency & Modality</div>
              <div className="space-y-2">
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                  Modalities are linked to rooms and machines for scheduling logic.
                </div>
                <div className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                  Competency rules can guide staff assignment to configured equipment.
                </div>
              </div>
            </div>

            <div className={`${subPanelClass} p-3`}>
              <div className="mb-2 text-[13px] font-extrabold">Future Consideration</div>
              <div className="rounded-xl bg-[#102349]/70 px-3 py-2 text-[11px] text-white/75">
                Consumables tracking can be added later using equipment-fed usage data.
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
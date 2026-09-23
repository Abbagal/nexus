export const SECTIONS = [
  { id: "SECTION_01_FACTORY", label: "Factory", start: 0, end: 0.068 },
  { id: "SECTION_02_FACTORY_INTERIOR", label: "Inside", start: 0.068, end: 0.145 },
  { id: "SECTION_03_PLANT", label: "Plant", start: 0.145, end: 0.215 },
  { id: "SECTION_04_DATA", label: "Data", start: 0.215, end: 0.295 },
  { id: "SECTION_05_FRAGMENTATION", label: "Systems", start: 0.295, end: 0.375 },
  { id: "SECTION_06_INCIDENT", label: "Deviation", start: 0.375, end: 0.45 },
  { id: "SECTION_07_INVESTIGATION", label: "Investigation", start: 0.45, end: 0.595 },
  { id: "SECTION_08_CONNECTORS", label: "Connectors", start: 0.595, end: 0.665 },
  { id: "SECTION_09_INTELLIGENCE", label: "Intelligence", start: 0.665, end: 0.725 },
  { id: "SECTION_10_ONTOLOGY", label: "Ontology", start: 0.725, end: 0.795 },
  { id: "SECTION_11_QUERY", label: "Query", start: 0.795, end: 0.85 },
  { id: "SECTION_12_INVESTIGATION", label: "Trace", start: 0.85, end: 0.91 },
  { id: "SECTION_13_ANSWER", label: "Evidence", start: 0.91, end: 0.955 },
  { id: "SECTION_14_DIGITAL_TWIN", label: "Digital twin", start: 0.955, end: 0.982 },
  { id: "SECTION_15_FINAL", label: "Factory", start: 0.982, end: 1 },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export function sectionById(id: SectionId) {
  const section = SECTIONS.find((item) => item.id === id);
  if (!section) throw new Error(id);
  return section;
}

export function sectionStart(id: SectionId) {
  return sectionById(id).start;
}

export function sectionEnd(id: SectionId) {
  return sectionById(id).end;
}

export function sectionAt(progress: number) {
  return SECTIONS.find((section) => progress >= section.start && progress < section.end) ?? SECTIONS[SECTIONS.length - 1];
}

function win(id: SectionId, from = 0.08, to = 0.9) {
  const section = sectionById(id);
  const span = section.end - section.start;
  return { from: section.start + span * from, to: section.start + span * to };
}

const investigate = sectionById("SECTION_07_INVESTIGATION");
const beat = (from: number, to: number) => ({
  from: investigate.start + (investigate.end - investigate.start) * from,
  to: investigate.start + (investigate.end - investigate.start) * to,
});

export type CaptionBeat = { sel: string; from: number; to: number; hold?: boolean; open?: boolean };

export const CAPTIONS: CaptionBeat[] = [
  { sel: ".cap-factory", ...win("SECTION_01_FACTORY", 0, 0.86), open: true },
  { sel: ".cap-inside", ...win("SECTION_02_FACTORY_INTERIOR", 0.12, 0.88) },
  { sel: ".cap-plant", ...win("SECTION_03_PLANT", 0.1, 0.88) },
  { sel: ".cap-data", ...win("SECTION_04_DATA", 0.06, 0.46) },
  { sel: ".cap-data-place", ...win("SECTION_04_DATA", 0.52, 0.92) },
  { sel: ".cap-fragment", ...win("SECTION_05_FRAGMENTATION", 0.1, 0.9) },
  { sel: ".cap-drift", ...win("SECTION_06_INCIDENT", 0.06, 0.46) },
  { sel: ".cap-incident", ...win("SECTION_06_INCIDENT", 0.52, 0.94) },
  { sel: ".cap-why", ...beat(0.01, 0.1) },
  { sel: ".cap-ops", ...beat(0.11, 0.22) },
  { sel: ".cap-quality", ...beat(0.23, 0.34) },
  { sel: ".cap-maint", ...beat(0.35, 0.46) },
  { sel: ".cap-supply", ...beat(0.47, 0.58) },
  { sel: ".cap-eng", ...beat(0.59, 0.68) },
  { sel: ".cap-production", ...beat(0.69, 0.78) },
  { sel: ".cap-datateam", ...beat(0.79, 0.88) },
  { sel: ".cap-scattered", ...beat(0.89, 0.99) },
  { sel: ".cap-nexus", ...win("SECTION_08_CONNECTORS", 0.1, 0.9) },
  { sel: ".cap-intelligence", ...win("SECTION_09_INTELLIGENCE", 0.1, 0.9) },
  { sel: ".cap-ontology", ...win("SECTION_10_ONTOLOGY", 0.12, 0.9) },
  {
    sel: ".cap-query",
    from: sectionStart("SECTION_11_QUERY") + 0.004,
    to: sectionEnd("SECTION_12_INVESTIGATION") - 0.006,
  },
  { sel: ".cap-answer", ...win("SECTION_13_ANSWER", 0.08, 0.9) },
  { sel: ".cap-twin", ...win("SECTION_14_DIGITAL_TWIN", 0.14, 0.86) },
  { sel: ".cap-finale", from: sectionStart("SECTION_15_FINAL") + 0.004, to: 1, hold: true },
];

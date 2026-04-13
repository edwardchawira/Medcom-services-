export type CheckpointOption = {
  key: string;
  label: string;
  isCorrect: boolean;
};

export type MedicationCheckpoint = {
  id: string;
  /** 1-based chapter number: checkpoint runs when learner clicks Next to leave this chapter */
  triggerAfterChapter: number;
  question: string;
  options: CheckpointOption[];
  successMessage: string;
  hintWrong: string;
};

/**
 * Short recall checkpoints after ~every third chapter (3, 6, 9, 12).
 * Aligns with module outcomes: role limits, prompting vs administration, safety, documentation.
 */
export const MEDICATION_CHECKPOINTS: MedicationCheckpoint[] = [
  {
    id: "cp-after-3",
    triggerAfterChapter: 3,
    question:
      "Which statement best matches prompting or assisting with medication (compared with administration)?",
    options: [
      {
        key: "a",
        label:
          "It can include reminding someone to take a dose or helping with packaging, within policy and your role.",
        isCorrect: true,
      },
      {
        key: "b",
        label: "It is the same as a nurse giving an injection in a clinic.",
        isCorrect: false,
      },
      {
        key: "c",
        label: "It always means you can decide to hide tablets in food without consent.",
        isCorrect: false,
      },
    ],
    successMessage: "Good. Stay within role, policy, and consent when supporting medicines.",
    hintWrong:
      "Think about supporting independence and following the care plan. Do not act outside your competence.",
  },
  {
    id: "cp-after-6",
    triggerAfterChapter: 6,
    question:
      "Why is safe storage of medicines especially important in someone’s home?",
    options: [
      {
        key: "a",
        label: "So medicines are secure, correctly labelled, and less likely to be mixed up or accessed by the wrong person.",
        isCorrect: true,
      },
      {
        key: "b",
        label: "So you can store all medicines together in one unlabelled bag.",
        isCorrect: false,
      },
      {
        key: "c",
        label: "So refrigeration is never needed for any medicine.",
        isCorrect: false,
      },
    ],
    successMessage:
      "Right. Storage and security reduce errors and protect the person and others in the home.",
    hintWrong: "Consider security, correct packaging, and following local medicines policy.",
  },
  {
    id: "cp-after-9",
    triggerAfterChapter: 9,
    question:
      "A capacitous adult refuses a dose. What is usually the most appropriate first theme in your response?",
    options: [
      {
        key: "a",
        label:
          "Respect refusal, follow policy for reporting and handover, and do not pressure them to take it.",
        isCorrect: true,
      },
      {
        key: "b",
        label: "Insist they take it because you know it is good for them.",
        isCorrect: false,
      },
      {
        key: "c",
        label: "Ignore the refusal and document nothing.",
        isCorrect: false,
      },
    ],
    successMessage: "Yes. Refusal should be handled with dignity, policy, and clear documentation.",
    hintWrong: "Capacity, consent, and documentation matter. Check your local procedure.",
  },
  {
    id: "cp-after-12",
    triggerAfterChapter: 12,
    question:
      "Before moving on, which habit best supports safe medicines support over time?",
    options: [
      {
        key: "a",
        label:
          "Accurate, timely records and clear communication at handover when something changes.",
        isCorrect: true,
      },
      {
        key: "b",
        label: "Only verbal updates with no written record.",
        isCorrect: false,
      },
      {
        key: "c",
        label: "Guessing a dose when you are unsure.",
        isCorrect: false,
      },
    ],
    successMessage:
      "Strong answer. Documentation and communication keep teams aligned and people safe.",
    hintWrong: "Reliable records and escalation when unsure are central to safe care.",
  },
];

const STORAGE_KEY = "medcom_medication_checkpoints_v1";

export function loadCheckpointPassed(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as unknown;
    return o && typeof o === "object" ? (o as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}

export function saveCheckpointPassed(map: Record<string, boolean>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isCheckpointPassed(id: string): boolean {
  return !!loadCheckpointPassed()[id];
}

export function markCheckpointPassedId(id: string) {
  const m = { ...loadCheckpointPassed(), [id]: true };
  saveCheckpointPassed(m);
}

/** Returns checkpoint to show when user clicks Next from `stepIndex` (0-based chapter index). */
export function getCheckpointWhenLeavingStep(
  stepIndex: number
): MedicationCheckpoint | undefined {
  const leavingChapter = stepIndex + 1;
  return MEDICATION_CHECKPOINTS.find((c) => c.triggerAfterChapter === leavingChapter);
}

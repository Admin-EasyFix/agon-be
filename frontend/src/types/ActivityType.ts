export const ActivityType = {
  Running: "running",
  Cycling: "cycling",
  Swimming: "swimming",
  Hiking: "hiking",
  Other: "other",
} as const;

export type ActivityType = (typeof ActivityType)[keyof typeof ActivityType];
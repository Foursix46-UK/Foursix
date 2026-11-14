// Job status values, shared by the Careers CMS schema, the /careers server page and the
// careers client so the three always agree on the exact strings.
export const JOB_STATUS = {
  /** Listed on the site and open for applications. */
  OPEN: "Open",
  /** Still listed on the site, labelled "Closed – cannot apply", with applying disabled. */
  APPLICATION_CLOSED: "Application Closed",
  /** Removed from the site entirely. */
  CLOSED: "Closed",
} as const;

export type JobStatus = (typeof JOB_STATUS)[keyof typeof JOB_STATUS];

/** Statuses that appear on /careers. */
export const LISTED_JOB_STATUSES: JobStatus[] = [JOB_STATUS.OPEN, JOB_STATUS.APPLICATION_CLOSED];

export const isApplicationClosed = (status?: string | null) => status === JOB_STATUS.APPLICATION_CLOSED;

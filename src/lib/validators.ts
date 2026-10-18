import { z } from "zod";

export const LEAD_STATUSES = ["NEW", "CONTACTED", "IN_PROGRESS", "COMPLETED", "ARCHIVED"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const BILLING_TYPES = ["ONE_TIME", "MONTHLY", "YEARLY", "QUOTE"] as const;
export const BUDGETS = ["lt5", "5to15", "15to50", "50plus", "unsure"] as const;

/** Removes control characters and angle brackets; React escapes output, this is defence in depth. */
export function clean(s: string): string {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F<>]/g, "").trim();
}

const text = (min: number, max: number) =>
  z.string().transform(clean).pipe(z.string().min(min).max(max));

export const leadSchema = z.object({
  name: text(2, 80),
  email: z.string().transform(clean).pipe(z.string().email().max(120)),
  whatsapp: z
    .string()
    .transform(clean)
    .pipe(z.string().regex(/^[+\d][\d\s()-]{6,20}$/)),
  service: z.string().transform(clean).pipe(z.string().max(80)).default(""),
  packageName: z.string().transform(clean).pipe(z.string().max(80)).default(""),
  budget: z.enum(BUDGETS).or(z.literal("")).default(""),
  message: text(0, 1500).default(""),
  website: z.string().max(200).optional(), // honeypot
});
export type LeadInput = z.infer<typeof leadSchema>;

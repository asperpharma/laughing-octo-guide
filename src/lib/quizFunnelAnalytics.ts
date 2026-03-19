/**
 * Asper Beauty - 3-Click Funnel Tracking
 * Purpose: Identify drop-off points in the "Morning Spa" consultation for the 24-Hour Clinical Audit and Customer Success Report.
 */

const LOG_CONCIERGE_EVENTS_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-concierge-events`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export type QuizStep =
  | "START_QUIZ"
  | "SELECT_CONCERN"
  | "SELECT_SKIN_TYPE"
  | "VIEW_PRESCRIPTION"
  | "ADD_TO_CART";

export function trackQuizFunnel(
  step: QuizStep,
  data?: Record<string, unknown>,
): void {
  // Log to console for 24-Hour Clinical Audit verification
  if (import.meta.env.DEV) {
    console.log(`[ASPER_ANALYTICS] Step: ${step}`, data ?? {});
  }

  if (!ANON_KEY) return;

  fetch(LOG_CONCIERGE_EVENTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": ANON_KEY,
      "Authorization": `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify({
      event: `quiz_funnel_${step.toLowerCase()}`,
      ...data,
    }),
  }).catch((err) => {
    if (import.meta.env.DEV) console.error("[ASPER_ANALYTICS] quiz_funnel send failed:", err);
  });
}

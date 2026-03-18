import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const LOG_CONCIERGE_EVENTS_URL =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/log-concierge-events`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Fires a `page_view` event to the concierge analytics backend on every
 * route change. Must be rendered inside <BrowserRouter>.
 */
export function usePageTracking(): void {
  const location = useLocation();

  useEffect(() => {
    if (!ANON_KEY) return;

    fetch(LOG_CONCIERGE_EVENTS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": ANON_KEY,
        "Authorization": `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        event: "page_view",
        page: location.pathname,
        referrer: document.referrer || undefined,
      }),
    }).catch((err) => {
      if (import.meta.env.DEV) console.error("[ASPER_ANALYTICS] page_view send failed:", err);
    });
  }, [location.pathname]);
}

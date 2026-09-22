-- Add "proposed" status to calendar events.
-- Used by the CONSUDES 2027–2030 proposed quadrennial calendar.

ALTER TYPE public.calendar_event_status
ADD VALUE IF NOT EXISTS 'proposed';

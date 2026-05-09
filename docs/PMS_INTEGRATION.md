# PMS Integration Strategy

## MVP: PMS-agnostic
Do not depend on Paradigm, Open Dental, ClearDent, Tracker, ABELDent, Dentrix, or Curve at launch.

Workflow:
1. Clinic exports patient list from PMS as CSV.
2. MedEngs imports patient number/name/contact.
3. Staff sends form links from MedEngs.
4. PDFs are delivered to configured email and clinic cloud folder.
5. Staff manually attaches PDF back to PMS if required.

## Why this is safest
- No direct PMS database writes.
- Avoids corruption/liability.
- Works with every clinic.
- Faster launch and lower support.

## Future connectors
1. Open Dental: official API first; read-only sync before write-back.
2. ClearDent: API partner route.
3. Paradigm/Logic Tech: partner/contact route; treat as competitor plus integration candidate.
4. Others: bridge/export/import connectors case-by-case.

## Hard rule
Never direct-write PMS databases. Official APIs only for writes, and only after vendor approval/testing.


## Connector research summary
| Route | Pros | Cons | Fit |
|---|---|---|---|
| PMS-agnostic CSV/cloud/email | Fast, universal, no vendor approval, low write-risk | Not real-time; requires exports | Best MVP |
| Open Dental API | Public REST API; supports patients, appointments, recalls, payments, documents/events | Open Dental clinics only; eConnector/customer keys required | First native connector |
| ClearDent API / partner route | Canadian relevance; public partner/API positioning | Docs gated; requires partner process | Strategic connector |
| Paradigm / Logic Tech | Canadian footprint; integration appears possible through partners | No public API found; all-in-one positioning | Later BD/partner route |

## MVP operations reports to support
- upcoming appointments
- recall list
- unscheduled treatment
- aging / AR
- new patients
- cancellations/no-shows

Agent outputs from these reports:
- daily front-desk brief
- recall outreach drafts
- cancellation fill queue
- no-show recovery queue
- treatment-plan follow-up list
- AR follow-up list

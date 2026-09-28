# Tribal Scholar AI — Data Source & Verification Policy

**Ministry of Tribal Affairs, Government of India**  
*Document Ref: MOTA-DS-POLICY-2026*  
*Last Updated: 27 September 2026*

---

## 1. Overview & Real-Data-First Principle

Tribal Scholar AI operates on a strict **Real-Data-First Architecture**. No scholarship names, deadlines, financial amounts, eligibility cutoffs, or application URLs may be fabricated or assumed. 

Official opportunities presented to students must be backed by authoritative, published government sources. Prototype or demo applications within SIH evaluation workflows are explicitly demarcated with the label `Illustrative Demo Application — SIH 2026 Prototype`.

---

## 2. Authoritative Data Sources

Scholarship and Fellowship information is sourced exclusively from official Government of India channels in the following order of priority:

1. **Ministry of Tribal Affairs (MoTA) Official Portal**:
   - URL: [https://tribal.nic.in](https://tribal.nic.in) & [https://tribal.nic.in/Schemes.aspx](https://tribal.nic.in/Schemes.aspx)
   - Scope: Central Sector & Centrally Sponsored ST Schemes (Pre-Matric, Post-Matric, Top Class, National Fellowship NFST, National Overseas Scholarship NOS).

2. **National Scholarship Portal (NSP)**:
   - URL: [https://scholarships.gov.in](https://scholarships.gov.in)
   - Scope: Application windows, scheme guidelines, nodal verification mandates.

3. **Official Gazette Notifications & State Nodal Guidelines**:
   - Scope: State-specific ST welfare guidelines and disbursement rules.

---

## 3. Source-of-Truth Metadata Requirements

Every official opportunity record in the system database contains the following mandatory verification metadata:

| Field | Description | Example Value |
| :--- | :--- | :--- |
| `officialName` | Full legal title as published in government notification | *Top Class Education Scheme for ST Students* |
| `ministry` | Sponsoring Ministry | *Ministry of Tribal Affairs* |
| `academicYear` | Current academic cycle | `2026–27` |
| `educationLevel` | Verified classification | `SCHOOL` \| `DIPLOMA` \| `UNDERGRADUATE` \| `POSTGRADUATE` \| `RESEARCH` \| `PROFESSIONAL` |
| `sourceType` | Verification origin | `OFFICIAL_MOTA` \| `OFFICIAL_NSP` \| `OFFICIAL_GOVERNMENT_NOTIFICATION` |
| `sourceUrl` | Direct link to official scheme page | `https://tribal.nic.in/Schemes.aspx` |
| `officialApplicationUrl` | Authoritative application portal | `https://scholarships.gov.in` |
| `lastVerifiedAt` | Date of last audit | `2026-09-27` |

---

## 4. Data Freshness & Handling Stale Information

- **Current Application Windows**: Schemes with active, verified deadlines display the exact cutoff date.
- **Unverified / Closed Windows**: If an application window for the current academic year has not yet been notified, the UI displays:
  - `"Deadline not currently verified"` or `"Application Window Closed"`
  - Direct button: `[ View Official Scheme ]` pointing to `sourceUrl`.
- **No Inferred Deadlines**: Previous year deadlines (e.g. 2024–25 or 2025–26) are **never** presented as active current deadlines.

---

## 5. Official Application Redirection Policy

Unless Tribal Scholar AI has an authorized, active API bridge with an official government portal, applications are completed on the government portal. 

Students are guided via clear buttons:
- **`[ Apply on Official Portal ]`** or **`[ Continue to Official Portal ]`**
- Direct destination: `https://scholarships.gov.in` or `https://tribal.nic.in`

---

## 6. AI Assistant Attribution Policy

When answering scholar queries, the Tribal Scholar AI Assistant cites authoritative metadata:
- **Source**: *Ministry of Tribal Affairs* or *National Scholarship Portal*
- **Last Verified Date**: *27 September 2026*
- If information cannot be verified from published guidelines, the assistant responds:
  - *"I couldn't verify this information from the available official source."*
  - Followed by a direct link to the official source document.

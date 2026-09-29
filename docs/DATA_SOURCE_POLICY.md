# TRIBAL SCHOLAR AI — DATA SOURCE & INTEGRITY POLICY

## 1. Official Government Sources
Tribal Scholar AI operates strictly on verified, authentic scholarship and fellowship data sourced from official Indian Ministry portals:
- **Ministry of Tribal Affairs (MoTA)**: `https://tribal.nic.in`
- **National Scholarship Portal (NSP)**: `https://scholarships.gov.in`
- **State Portal Guidelines & Official Notifications**

## 2. Supported Official MoTA Scheme Categories
1. **Pre-Matric Scholarship Scheme for ST Students (Class IX & X)**
2. **Post-Matric Scholarship for ST Students (State & Central)**
3. **Top Class Education Scheme for ST Students** (Premier Institutes: IITs, NITs, AIIMS, IIMs, NLUs)
4. **National Fellowship & Scholarship for Higher Education of ST Students** (M.Phil / Ph.D.)
5. **National Overseas Scholarship for ST Students** (Master's & Doctorate Abroad)
6. **EMRS Special Merit Incentive Scheme**

## 3. Data Integrity & Verification Principles
- **No Hallucinated Schemes**: Fictional or unverified government schemes are prohibited.
- **Academic Year Tracking**: Schemes track `academicYear: "2026-27"` and `lastVerifiedAt` timestamp.
- **Null Safety**: Optional unprovided student profile attributes return `"Not provided"` rather than inventing sample values.
- **Official Portal Redirection**: Applications redirect students to official government application portals (`scholarships.gov.in` / `tribal.nic.in`) using verified URLs.

## 4. Illustrative Demo Data Policy
Where sample queue items or analytics benchmarks are presented for jury demonstration purposes, they carry explicit `isDemoRecord: true` flags and `"Illustrative Demo"` labels to ensure clear separation from real student database records.

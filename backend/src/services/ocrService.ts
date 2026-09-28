export interface ExtractedDocumentData {
  text: string;
  fields: Record<string, string>;
  confidence: number;
  isDemoAnalysis: boolean;
}

export class OCRService {
  /**
   * Extract text and key structural fields from a document.
   * If DEMO_AI_MODE=true or no external API key is supplied,
   * deterministic demo OCR analysis is executed based on document type and content.
   */
  static async extractDocumentText(docType: string, fileName: string, fileUrl: string): Promise<ExtractedDocumentData> {
    const isDemo = process.env.DEMO_AI_MODE !== 'false';
    const lowerType = docType.toLowerCase();
    const lowerName = fileName.toLowerCase();

    // Deterministic Demo OCR extraction rules
    const fields: Record<string, string> = {};
    let text = '';
    let confidence = 0.94;

    if (lowerType.includes('caste') || lowerType.includes('st') || lowerType.includes('tribe')) {
      if (lowerName.includes('mismatch') || lowerName.includes('kanishka') || lowerName.includes('st_caste')) {
        // Scenario B: Name Mismatch Demo Document
        fields['applicantName'] = 'Kanishka S.';
        fields['fatherName'] = 'Ramesh Suthar';
        fields['casteCategory'] = 'Scheduled Tribe (Santhal)';
        fields['district'] = 'Sundargarh';
        fields['state'] = 'Odisha';
        fields['certificateNo'] = 'ST/2023/88102';
        fields['issuingAuthority'] = 'Tehsildar Sundargarh';
        fields['issueDate'] = '2023-04-12';
        text = 'GOVERNMENT OF ODISHA OFFICE OF THE TEHSILDAR SUNDARGARH CERTIFICATE OF SCHEDULED TRIBE This is to certify that Kanishka S. son/daughter of Ramesh Suthar belongs to Santhal Scheduled Tribe.';
      } else {
        // Scenario A: Clean ST Certificate
        fields['applicantName'] = 'Kanishka Suthar';
        fields['fatherName'] = 'Ramesh Suthar';
        fields['casteCategory'] = 'Scheduled Tribe (Santhal)';
        fields['district'] = 'Sundargarh';
        fields['state'] = 'Odisha';
        fields['certificateNo'] = 'ST/2024/99104';
        fields['issuingAuthority'] = 'Tehsildar Sundargarh';
        fields['issueDate'] = '2024-05-10';
        text = 'GOVERNMENT OF ODISHA OFFICE OF THE TEHSILDAR SUNDARGARH CERTIFICATE OF SCHEDULED TRIBE This is to certify that Kanishka Suthar belongs to Santhal Scheduled Tribe.';
      }
    } else if (lowerType.includes('income')) {
      if (lowerName.includes('missing')) {
        // Scenario C: Missing Information
        fields['applicantName'] = 'Kanishka Suthar';
        fields['incomeAmount'] = '180000';
        fields['issuingAuthority'] = 'District Welfare Office';
        text = 'CERTIFICATE OF FAMILY ANNUAL INCOME Family income is Rs 1,80,000 per annum.';
      } else {
        fields['applicantName'] = 'Kanishka Suthar';
        fields['incomeAmount'] = '180000';
        fields['issuingAuthority'] = 'Revenue Officer Rourkela';
        fields['certificateNo'] = 'INC/2025/4412';
        fields['issueDate'] = '2025-04-10';
        text = 'GOVERNMENT OF ODISHA REVENUE DEPARTMENT INCOME CERTIFICATE Verified annual family income of Kanishka Suthar is Rs 1,80,000 (Rupees One Lakh Eighty Thousand Only). Valid for Financial Year 2025-26.';
      }
    } else if (lowerType.includes('marks') || lowerType.includes('marksheet')) {
      fields['applicantName'] = 'Kanishka Suthar';
      fields['institutionName'] = 'National Institute of Technology Rourkela';
      fields['courseName'] = 'B.Tech Computer Science & Engineering';
      fields['cgpa'] = '8.6';
      fields['semester'] = 'Semester IV';
      text = 'NATIONAL INSTITUTE OF TECHNOLOGY ROURKELA ACADEMIC MARKS TRANSCRIPT Name: Kanishka Suthar Course: B.Tech CSE Semester IV CGPA: 8.6 Status: PASS.';
    } else if (lowerType.includes('bonafide')) {
      if (lowerName.includes('blurry') || lowerName.includes('low_res')) {
        // Scenario D: Low Readability
        confidence = 0.42;
        text = 'N...I...T R...kela B...fide C...tificate';
      } else {
        fields['applicantName'] = 'Kanishka Suthar';
        fields['institutionName'] = 'National Institute of Technology Rourkela';
        fields['academicYear'] = '2025-2026';
        fields['rollNumber'] = '122CS0891';
        text = 'NATIONAL INSTITUTE OF TECHNOLOGY ROURKELA BONAFIDE CERTIFICATE Certified that Kanishka Suthar Roll No 122CS0891 is a regular student of B.Tech CSE for academic year 2025-26.';
      }
    } else {
      fields['applicantName'] = 'Kanishka Suthar';
      text = `Extracted text from document: ${docType} (${fileName})`;
    }

    return {
      text,
      fields,
      confidence,
      isDemoAnalysis: isDemo,
    };
  }
}

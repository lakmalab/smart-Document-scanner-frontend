export interface ExtractedField {
  fieldId: number;
  fieldName: string;
  value: string;
  confidenceScore: number;
  status: string;
  type: string;
}

export interface Document2 {
  documentId: number;
  status: string;
  uploadDate: string;
  uploadedByUserId: number;
  templateId: number;
  templateName: string;
  extractedFields: ExtractedField[];
}

export interface DocumentCardItem {
  documentId: number;
  status: string;
  uploadDate: string;
  templateName: string;
  fields: ExtractedField[];
}

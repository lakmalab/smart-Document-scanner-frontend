export interface ExtractedField {
  fieldId: number;
  fieldName: string;
  value: string;
  confidenceScore: number;
  status: string;
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

export interface Template {
  templateId: number;
  template_name: string;
  templateImagePath?: string;
  field_count: number;
  image_url: string;
  fields: {
    fieldId: number;
    fieldName: string;
    fieldType: string;
    required: boolean;
  }[];
}

export interface MobileTokenSettings {
  token: string;
  used: boolean;
  expiresAt: string | null;
}

export interface User {
  userId: number;
  profilePicturePath?: string;
  name: string;
  email: string;
  address?: string;
  contactNumber?: string;
  city?: string;
  province?: string;
  password?: string;
  role?: string;
}

export interface TemplateCreateRequest {
  templateId: number | null;
  templateName: string;
  templateImagePath: string;
  documentType: string;
  createdByUserId: number;
  fields: {
    fieldName: string;
    fieldType: string;
    aiPrompt: string;
    required: boolean;
  }[];
}
type DrupalArticle = [{ target_id: 'article' }]; 

type BusinessInfo = [{ target_id: 'business_info' }];

type ReponseType = DrupalArticle | BusinessInfo;

export type FieldValue = [
  {
    value: string | boolean,
    lang?: string,
    format?: string,
  }
]

export interface DrupalResponse {
  uuid: FieldValue,
  type: ReponseType,
  title: FieldValue,
  created: FieldValue,
  langcode: FieldValue,
  body?: FieldValue
}

export interface StructuredContentResponse extends DrupalResponse {
  field_address_line: FieldValue,
  field_email: FieldValue,
  field_public: FieldValue,
  type: BusinessInfo,
}

export interface StructuredContent {
  addressLine: string,
  email: string,
  public: boolean,
  title: string,
}

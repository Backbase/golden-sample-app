type DrupalArticle = [{ target_id: 'article' }]; 

type BusinessInfo = [{ target_id: 'business_info' }];

type ReponseType = DrupalArticle | BusinessInfo;

type FieldValue = [
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

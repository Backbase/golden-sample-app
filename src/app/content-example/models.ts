export enum ResponseType {
  Article = 'article',
  BusinessInfo = 'business_info',
  ContactUs = 'contact_us'
}

type DrupalArticle = [{ target_id: ResponseType.Article }]; 

type BusinessInfo = [{ target_id: ResponseType.BusinessInfo }];

type ContactUs = [{ target_id: ResponseType.ContactUs }];

type ReponseType = DrupalArticle | BusinessInfo | ContactUs;

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

export interface EmbededContent {
  [key: string] : [{
    _links: {
      self: {
          href: string,
        },
      },
    },
  ],
}

export interface ContactUsReponse extends DrupalResponse {
  field_email: FieldValue,
  type: ContactUs,
  field_social_net: [{ uri: string, title: string }],
  _embedded: EmbededContent
}
export interface ContactUsData {
  title: string,
  email: string;
  socialLink: {
    link: string,
    linkText: string,
    imageLink: string,
  },
}

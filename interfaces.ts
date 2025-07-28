export enum PresaleFilterEnum {
  ACTIVE = 'active',
  PLANNED = 'planned',
  COMPLETED = 'completed',
  PAUSED = 'paused',
}

export enum LanguagesEnum {
  en = 'en',
  hy = 'hy'
}

export interface IParams {
  lang?: LanguagesEnum;
  [key: string]: string | undefined;
}


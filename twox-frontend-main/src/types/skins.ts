export enum SKIN_TYPES {
  CSGO = 'csgo',
  DOTA2 = 'dota2',
  TF2 = 'rust',
}

export type SkinItem = {
  classid: string
  name: string
  image: string
  price: number
  count: number
}

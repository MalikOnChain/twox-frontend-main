import { StaticImageData } from 'next/image'

export interface IPromotion {
  _id: string
  name: string
  description: string
  image: string | StaticImageData
}

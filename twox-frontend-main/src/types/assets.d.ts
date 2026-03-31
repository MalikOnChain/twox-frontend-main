// Type declarations for image assets
declare module '*.png' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.jpg' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.jpeg' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.webp' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.gif' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.ico' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.bmp' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.tiff' {
  import { StaticImageData } from 'next/image'
  const content: StaticImageData
  export default content
}

declare module '*.svg' {
  import { FC, SVGProps } from 'react'
  const content: FC<SVGProps<SVGElement>>
  export default content
}

declare module '*.svg?url' {
  const content: string
  export default content
}

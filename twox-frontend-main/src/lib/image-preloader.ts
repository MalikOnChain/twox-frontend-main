export class ImagePreloader {
  private image: HTMLImageElement
  private loaded = false

  constructor(url: string) {
    this.image = new Image()
    this.image.src = url
  }

  load(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        resolve()
        return
      }

      this.image.onload = () => {
        this.loaded = true
        resolve()
      }

      this.image.onerror = () => {
        reject(new Error('Failed to load image'))
      }
    })
  }
}

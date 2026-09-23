export type Fingerprint = {
  browser: string
  os: string
  device: string
  language: string
  timezone: string
  screen: string
  viewport: string
  cpu: number | null
  memory: number | null
  touch: number
  pixelRatio: number
  canvasHash: string | null
  webgl: string | null
  fingerprintHash: string
}

export type Visitor = Fingerprint & {
  anonymous_id: string
  last_seen: string
}

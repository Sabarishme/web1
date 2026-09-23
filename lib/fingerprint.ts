async function hash(value: string): Promise<string> {
  const data = new TextEncoder().encode(value)
  const buffer = await crypto.subtle.digest("SHA-256", data)

  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function browser(): string {
  const ua = navigator.userAgent

  if (/Edg\//.test(ua)) return "Edge"
  if (/OPR\//.test(ua)) return "Opera"
  if (/Firefox\//.test(ua)) return "Firefox"
  if (/Chrome\//.test(ua)) return "Chrome"
  if (/Safari\//.test(ua)) return "Safari"

  return "Unknown"
}

function os(): string {
  const ua = navigator.userAgent

  if (/Windows NT/.test(ua)) return "Windows"
  if (/Android/.test(ua)) return "Android"
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS"
  if (/Mac OS X/.test(ua)) return "macOS"
  if (/Linux/.test(ua)) return "Linux"

  return "Unknown"
}

async function canvas(): Promise<string | null> {
  try {
    const canvas = document.createElement("canvas")
    canvas.width = 300
    canvas.height = 100

    const ctx = canvas.getContext("2d")

    if (!ctx) return null

    ctx.textBaseline = "top"
    ctx.font = "16px Arial"
    ctx.fillStyle = "#f60"
    ctx.fillRect(10, 10, 100, 40)

    ctx.fillStyle = "#069"
    ctx.fillText("Fingerprint Observatory", 15, 20)

    ctx.strokeStyle = "#333"
    ctx.beginPath()
    ctx.arc(220, 50, 30, 0, Math.PI * 2)
    ctx.stroke()

    return await hash(canvas.toDataURL())
  } catch {
    return null
  }
}

function webgl(): string | null {
  try {
    const canvas = document.createElement("canvas")

    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")

    if (!gl) return null

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info")

    if (!debugInfo) return "webgl-available"

    const vendor = gl.getParameter(
      debugInfo.UNMASKED_VENDOR_WEBGL
    )

    const renderer = gl.getParameter(
      debugInfo.UNMASKED_RENDERER_WEBGL
    )

    return `${vendor} | ${renderer}`
  } catch {
    return null
  }
}

export async function collectFingerprint() {
  const canvasHash = await canvas()
  const webglInfo = webgl()

  const data = {
    browser: browser(),
    os: os(),

    device:
      /Mobi|Android/i.test(navigator.userAgent)
        ? "Mobile"
        : "Desktop",

    language: navigator.language,

    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone,

    screen:
      String(screen.width) +
      " × " +
      String(screen.height),

    viewport:
      String(window.innerWidth) +
      " × " +
      String(window.innerHeight),

    cpu:
      navigator.hardwareConcurrency || null,

    memory:
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ||
      null,

    touch:
      navigator.maxTouchPoints || 0,

    pixelRatio:
      window.devicePixelRatio || 1,

    canvasHash,

    webgl: webglInfo,
  }

  const fingerprintHash = await hash(
    JSON.stringify(data)
  )

  return {
    ...data,
    fingerprintHash,
  }
}
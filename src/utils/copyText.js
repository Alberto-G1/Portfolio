// Copies text to the clipboard. Uses the async Clipboard API; where that is missing or refused (older browsers,
// an insecure page) it falls back to a hidden textarea and document.execCommand('copy'). Resolves true if it worked.
export default async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.append(area)
    area.select()
    let ok
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    area.remove()
    return ok
  }
}

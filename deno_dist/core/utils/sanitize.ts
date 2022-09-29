const sanitizeKeyPrefixLeadingNumber = /^([0-9])/
const sanitizeKeyRemoveDisallowedChar = /[^a-zA-Z0-9]+/g

export const sanitizeKey = (key: string) => {
  return key
    .replace(sanitizeKeyPrefixLeadingNumber, '_$1')
    .replace(sanitizeKeyRemoveDisallowedChar, '_')
}

export const sanitzeValue = (value: string) => {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}

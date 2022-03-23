export function isAlpha(s: string) {
  return /[a-zA-Z]/.test(s);
}

export function isDigit(s: string) {
  return /[0-9]/.test(s);
}

export function isBlank(s: string) {
  return s == ' ' || s == '\t' || s == '\n';
}
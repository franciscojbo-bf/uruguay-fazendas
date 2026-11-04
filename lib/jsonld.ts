// Serializa JSON-LD para uso em <script> sem permitir que dados externos
// (ex.: nomes vindos da planilha) fechem a tag e injetem HTML/JS.
// Troca <, >, &, U+2028 e U+2029 pelo escape unicode equivalente (\uXXXX),
// que continua sendo JSON válido.
const BACKSLASH = String.fromCharCode(92)
const UNSAFE = new RegExp('[<>&' + String.fromCharCode(0x2028, 0x2029) + ']', 'g')

export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(
    UNSAFE,
    (c) => BACKSLASH + 'u' + c.charCodeAt(0).toString(16).padStart(4, '0'),
  )
}

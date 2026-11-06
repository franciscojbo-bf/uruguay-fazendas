# TODO · Hotsite Uruguai

Commit no GitHub: `239a87a` (main) · Hotline: formulário próprio no lugar do Typeform, Next 16 e correções de segurança.

## Antes do deploy

- [ ] Cadastrar as variáveis de ambiente em **Settings → Environment Variables**, para **Production** e **Preview**:
  - `HOTLINE_SCRIPT_URL`
  - `HOTLINE_TOKEN`
  - Os valores são enviados pelo Gabriel por canal privado. Nunca colocar em código, commit ou chat.
- [ ] Conferir se a versão do Node do projeto é **20.9 ou superior** (Settings → General → Node.js Version).


## Depois do deploy

- [ ] Enviar o **link de download do E-Book Uruguai**. Entra em `lib/config.ts` (`EBOOK_URL`), com commit e novo deploy.
- [x] Montar a agenda e enviar o **link do Calendly**. Feito: `CALENDLY_URL` em `lib/config.ts` (botão "Agendar conversa" na tela de obrigado, para todos os perfis).
- [ ] Corrigir na planilha das fazendas o slug `sclo4` (letra "o") para `scl04` (zero).
- [ ] Apagar as linhas de teste na aba **LEADS**.

---

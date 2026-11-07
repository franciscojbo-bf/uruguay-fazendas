# TODO · Hotsite Uruguai

Commit no GitHub: `239a87a` (main) · Hotline: formulário próprio no lugar do Typeform, Next 16 e correções de segurança.

## Antes do deploy

- [ ] Cadastrar as variáveis de ambiente em **Settings → Environment Variables**, para **Production** e **Preview**:
  - `HOTLINE_SCRIPT_URL`
  - `HOTLINE_TOKEN`
  - `RESEND_API_KEY` (aviso por e-mail de novo lead; chave criada no painel do Resend)
  - `HOTLINE_EMAIL_TO` (destinatários do aviso, separados por vírgula; ficam fora do código porque o repo é público)
  - Os valores são enviados pelo Gabriel por canal privado. Nunca colocar em código, commit ou chat.
- [ ] No Resend, confirmar que o domínio `forms-mail.benedinifazendas.com.br` está **Verified** (registros DNS). O remetente usado é `hotline@forms-mail.benedinifazendas.com.br`.
- [ ] Conferir se a versão do Node do projeto é **20.9 ou superior** (Settings → General → Node.js Version).


## Depois do deploy

- [x] **E-Book Uruguai** no site. Feito: PDF em `public/e-book-uruguai.pdf` (otimizado, 2,6 MB) e botão "Clique aqui e baixe o E-Book" na tela de obrigado.
- [x] Montar a agenda e enviar o **link do Calendly**. Feito: `CALENDLY_URL` em `lib/config.ts` (botão "Agende Agora" na tela de obrigado, para todos os perfis).
- [ ] Corrigir na planilha das fazendas o slug `sclo4` (letra "o") para `scl04` (zero).
- [ ] Apagar as linhas de teste na aba **LEADS**.

---

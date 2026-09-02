# Corrigir a pronúncia: voz real que sempre toca

Hoje o app usa a voz interna do navegador (`speechSynthesis`). Em muitos celulares (principalmente iPhone e navegadores dentro de apps como Instagram/TikTok) essa voz simplesmente não toca: não há voz em inglês instalada, ou o áudio fica bloqueado. Por isso você clica em "ouvir" e nada sai.

## O que vai mudar

1. **Voz de verdade gerada por IA**
   Cada frase/palavra em inglês passa a ser falada por uma voz natural gerada no servidor (Lovable AI), não mais pela voz do celular. Isso funciona igual em qualquer aparelho.

2. **Velocidade lenta para iniciantes**
   - Palavra sozinha: bem devagar.
   - Frase completa: devagar.
   - Botão "repetir palavra por palavra": cada palavra separada, com pausa, e depois a frase inteira.

3. **Sempre toca, sem travar**
   - O áudio é liberado no primeiro toque na tela (regra dos celulares).
   - Enquanto o áudio carrega, o botão mostra um indicador de "carregando".
   - Se por qualquer motivo a IA falhar, o app volta automaticamente para a voz do navegador, e só se nem isso existir mostra um aviso curto.

4. **Rápido e barato**
   As frases do curso são poucas e se repetem: o áudio já gerado fica guardado em cache, então a segunda vez toca instantaneamente.

5. **Respeita seus controles de som**
   O volume da pronúncia segue o controle de "efeitos" do painel de áudio, e a música baixa um pouco enquanto a voz fala.

## Detalhes técnicos

- Nova rota de servidor `src/routes/api/tts.ts` chamando `POST https://ai.gateway.lovable.dev/v1/audio/speech` com `model: "openai/gpt-4o-mini-tts"`, `voice: "alloy"`, `speed` ajustável e `response_format: "mp3"` (arquivo simples, mais fácil de cachear e repetir).
- Validação de entrada com Zod (texto curto, velocidade entre 0.25 e 1.0); `LOVABLE_API_KEY` só no servidor.
- Reescrita de `src/lib/speech.ts`:
  - `speakEn(text, rate)` e `speakEnWordByWord(text)` viram assíncronas, buscam o MP3 na rota, guardam o Blob URL num `Map` em memória (chave `texto|rate`) e tocam com `HTMLAudioElement`.
  - Fila interna: cancela o áudio anterior antes de tocar o novo; palavra por palavra roda em sequência com pausa de ~350 ms.
  - Fallback para `speechSynthesis` quando a requisição falha (status não-OK, 402/429 do gateway) e retorno de erro para a UI quando não há nenhuma opção.
  - Volume lido do mesmo `localStorage` já usado pelos efeitos.
- `src/routes/licao.$licaoId.tsx`: botões de áudio ganham estado `loading` (spinner no ícone) e `disabled` enquanto tocam; nenhuma mudança nas regras de vidas/XP.
- Sem alteração de banco de dados; a chave da IA já é gerenciada pela plataforma.

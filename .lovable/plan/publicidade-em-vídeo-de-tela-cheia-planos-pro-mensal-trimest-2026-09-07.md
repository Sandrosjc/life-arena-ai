# Publicidade em vídeo de tela cheia + planos Pro mensal, trimestral e anual

## O que muda

### 1. Vídeo de tela cheia (estilo Duolingo)
- Novo componente `FullscreenVideoAd`: o vídeo ocupa a tela inteira, com contador de segundos e botão de fechar que só aparece no fim. Quem é Pro nunca vê.
- O espaço já fica pronto para colar o código do **Adsterra**: um bloco marcado no código onde basta colar o script/tag da Adsterra e o vídeo real entra no ar. Enquanto não houver código, mostramos um vídeo-simulação interno (como hoje o anúncio recompensado).
- Onde aparece (padrão proposto — fácil ligar/desligar cada um):
  - **Ao acabar as vidas** — assistir devolve 1 vida (já existe; vira tela cheia).
  - **Ao terminar uma lição** — entre a comemoração e a volta à trilha, no máximo 1 a cada 2 lições para não cansar.
- Banners pequenos continuam onde estão.

### 2. Três planos Pro (cobrados em dólar, abaixo da concorrência)
Pesquisa de mercado: Super Duolingo custa ~US$ 12,60/mês no Brasil (R$ 64,89) e o anual cai na faixa de US$ 35–79/ano. Nosso posicionamento: **mais barato que o Duolingo em qualquer plano**, com gatilhos de psicologia de preço:

| Plano | Preço | Por mês | Gancho |
|---|---|---|---|
| Mensal | **US$ 4,99** | US$ 4,99 | "60% mais barato que o Duolingo" |
| Trimestral | **US$ 12,99** | US$ 4,33 | selo "popular", economize 13% |
| Anual | **US$ 39,99** | US$ 3,33 | selo "melhor oferta", economize 33% — ancorado contra o mensal |

- Anual destacado como recomendado (âncora + "preço de 1 lanche por mês").
- Preços terminados em ,99 e comparação "por mês" sempre visível.
- Na loja, a seção Pro vira um seletor com os 3 cartões; hoje o botão ativa o Pro sem cobrar — fica assim por enquanto (pagamento real entra quando você quiser ligar o Stripe/Paddle; é só pedir).

### 3. Traduções
- Todos os textos novos em PT/ES/EN.

## Detalhes técnicos
- `src/components/FullscreenVideoAd.tsx` — overlay em tela cheia (`fixed inset-0 z-[70]`), contador, botão fechar liberado no fim, recompensa ao concluir; placeholder `ADSTERRA_SNIPPET` comentado e ponto de montagem único para o script.
- `src/routes/licao.$licaoId.tsx` — dispara o vídeo ao concluir (com controle de frequência em `localStorage`, ex.: no máximo 1 a cada 2 lições).
- `src/components/HeartsDialog.tsx` — o anúncio recompensado atual passa a usar o vídeo de tela cheia.
- `src/routes/loja.tsx` — seção Pro com os três planos (`PLANS` com monthly/quarterly/yearly), selo de destaque e texto de economia; `activatePro()` registra o plano escolhido em `game.tsx` (`proPlan: "monthly" | "quarterly" | "yearly"`).
- `src/lib/i18n.tsx` — chaves novas PT/ES/EN (planos, selos, "economize X%", tela do vídeo).
- Nada de pagamento real ainda: os planos são registrados localmente; quando você pedir, conecto Stripe/Paddle com esses três preços.

## Ordem de execução
1. Vídeo de tela cheia + espaço Adsterra.
2. Três planos na loja com preços e psicologia.
3. Typecheck e teste no celular.

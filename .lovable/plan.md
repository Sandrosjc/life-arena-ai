# FluencyBR AI — app de inglês gamificado

Recomeço do zero: removo o app anterior (LifeQuest) e construo o FluencyBR AI, mobile-first, vibrante, estilo Duolingo, em português do Brasil.

## Identidade visual
- Paleta viva: verde de acerto, vermelho de erro, azul/roxo de destaque, fundo claro e limpo.
- Cantos bem arredondados, sombras suaves, botões com efeito "3D" (borda inferior) e micro-animações de acerto (pulo/verde) e erro (tremida/vermelho).
- Tipografia arredondada e forte; layout pensado para 390px e perfeito no desktop.

## Estrutura do app
Barra de status fixa no topo (em todas as telas): ofensiva em dias (fogo), até 5 corações e saldo de XP/moedas. Ao zerar corações abre o pop-up de recuperação.

Navegação inferior com 4 abas:

1. **Trilha de Aventura (Dashboard)**
   - Mapa de caminho sinuoso com nós clicáveis.
   - Módulo 1: Fundamentos Básicos · Módulo 2: Viagem e Aeroporto · Módulo 3: Inglês Corporativo.
   - Estados por fase: concluída (coroa/estrelas), disponível (destacada e pulsante), bloqueada (cadeado).

2. **Lição Interativa**
   - Barra de progresso no topo que avança a cada acerto.
   - Exercícios: múltipla escolha (tradução de frases) e blocos de arrastar/tocar para montar a frase em inglês.
   - Feedback instantâneo: painel verde com som visual de sucesso ou vermelho com tremida, -1 coração e a resposta correta.
   - Modal de conclusão: XP ganho, bônus de ofensiva e botão "Compartilhar Conquista".

3. **Simulador de Conversa com IA**
   - Interface de chat moderna com cenários reais ("Pedindo um café em Nova York", "Passando pela Alfândega", "Entrevista de emprego").
   - Balões distintos para usuário e IA, indicador de digitação, botão de áudio (visual) e feedback de pronúncia/correção da IA em português.

4. **Loja e Plano Pro**
   - Comprar vidas extras e pacotes de moedas com XP/créditos.
   - Card de anúncio recompensado: "Assistir vídeo de 30 segundos para recuperar 1 vida" (simulação com contagem regressiva).
   - Card comercial do Plano Pro: vidas ilimitadas, zero anúncios, IA de conversação ilimitada e certificado de fluência.

## Idioma e geolocalização
Interface em português por padrão; detecção automática do idioma do navegador/região para exibir a interface em português, espanhol ou inglês, com troca manual disponível.

## Detalhes técnicos
- TanStack Start + React 19 + TypeScript + Tailwind v4 + shadcn/ui; tokens de cor em `src/styles.css` (oklch), sem cores fixas nos componentes.
- Rotas: `/` (trilha), `/licao/$licaoId`, `/conversa`, `/loja`, mais layout com barra de status e navegação inferior.
- Estado do jogador (XP, corações, ofensiva, fases concluídas, Pro) em um contexto React persistido em localStorage, com regeneração de corações por tempo.
- Conteúdo das lições em arquivos TypeScript tipados (sem banco de dados nesta etapa).
- Conversa com IA via função de servidor (`createServerFn`) usando o Lovable AI Gateway; a chave fica só no servidor.
- Metadados de SEO próprios em cada rota.

## Fora do escopo desta etapa
Login/contas, pagamento real do Plano Pro e reconhecimento de voz real (o áudio é simulado visualmente). Posso adicionar depois.

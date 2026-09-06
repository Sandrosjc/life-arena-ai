# Chequetto — de bom para "o melhor curso de inglês"

## Minha nota hoje: 6,5 / 10

O que já está muito bom: a abertura com o gatinho, som e comemorações, voz real que pronuncia devagar, vidas/ofensiva/XP, loja, conversa com a IA, três idiomas automáticos e conta de verdade.

O que segura a nota:
- O curso é curto demais: 17 lições no total. Ninguém sai professor com isso.
- Não existe revisão: o que a pessoa aprende hoje nunca mais volta, então esquece.
- A tela inicial mostra tudo de uma vez (três módulos empilhados) — cansa e não diz "faça isto agora".
- A abertura de marca e os espaços de publicidade foram criados mas não aparecem em lugar nenhum.
- A tela "Meu progresso" e o botão de sair da conta ainda não existem.
- O progresso mora só no aparelho: trocar de celular apaga tudo.
- Só se escuta e se escreve. Falta falar, e falta gramática explicada em português.
- Visual sempre igual: mesmos círculos, mesmas cores, sem sensação de subir de nível.

## Plano em quatro etapas

### Etapa 1 — Fechar o que está pela metade (rápido)
- Colocar a abertura de marca no topo da trilha e os espaços de anúncio (banner e vídeo) na trilha e na loja, escondidos para quem é Pro.
- Criar a tela "Meu progresso": lições concluídas, estrelas, frases dominadas com botão de ouvir cada uma, e o botão de sair da conta.
- Salvar o progresso na conta (nuvem), não só no aparelho: quem entra em outro celular continua de onde parou.

### Etapa 2 — Aprender de verdade (o coração)
- **Revisão inteligente:** cada frase aprendida volta sozinha depois de 1 dia, 3 dias, 1 semana, 1 mês. Uma caixinha "Revisar hoje" no topo da trilha, com contagem.
- **Falar:** exercício em que a pessoa repete a frase no microfone e recebe nota de pronúncia com dicas em português.
- **Explicação em português:** antes de cada lição, um cartão curto de 30 segundos explicando a regra (ex.: "I am / You are"), com exemplos e áudio.
- **Curso completo:** crescer de 17 para cerca de 90 lições em 6 módulos — Primeiras palavras, Dia a dia, Viagem, Trabalho, Conversa livre, Inglês avançado — com dificuldade subindo devagar.
- **Teste de fim de módulo:** só passa para o próximo módulo quem acerta o teste; quem não passa recebe as lições fracas de novo.

### Etapa 3 — Vontade de voltar todo dia
- Meta diária escolhida pela pessoa (5, 10 ou 20 minutos) com anel de progresso na barra de cima.
- Lembrete e "escudo de ofensiva" para não perder a sequência.
- Ligas semanais: ranking entre alunos por XP, com subida e descida de divisão.
- Conquistas com selos (primeira semana, 100 palavras, primeiro diálogo inteiro em inglês).
- Certificado ao concluir cada módulo, bonito e compartilhável.

### Etapa 4 — Layout e cores
- Trilha em foco: mostrar só o módulo atual, com um cartão grande "Continuar" no topo e os outros módulos recolhidos.
- Cada módulo ganha sua própria cor e um cenário de fundo (casa, aeroporto, escritório), então a pessoa sente que viajou.
- Nós da trilha maiores, com o gatinho andando pelo caminho até a próxima fase.
- Modo noturno de verdade e textos maiores para leitura confortável.
- Comemoração de fim de lição em tela cheia, com o gatinho, estrelas e o total de XP.

## Detalhes técnicos
- Progresso na nuvem: tabelas `profiles`, `lesson_progress` e `phrase_reviews` no backend, com RLS por usuário e GRANTs; sincronização com o estado local já existente em `src/lib/game.tsx`.
- Revisão espaçada: intervalos SM-2 simplificados gravados em `phrase_reviews`; fila montada por data de vencimento.
- Fala: Web Speech API (reconhecimento) no aparelho, com comparação de texto tolerante já existente (`isAnswerCorrect`); sem gravação enviada ao servidor.
- Conteúdo novo em `src/lib/lessons.ts` mantendo os tipos atuais (`learn`, `listen`, `type`, escolha múltipla) e novos tipos `grammar` e `speak`.
- Novas rotas: `/progresso`, `/revisar`, `/teste/$moduloId`, `/ligas`, cada uma com seus próprios metadados.
- Cores por módulo como tokens em `src/styles.css`, sem cor fixa nos componentes.

## Ordem sugerida
Faço a Etapa 1 inteira primeiro (é o que está faltando na tela agora), depois a revisão inteligente e o exercício de falar, depois o conteúdo novo e por fim o visual. Se preferir outra ordem, é só dizer.

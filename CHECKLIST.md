# Checklist para o lançamento do 3DeTatics

O que falta para finalizar o projeto. O conteúdo do jogo (Vantagens, Desvantagens, raças, kits, magias e regras de combate) já está pronto; o que resta é a ficha, o armazenamento local, as correções e o lançamento.

Marque cada item com `[x]` ao concluir.

---

## 1. Armazenamento local (Localbase)

Todos os dados do jogador ficam no navegador, no IndexedDB, usando a biblioteca [Localbase](https://github.com/dannyconnell/localbase). Não existe servidor. As coleções ficam em [banco.ts](src/services/banco.ts) (instância única do Localbase, `VERSAO_DADOS` e gravação), com um serviço por coleção: [grupos-service.ts](src/services/grupos-service.ts), [herois-service.ts](src/services/herois-service.ts), [configuracoes-service.ts](src/services/configuracoes-service.ts) e o [backup-service.ts](src/services/backup-service.ts).

### Coleções

| Coleção | Situação | Conteúdo |
|---|---|---|
| `grupos` | existe | Grupos de heróis montados no Criador de Grupo |
| `herois` | existe | Heróis salvos individualmente, para reaproveitar em vários grupos |
| `configuracoes` | existe | Preferências do jogador (hoje: tema claro/escuro; depois: último grupo aberto, filtros, etc.) |

### Tarefas
- [x] Criar `src/services/herois-service.ts` com `listarHerois`, `obterHeroi`, `salvarHeroi` e `removerHeroi`, no mesmo padrão do serviço de grupos.
- [x] Botão "Salvar herói" em cada carta do Criador de Grupo. _(ícone de marcador no topo de cada carta)_
- [x] Página "Meus Heróis" (`/herois`): lista dos heróis salvos, com busca, editar, duplicar e excluir. _(edição em `/heroi?id=`)_
- [x] Botão "Adicionar herói salvo" no Criador de Grupo, que copia um herói da coleção `herois` para o grupo. _(menu do botão Adicionar herói)_
- [x] Definir se o herói no grupo é uma **cópia** (editar no grupo não altera o salvo) ou uma **referência** pelo `id`. Recomendado: cópia, para que um grupo antigo não mude sozinho. _(decidido: cópia com id novo)_
- [x] Adicionar um campo `versao` em todos os documentos salvos e uma função de migração ao carregar. Isso evita que grupos antigos quebrem quando a ficha ganhar campos novos (Focus, magias, kit, etc.). _(`migrarGrupo`, `migrarHeroi`, `migrarHeroiSalvo`; testado importando um grupo no formato antigo)_
- [x] Separar `criadoEm` de `atualizadoEm` em grupos e heróis. Hoje `criadoEm` é sobrescrito a cada salvamento.
- [x] Tratar erros de leitura e gravação com aviso na tela (lista, exclusão, `id` inexistente no Criador e no Editor de Herói).
- [x] **Backup:** exportar todos os grupos e heróis para um arquivo JSON e importar de volta. Sem isso, limpar os dados do navegador apaga tudo e não há como passar dados para outro aparelho. _(botão Backup em Lista de Grupos e Meus Heróis; importação mescla por id e recusa arquivos inválidos ou de versão mais nova)_
- [x] Criar a coleção `configuracoes` e guardar nela as preferências do jogador. _(feito: guarda o tema; já tem campo `versao`)_

---

## 2. Bugs da ficha e do Criador de Grupo

- [x] Com o seletor de vantagens ativo, o campo Nome fica somente leitura e não dá para digitar ([CompFichaDeHeroi.vue](src/components/CompFichaDeHeroi.vue)). _(o nome fica sempre editável)_
- [x] Ligar ou desligar o seletor apaga a ficha inteira sem confirmação (e não limpa PV e PM, o que é inconsistente). _(o assistente não apaga mais nada; só preenche ao escolher nas listas)_
- [x] As escolhas dos seletores (raça, kit, vantagens, desvantagens) não são salvas; ao reabrir um grupo, aparecem vazias. Salvar os `value` escolhidos na ficha. _(campos `raca_valor`, `kit_valor`, `vantagens_valores`, `desvantagens_valores`)_
- [x] Depois de abrir `/grupo?id=X`, clicar em "Criador de Grupo" no menu continua editando o mesmo grupo, e o próximo "Salvar" sobrescreve o grupo antigo ([CriadorDeGrupo.vue](src/pages/CriadorDeGrupo.vue)). _(o Criador reage à troca de rota)_
- [x] Os links internos do menu navegam duas vezes (`:to` e `@click`), e o link externo abre sem `noopener` ([EssentialLink.vue](src/components/EssentialLink.vue)).
- [x] A versão está fixa como "v 1.0.0" no layout; usar a versão do `package.json`.

---

## 3. Ficha e validações

A calculadora e as validações ficam em [ficha-lib.ts](src/libs/ficha-lib.ts). Os limites do jogo (por faixa, desvantagens, tamanhos de grupo) estão em tabelas no topo do arquivo, para ajustar no balanceamento.

- [x] Campos de Focus por Caminho (Água, Ar, Fogo, Luz, Terra, Trevas) na ficha. _(no Assistente; a carta mostra o Focus no bloco Magias)_
- [x] Seletor de magias na ficha (Magias Avançadas conhecidas = soma dos Focus). _(magias sem requisito cumprido aparecem desabilitadas)_
- [x] **Calculadora de pontos:** Características + Focus + raça + kit + Vantagens − Desvantagens, comparado com o PH do herói. _(com detalhamento; bônus de raça/kit, vantagens grátis, descontos de kit, itens repetíveis e de custo variável)_
- [x] PV e PM calculados automaticamente a partir da R e do multiplicador do kit (sem kit: R × 5). _(+10 por PV/PM Extras; opção "PV e PM manuais")_
- [x] Texto da carta gerado automaticamente pelo Assistente (vantagens, desvantagens, magias e o que vem de graça pela raça e pelo kit).
- [x] Bônus de raça, kit e Arcano aplicados sozinhos nos valores da carta (ex.: Elfo soma H+1; trocar de raça tira o bônus antigo), sem passar de 5.
- [x] Escolher o tamanho do grupo cria as cartas que faltam já com o PH de cada faixa (cartas sem PH ocupam as vagas primeiro; só cartas vazias excedentes são removidas).
- [x] Validações:
  - [x] limites da faixa de pontos (Características e Focus até 3, 4 ou 5);
  - [x] no máximo 3 Desvantagens e −6 pontos (sem contar as raciais);
  - [x] bônus raciais não passam de 5;
  - [x] kit repetido na mesma faixa de pontos;
  - [x] restrições de raça e kit (Boa Fama × Má Fama, Construto e Esqueleto sem magia, Arqueiro proibido para Minotauro, etc.);
  - [x] quantidade de heróis por tamanho de grupo (Novato, Lutador, Campeão, Lenda). _(seletor "Tamanho do grupo" no Criador)_
- [ ] **Revisar no playtest:** limite de 2 Vantagens para heróis de 5 pts (`LIMITES_POR_FAIXA` em [ficha-lib.ts](src/libs/ficha-lib.ts)); confirmar com o manual e ajustar se necessário.
- [x] Botão "Novo grupo" e opção "Salvar como cópia". _(menu ⋮ da barra de ações)_
- [x] Aviso ao sair da página com alterações não salvas. _(confirmação ao trocar de página e aviso do navegador ao fechar a aba)_
- [x] Testar a impressão com textos longos. _(na impressão o texto vira um bloco comum com fonte menor; a ficha avisa quando um texto não cabe na carta; impressão sempre clara, mesmo no tema escuro)_

---

## 4. Regras (pendências de texto)

- [x] "Terrenos" diz "quatro grupos", mas a lista tem 8 tipos. _(agora "oito tipos")_
- [x] As proporções de montagem de terreno somam 116% (50% + 33% + 33%); explicar se as categorias se sobrepõem. _(caixa de nota explicando a sobreposição)_
- [x] O texto cita "Regras Avançadas", que não existem: escrever a seção ou remover as menções. _(viraram referências à nova seção "5. Modos de jogo")_
- [x] Remover o bloco comentado com lorem ipsum no fim de [RegrasDoJogo.vue](src/pages/RegrasDoJogo.vue).
- [x] Corrigir o texto da página 404 ("Página ainda não está pronta...").
- [x] Opcional: modos de jogo alternativos (objetivos, cenários). _(Escaramuça, Domínio, Caça ao Líder e Batalha Real para 3–4 jogadores; revisar no playtest)_
- [x] Opcional: índice com âncoras na página de Regras.

---

## 5. Performance

- [x] Comprimir as imagens das regras (hoje ~55 MB, entre 1,8 e 6,9 MB cada). Meta: ~1200px de largura, WebP ou JPG qualidade 75, menos de 200 KB cada. _(feito com `sharp`: `npm run imagens` gera WebP em `src/assets` a partir de `assets-originais/`; 67 MB → 2,9 MB)_
- [x] Apagar os assets não usados: `codex.png`, `3detatics.png` (a menos que vire logo) e `quasar-logo-vertical.svg`. _(`quasar-logo-vertical.svg` apagado; `3detatics.png` virou a capa da página inicial; `codex.png` ficou só em `assets-originais/`)_
- [x] Adicionar `loading="lazy"` e `alt` nas `q-img`.

---

## 6. UX e código

- [x] Configurar `framework.lang: 'pt-BR'` no Quasar (tabela e diálogos ainda em inglês).
- [x] Liberar o zoom no `index.html` (remover `user-scalable=no` e `maximum-scale=1`), adicionar `<html lang="pt-BR">`, meta description e tags Open Graph.
- [x] Remover o boot `axios` e a dependência `axios`; mover os imports de imagem para `src/libs/imagens.ts`.
- [x] Remover o Pinia ou passar a usá-lo.
- [x] Limpar seções não usadas do `quasar.config.ts` (ssr, cordova, capacitor, electron, bex) e o comentário quebrado na linha 2.
- [x] Corrigir o `env.d.ts` (os `declare module '*.jpg'` estão dentro de `namespace NodeJS`).
- [x] Trocar `$q.platform.is.mobile` por CSS responsivo e os `:innerHTML` por HTML comum na página de Regras.
- [x] Testes com Vitest para a calculadora de pontos, as validações e os serviços do Localbase. _(`npm test`: 50 testes em [test/unit](test/unit), incluindo a integridade dos dados do jogo e os serviços sobre um IndexedDB simulado)_
- [ ] Rodar `npm test` e `npm run lint` automaticamente no GitHub Actions (junto com o deploy da seção 8).

---

## 7. Identidade visual e estilo (refazer)

Identidade baseada na arte de capa: azul-real, vermelhão do logo e dourado sobre pergaminho (tema claro) e "noite de campanha" (tema escuro, segue o sistema e pode ser trocado no cabeçalho). Títulos em Cinzel, texto em Nunito Sans (servidas pelo próprio site). Tokens em [app.scss](src/css/app.scss), cores de marca em [quasar.variables.scss](src/css/quasar.variables.scss). Componentes: `CabecalhoPagina`, `TituloSecao`, `ItemRegra`, `CaixaDestaque`, `ImagemExemplo`, `IndiceSecoes`, `EstadoVazio`.

### Base visual
- [x] Definir a identidade do jogo: tom (fantasia clássica, tabuleiro, pergaminho, anime/JRPG tático...) e 2 ou 3 referências visuais.
- [x] Paleta própria em [quasar.variables.scss](src/css/quasar.variables.scss): cor primária, secundária, destaque, fundo, superfície e texto; `positive`, `negative` e `warning` só para feedback, nunca para títulos.
- [x] Tipografia: uma fonte de títulos com personalidade e uma de texto legível (Google Fonts), com escala de tamanhos definida (título de página, seção, subseção, corpo, legenda).
- [x] Tokens de espaçamento, bordas e sombras reutilizáveis em [app.scss](src/css/app.scss), no lugar de estilos soltos em cada página.
- [x] Decidir se haverá tema escuro (o Quasar suporta com `Dark` plugin); se sim, definir as duas paletas desde o início.
- [ ] Logo do 3DeTatics e favicons novos. _(A arte `3detatics.png` já é a capa da página inicial; falta um logo/ícone próprio e os favicons, que ainda são os do Quasar.)_

### Layout
- [x] Refazer o [MainLayout.vue](src/layouts/MainLayout.vue): cabeçalho com logo, menu lateral com ícones e agrupamento (Regras, Heróis, Grupos), item ativo destacado.
- [x] Trocar o fundo `bg-blue` por um fundo neutro ou com textura leve.
- [x] Rodapé com créditos, aviso de projeto de fã e versão.
- [x] Revisar o comportamento no celular (menu, larguras, tamanho de fonte).

### Componentes reutilizáveis
- [x] Componente de título de página e de seção, no lugar dos blocos `text-h4 text-center text-primary` / `text-h5 text-center text-negative` repetidos.
- [x] Componente de item de regra (Vantagem, Desvantagem, raça, kit, magia) com nome, custo e etiquetas visuais (custo, requisito, alcance, duração), no lugar de parágrafos corridos.
- [x] Caixas de destaque para exemplos, notas e regras importantes.
- [x] Botões, campos e diálogos com o mesmo estilo em todo o app.

### Páginas
- [x] **Página inicial:** capa com logo, chamada curta e atalhos para Regras, Criador de Grupo e Meus Heróis, no lugar do bloco único de texto justificado.
- [x] **Regras:** índice lateral ou no topo, seções numeradas, imagens com legenda e tabelas para alcance, tamanhos de grupo e campo de batalha.
- [x] **Vantagens, Desvantagens e Magias:** busca, filtro (por custo, Caminho, tipo) e layout em cards ou lista compacta.
- [ ] **Criador de Grupo:** barra de ações fixa, resumo do grupo (pontos usados, heróis por faixa, avisos de validação) e seletores com visual integrado à carta. _(Barra fixa e resumo com PH total e heróis por faixa feitos; avisos de validação dependem da seção 3.)_
- [x] **Carta do herói (impressão):** redesenhar a carta 63 × 88 mm como um card de jogo (moldura, ícones de F/H/R/A/PdF, áreas de PV e PM marcáveis), mantendo legibilidade impressa em preto e branco.
- [ ] **Lista de Grupos e Meus Heróis:** cards com resumo (nome, quantidade de heróis, faixa de pontos) em vez de só tabela. _(Lista de Grupos feita; Meus Heróis depende da seção 1.)_
- [x] **Página 404:** no mesmo estilo do resto do site.

### Acabamento
- [x] Contraste mínimo WCAG AA em textos e botões.
- [x] Estados de carregamento, lista vazia e erro com visual próprio.
- [x] Revisão final em celular, tablet e desktop.

---

## 8. Deploy e lançamento

- [ ] Trocar o `deploy.js` por GitHub Actions publicando no GitHub Pages (hoje o script faz `git add .` e já gerou dezenas de commits "update build").
- [ ] Tirar `docs/` do repositório e colocar no `.gitignore`.
- [ ] Corrigir a dependência de `NODE_ENV=prod`: hoje um `yarn build` comum gera um site quebrado no GitHub Pages.
- [ ] Atualizar dependências dentro da mesma versão principal (Quasar, Vue).
- [ ] Marcar uma data para remover o kill-switch `public/sw.js` (3 a 6 meses após o deploy).
- [ ] Reescrever o README (sobre o jogo, como jogar, link, como contribuir).
- [ ] Adicionar LICENSE e aviso de projeto de fã no README.
- [ ] Versão `1.0.0` no `package.json` e tag no git.
- [ ] Testar o fluxo completo em celular e desktop (Chrome, Firefox, Safari): criar, salvar, reabrir, imprimir, exportar, importar e excluir.
- [ ] **Playtest:** revisar custos de kits e raças e o custo em PM das magias de área (Bola de Fogo, Terremoto, Raio Desintegrador).

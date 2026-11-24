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
- [ ] Reescrever o README (sobre o jogo, como jogar, link, como contribuir).
- [ ] Adicionar LICENSE e aviso de projeto de fã no README.
- [ ] Testar o fluxo completo em celular e desktop (Chrome, Firefox, Safari): criar, salvar, reabrir, imprimir, exportar, importar e excluir.
- [ ] **Playtest:** revisar custos de kits e raças e o custo em PM das magias de área (Bola de Fogo, Terremoto, Raio Desintegrador).

---

## 9. Revisão de coerência das regras

Revisão completa de Regras, Magias, Vantagens, Desvantagens, raças e kits, comparando com o Manual 3D&T Turbinado. Cada item traz o problema e uma **sugestão** simples. O critério foi: tudo o que o texto cita precisa existir no jogo; o que não tem uso num skirmish sai.

### 9.1 Conceitos básicos (nova seção nas Regras, antes de "Jogando")
- [x] **Testes de Característica** só são explicados na página de Magias, mas são usados em Esquiva, terrenos, escalada e várias Vantagens. **Sugestão:** regra geral nas Regras: *role 1D6; se o resultado for igual ou menor que a Característica (com bônus e redutores), passou. 6 é sempre falha.*
- [x] **Turno × ativação × rodada** aparecem misturados ("turno de ativação", "próxima ativação", "por turno"). **Sugestão:** usar só **turno** (as ações de um herói quando ele é ativado) e **rodada** (todos os heróis jogaram). Trocar "ativação" por "turno" em todos os textos.
- [x] **Tipos de dano** são usados por Armadura Extra, Vulnerabilidade, Elfo, Lanceiro, Elementalista, Esqueleto, Toque de Energia e magias, mas não estão explicados nas Regras. **Sugestão:** seção curta:
  - lista de tipos: Corte, Perfuração, Contusão, Explosão, Calor/Fogo, Frio/Gelo, Luz, Eletricidade, Vento/Som, Químico;
  - o jogador escolhe pela miniatura e anota nos campos **Dano F** e **Dano PdF** da carta (ex.: "Corte (espada)"). O tipo é fixo durante a partida;
  - **Mágico não é um tipo**: é uma propriedade que se soma ao tipo (ex.: "Perfuração, mágico"). Ataques mágicos vêm de magias, Arma Mágica, Ataque Especial e dos kits Mago e Necromante;
  - **Armadura Extra** dobra a A; **Vulnerabilidade** reduz a A à metade; **Invulnerabilidade** zera o dano (nem o dano mínimo de 1). Armadura Extra e Vulnerabilidade contra o mesmo ataque se anulam.
- [x] ~~Vantagem Adaptador~~: removida, porque o tipo de dano é fixo na carta.
- [x] **Condições**: reunir num quadro **Indefeso**, **Paralisado**, **Adormecido**, **Em Fúria**, **Invisível** e **Perto da Morte**, cada uma com seu efeito, para as Vantagens e magias apontarem para um lugar só.

### 9.2 Turnos e iniciativa
- [x] **Ordem dos turnos no modo Escaramuça não está definida**: as Regras só dizem quem joga primeiro. **Sugestão:** os jogadores **alternam um herói por vez**. Quem só tem heróis já ativados passa a vez; o outro ativa os que restam em sequência.
- [x] Iniciativa rolada só uma vez? **Sugestão:** rolar a iniciativa no **início de cada rodada** (H + 1D6 do herói de maior H, como no deploy). Empate: role de novo.

### 9.3 Combate
- [x] **Indefeso** cita "atacado pelas costas sem ter visto o atacante", mas o jogo não tem frente nem costas. **Sugestão:** tirar esse trecho. Indefeso fica só para efeitos que dizem isso (Paralisia, Sono, Terremoto...).
- [x] **Surpreso** (Radar) não existe nas Regras. **Sugestão:** remover o termo (veja Sentidos Especiais).
- [x] **Recuo de 1" após ataque corpo a corpo**: não diz o que acontece sem espaço nem se conta como movimento. **Sugestão:** *o recuo não conta como Mover e ignora custo de terreno; se não houver espaço, recua o máximo possível.*
- [x] **Esquiva**: o redutor igual à H do atacante (regra do manual) faz com que H igual nunca esquive. **Sugestão:** manter, mas colocar um exemplo no texto (H4 contra H2: precisa de 2 ou menos; H3 contra H3: impossível) para ninguém achar que é erro.
- [x] **Arremesso de arma**: não diz como recuperar a arma, e a tabela mostra alcance para F0, mas a regra exige F1. **Sugestão:** *para recuperar, encoste a base no marcador durante um Mover*. Tirar a coluna F0 da tabela.
- [x] **Perto da Morte**: "(máximo 5 PV)" é redundante, porque R nunca passa de 5. **Sugestão:** remover.
- [x] **Herói derrotado sai da mesa**, mas Erguer Mortos precisa saber onde ele caiu. **Sugestão:** *ao ser derrotado, deixe a miniatura deitada.*

### 9.4 Terrenos
- [x] **Bloqueador** diz que pode ser atravessado com "a perícia Escalar" ou "Visão de Raio-X", mas Raio-X não ajuda a mover, e escalar é regra de Elevado. **Sugestão:** *Bloqueador bloqueia visão e movimento. Levitação passa por cima; Visão de Raios-X vê através (só a visão).*
- [x] **Floresta e Difícil** citam "Arena (Lama)", "Sobrevivência (Floresta)" e "Natação". **Sugestão:** trocar por "Arena no terreno, Levitação, kit Batedor ou a Perícia adequada" (veja 9.5).
- [x] **Elevado**: a escalada pede teste de H, mas não diz o que acontece na falha. **Sugestão:** *se falhar, para no pé do terreno e perde o resto do movimento.*
- [x] **Cenário noturno**: Infravisão (várias raças) e o Elfo Negro dependem de dia/noite, que não existe. **Sugestão:** regra opcional em Modos de jogo: *Noite: linha de visão máxima de 12"; Infravisão ignora esse limite. Sem combinar, a partida é de dia.*

### 9.5 Perícias
O manual tem 11 Perícias (Animais, Arte, Ciência, Crime, Esporte, Idiomas, Investigação, Manipulação, Máquinas, Medicina e Sobrevivência), a 2 pontos cada. No 3DeTatics elas são citadas (Humano, Meio-Elfo, Goblin, Halfling, terrenos), mas não existem.
- [x] **Sugestão:** criar a Vantagem **Perícia (2 pontos cada)** só com as três que têm uso na mesa:
  - **Esporte:** escala Elevado sem teste e atravessa terreno Difícil de água sem custo extra;
  - **Sobrevivência:** ignora o custo extra de Floresta e recebe H+1 no teste de terreno Perigoso;
  - **Crime:** Emboscada: no deploy é posicionado depois de todos os outros heróis.
- [x] As outras oito não têm efeito num wargame: não entram. Humano e Meio-Elfo: "compra Perícias por 1 ponto". Goblin e Halfling: "compra Crime por 1 ponto".
- [x] Genialidade: trocar "perícias" por "testes de H fora de combate" (já está quase assim).

### 9.6 Vantagens
- [x] **Arena**: o texto diz "+2 de H em um terreno", mas os terrenos citam Arena para ignorar o custo de movimento. **Sugestão:** *escolha Floresta, Difícil, Elevado, Cobertura ou Perigoso: dentro dele o herói recebe H+2 e ignora o custo extra de movimento.*
- [x] **Arma Mágica** diz "recebe o tipo de dano Mágico". **Sugestão:** "os ataques com essa arma são mágicos (o tipo de dano continua o da carta)".
- [x] **Aparência Inofensiva**: "primeiro turno do combate" e "a mais de 12" do primeiro combate" são confusos. **Sugestão:** *o primeiro ataque corpo a corpo que o herói fizer na partida ganha um ataque extra na mesma Ação.*
- [x] **AE - Área**: não tem tamanho de área. **Sugestão:** *escolha um ponto no alcance: todos a até 3" dele são atingidos, com FA–1 a cada 1" do centro.*
- [x] **Parceiro**: "fazem uma única Ação usando a maior Característica de cada um e somam suas Vantagens" é complicado e vago. **Sugestão (usa a alternância de 9.2):** *quando um dos parceiros termina o turno, o outro pode ser ativado logo em seguida, desde que estejam a até 6" um do outro.*
- [x] **Sentidos Especiais**: Radar (Surpreso) não tem efeito; Infravisão depende do cenário noturno (9.4). **Sugestão:** remover Radar e manter os outros seis. 1 ponto = três sentidos; 2 pontos = todos.
- [x] **Toque de Energia** e **Ataque Especial** pedem escolhas (tipo de dano, F ou PdF) que não têm onde ser anotadas. **Sugestão:** o texto da carta gerado pelo Assistente mostra "Toque de Energia (tipo: ___)" e "Ataque Especial (F/PdF)" para o jogador completar.

### 9.7 Desvantagens
- [x] **Código de Honra do Combate** ("não ataca inimigo em contato de base com um aliado") e **Código dos Heróis** ("aliado Perto da Morte e em contato com inimigo") quase nunca acontecem, por causa do recuo de 1". **Sugestão:** *Combate: não ataca inimigo Indefeso nem um que já foi atacado corpo a corpo por um aliado nesta rodada. Heróis: se um aliado a até 6" estiver Perto da Morte, deve atacar o inimigo mais próximo desse aliado.*
- [x] **Vulnerabilidade (prata)** do Licantropo: prata não existe no jogo. **Sugestão:** remover "prata".

### 9.8 Raças
- [x] **Anão:** "H+1 contra orcs, goblinoides e trolls", raças que não existem. **Sugestão:** "contra Goblins, Meio-Orcs e Ogres".
- [x] **Anfíbio:** "Radar (dentro de água)". **Sugestão:** trocar por "+2" de movimento dentro de terreno com água".
- [x] **Centauro:** "F+1 em testes de empurrar e carregar": esses testes não existem. **Sugestão:** remover.
- [x] **Construto e Esqueleto:** "magias mentais (com Telepatia)": Telepatia não existe. **Sugestão:** "imune a venenos e às magias Sono e Pânico". Construto: "não recupera PV por cura ou magia" (tirar "itens", que não existem).
- [x] **Esqueleto:** "Invulnerabilidade (frio/gelo)" passa a existir com 9.1. "Não pode ser ressuscitado": não há ressurreição no jogo, então remover.
- [x] **Elfo Negro:** "-1 em todas as Características em cenários diurnos" faria o herói jogar sempre penalizado, porque o padrão é dia. **Sugestão:** "de dia, sofre H-1". Revisar o custo no playtest.
- [x] **Goblin:** "Não pode ser mago" é ambíguo. **Sugestão:** "não pode ter o kit Mago; só usa magia com Clericato, Focus máximo 2 e nunca em Luz".
- [x] **Licantropo:** a transformação não está clara. **Sugestão:** *ao entrar em Fúria se transforma: F+1, A+1 e Monstruoso até a Fúria acabar.*
- [x] **Gnomo:** "magias de ilusão" é vago. **Sugestão:** "Ilusão, Imagem Turva e Invisibilidade custam 1PM a menos".

### 9.9 Kits
- [x] **Ladino:** Ataque Furtivo contra inimigo "em contato de base com outro aliado" tem o mesmo problema do recuo. **Sugestão:** "contra inimigos Indefesos ou já atacados corpo a corpo por um aliado nesta rodada".
- [x] **Elementalista:** deixar claro que o elemento escolhido é anotado nos campos Dano F e Dano PdF da carta.

### 9.10 Magias
- [x] **Magias Avançadas bloqueadas** (dúvida de jogador): explicar que **a soma dos Focus diz quantas** Avançadas o herói conhece e **o Focus em cada Caminho diz quais**. Exemplo na página: *só com Arcano x1, o herói tem Focus 1 em tudo: conhece as Iniciais, pode escolher até 6 Avançadas, mas toda Avançada pede Focus 2 ou mais num Caminho. Compre Focus no Caminho desejado.*
- [x] **Seletor de magias da ficha:** mostrar o requisito ao lado de cada magia (ex.: "Bola de Fogo — Fogo 3") e uma dica quando nenhuma estiver disponível.

### 9.11 Ficha e calculadora
- [x] **Druida:** Arena (Floresta) grátis não está em `vantagensGratis` ([kits-lib.ts](src/libs/kits-lib.ts)), então a calculadora cobra por ela.
- [x] **Elementalista:** Armadura Extra grátis contra o elemento também não está em `vantagensGratis`.
- [x] **Genialidade:** a validação "apenas um herói por grupo" não existe.
- [x] **Goblin sem Focus em Luz:** a validação não existe.
- [x] Depois das mudanças de texto, atualizar os testes de integridade dos dados ([test/unit](test/unit)).

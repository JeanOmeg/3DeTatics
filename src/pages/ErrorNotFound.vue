<template>
  <q-page class="pagina pagina-404">
    <div class="pagina-404__codigo">
      404
    </div>
    <h1 class="titulo-pagina">
      Esta trilha não leva a lugar nenhum
    </h1>
    <p class="pagina-404__texto">
      A página que você procura não existe ou mudou de endereço.
    </p>
    <div class="pagina-404__acoes">
      <q-btn
        unelevated
        no-caps
        color="primary"
        icon="home"
        label="Página inicial"
        to="/"
      />
      <q-btn
        outline
        no-caps
        color="primary"
        icon="menu_book"
        label="Regras do jogo"
        to="/regras"
      />
    </div>
  </q-page>
</template>

<style scoped lang="scss">
.pagina-404 {
  text-align: center;
  padding-top: var(--esp-7);
}

.pagina-404__codigo {
  font-family: var(--fonte-titulo);
  font-size: clamp(5rem, 20vw, 9rem);
  font-weight: 700;
  line-height: 1;
  color: var(--cor-destaque);
  opacity: 0.85;
}

.pagina-404__texto {
  margin: var(--esp-3) auto var(--esp-5);
  color: var(--cor-texto-suave);
}

.pagina-404__acoes {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--esp-3);
}
</style>

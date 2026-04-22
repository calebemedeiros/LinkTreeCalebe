# Guia de Conteudo

## Objetivo da pagina
Esta pagina funciona como bio-link politico premium de Calebe Medeiros.
Ela deve parecer o link principal das redes sociais: escaneavel, rapido, mobile-first
e com linguagem visual politica implicita, sem se confundir com material partidario oficial.

## Direcao visual oficial
- A base do projeto deve ser azul suave, com superficies claras e leves.
- Verde e azul organizam a atmosfera principal do projeto.
- Amarelo entra como destaque de energia visual e vermelho como apoio de tensao e enfase.
- Nao citar siglas, nomes partidarios, simbolos ou referencias textuais explicitas.
- O reconhecimento politico deve acontecer por atmosfera e contraste, nao por branding exposto.

## Ordem recomendada dos CTAs
1. Visao para o DF
2. Instagram
3. Instagram DM para contato institucional
4. Artigos e reflexoes
5. Projetos / ideias aplicadas

## Regras de microcopy
- Priorize verbos de acao claros e curtos.
- Evite slogans fechados, promessas eleitorais e pedidos explicitos de voto.
- Mantenha tom politico-profissional, direto e escaneavel.
- Sempre explique em uma linha por que cada clique vale a pena.
- No mobile, prefira frases curtas e promessa clara por clique.

## Atualizacao de links
- Edite apenas os `href` em [index.html](../index.html).
- Preserve `target="_blank"` e `rel="noopener noreferrer"` nos links externos.
- Mantenha os atributos `data-track`, `data-tier` e `data-cta-position` nos links.
- O CTA de visao permanece apontando para o site externo principal.
- O CTA de contato institucional usa Instagram DM nesta fase.

## Contrato de analytics
- O `script.js` deve continuar desacoplado de qualquer provedor especifico.
- Eventos iniciais: `page_view`, `hero_view`, `section_view`, `cta_visible`, `cta_click`, `first_cta_click`, `scroll_50`, `scroll_90`, `time_15s`, `time_30s`, `return_top`, `page_reengaged`.
- A fila local de eventos pode ser lida em `window.__cmAnalyticsQueue`.
- Integracoes futuras devem preferir `window.__cmTrack` ou um adaptador em `window.__cmAnalytics.track`.

## Ativos visuais esperados
- `assets/avatar.png`: retrato institucional principal da pagina.
- `assets/favicon.png`: favicon dedicado com base azul e identidade politica implicita.
- `assets/social-preview.png`: imagem horizontal para Open Graph e Twitter card sem texto partidario.

## Evolucoes previstas
- Inserir analytics por clique usando os `data-track`.
- Adicionar formulario de contato institucional.
- Publicar paginas internas para "Quem sou" e "Ideias para o DF".
- Ligar a camada de eventos a GA4, Plausible ou Umami sem reescrever o front.

# La Morocha Tattoo

Site estático reorganizado e pronto para edição ou publicação.

## Estrutura

- `index.html`: conteúdo e estrutura da página
- `css/header-footer.css`: estilos globais, cabeçalho, rodapé, botões e responsividade base
- `css/style.css`: estilos das seções da página
- `js/header-footer.js`: menu, cabeçalho, navegação ativa e ano do rodapé
- `js/script.js`: acordeão e animações de entrada
- `js/google-reviews.js`: widget de avaliações do Google (ver seção abaixo)
- `assets/images`: imagens do site

## Avaliações do Google

A seção "O que dizem no Google" (`#avaliacoes`) busca as avaliações reais do
perfil da empresa no Google e as exibe automaticamente na página. Enquanto não
for configurada, a seção mostra um bloco alternativo com um link para o perfil
no Google, sem quebrar o layout.

As avaliações vêm do [Featurable](https://featurable.com) (plano gratuito,
sem API key do Google). Para ativar:

1. Crie uma conta gratuita em https://featurable.com e conecte o perfil do
   Google da La Morocha Tattoo
2. Crie um widget e copie o **Widget ID** (Embed > API)
3. Cole o ID no atributo `data-featurable-id` da seção
   `<section data-google-reviews>` em `index.html`

Use `example` como ID para testar o visual com avaliações fictícias.

Depois de configurado, o widget carrega a nota média, o número de avaliações e
até 6 comentários reais assim que a seção entra na tela, com o visual do
próprio site — e atualiza automaticamente os dados estruturados (JSON-LD) da
página com a nota real. Para escolher quais avaliações aparecem primeiro ou
ocultar alguma, use "fixar" / "ocultar" no painel do Featurable.

## Próximos passos combinados

- Substituir `assets/images/hero-mobile.png` (hoje um arquivo de baixa
  resolução, não utilizado) por um recorte vertical em boa qualidade, se
  quiser uma imagem dedicada para celular
- Enviar endereço e horário de atendimento, caso queiram aparecer nos dados
  estruturados de SEO local (`business-jsonld` em `index.html`)

## Visualizar localmente

Abra o `index.html` diretamente no navegador ou inicie um servidor local na
pasta do projeto.

Exemplo com Python:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

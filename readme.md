# Projeto Scraper com Node.js

## Introdução

Este projeto é um scraper simples desenvolvido com **Node.js** que acessa a página inicial do site **Globo** e coleta os posts mais recentes. Utilizando as bibliotecas **Axios** para realizar as requisições HTTP e **Cheerio** para parsear o HTML e extrair os dados, o scraper recupera os títulos e links de postagens.

## Estrutura do Projeto

A estrutura do projeto está organizada da seguinte maneira:

```
.
├── index.js            # Arquivo principal que inicializa o servidor
├── package.json        # Dependências e configurações do projeto
├── package-lock.json   # Lock file para garantir versões consistentes
└── src
    ├── app.js          # Arquivo de configuração do Express
    ├── routes          # Diretório de rotas
    │   └── posts.js    # Rota que lida com as requisições de posts
    └── services        # Diretório de serviços
        └── scraper.js  # Serviço que executa o scraping

```

### Descrição dos Arquivos

#### `index.js`

Este é o ponto de entrada da aplicação. Ele importa o aplicativo Express configurado no arquivo `src/app.js` e inicializa o servidor na porta 3000.

```javascript
const app = require('./src/app');

const port = 3000;

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}/posts`);
});

```

#### `src/app.js`

O arquivo `app.js` configura o servidor Express e importa as rotas do arquivo `src/routes/posts.js`.

```javascript
const express = require('express');
const postsRoute = require('./routes/posts');

const app = express();

app.use(postsRoute);

module.exports = app;

```

#### `src/routes/posts.js`

Este arquivo define a rota `/posts` que é responsável por retornar a lista de posts extraída pelo scraper. A requisição é tratada pela função `scrapPosts()` importada do serviço `src/services/scraper.js`.

```javascript
const express = require('express');
const { scrapPosts } = require('../services/scraper');

const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await scrapPosts();
    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({
      message: 'Ocorreu um erro ao buscar os posts',
      error: error.message
    });
  }
});

module.exports = router;

```

#### `src/services/scraper.js`

O arquivo `scraper.js` é o serviço responsável por fazer o scraping da página inicial do site **Globo**. Ele usa **Axios** para fazer a requisição HTTP e **Cheerio** para parsear o HTML e extrair os dados desejados (títulos e links dos posts).

```javascript
const axios = require('axios');
const cheerio = require('cheerio');

const URL = 'https://www.globo.com';

async function scrapPosts() {
  try {
    const response = await axios.get(URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const posts = [];

    $(".post-row.with-6-posts .post").each(function () {
      const url = $(this).find(".post__link").attr("href");
      const title = $(this).find(".post__title").text().trim();
      if (url && title) {
        posts.push({ url, title });
      }
    });

    return posts;

  } catch (error) {
    console.error('Error during scraping:', error.message);
    throw new Error('Failed to scrape posts');
  }
}

module.exports = { scrapPosts };

```

#### Dependências

-   **axios**: Biblioteca para fazer requisições HTTP.
-   **cheerio**: Biblioteca de manipulação de HTML que simula o jQuery para facilitar o scraping.

### Instalação

Para rodar o projeto localmente, siga os passos abaixo:

1.  Clone o repositório:
    
    ```bash
    git clone https://github.com/esscova/scraper-globo.git
    cd scraper-globo
    
    ```
    
2.  Instale as dependências do projeto:
    
    ```bash
    npm install
    
    ```
    
3.  Inicie o servidor:
    
    ```bash
    npm start
    
    ```
    

O servidor estará rodando em `http://localhost:3000/posts`, e a resposta será uma lista de posts extraída da página principal da Globo.

### Exemplo de Resposta

A resposta para a requisição GET em `/posts` será um JSON com os títulos e URLs dos posts:

```json
{
  "posts": [
    {
      "url": "/link-do-post-1",
      "title": "Título do Post 1"
    },
    {
      "url": "/link-do-post-2",
      "title": "Título do Post 2"
    }
  ]
}

```

### Tratamento de Erros

Caso ocorra algum erro ao tentar buscar os posts (ex: erro de rede ou mudança na estrutura do site), o servidor retornará uma resposta com o status HTTP 500 e uma mensagem de erro detalhada:

```json
{
  "message": "Ocorreu um erro ao buscar os posts",
  "error": "Detalhes do erro"
}

```

### Considerações Finais

Este projeto é um exemplo simples de como utilizar Node.js, Express, Axios e Cheerio para criar um scraper de um site. Ele pode ser expandido para incluir mais funcionalidades, como scraping de múltiplas páginas ou a adição de novos serviços.

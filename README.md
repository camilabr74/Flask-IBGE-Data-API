# Flask-IBGE-Data-API

Este projeto é uma API desenvolvida em Flask para consumir dados da API do IBGE, especificamente os parâmetros de Países e Indicadores.

### **Status: Em construção**  👷‍♀️ :construction:

## Índice

- [Introdução](#introdução)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [Agradecimentos](#Agradecimentos)
- [Licença](#licença)

## Introdução

A API Flask-IBGE-Data-API foi desenvolvida para criar um índice que permite visualizar os dados da API do IBGE (Instituto Brasileiro de Geografia e Estatística). Este projeto facilita o acesso e a apresentação dos dados fornecidos pelo IBGE, oferecendo uma interface para visualização direta.

## Instalação

Para começar a usar este projeto, siga as etapas abaixo:

1. Clone o repositório:
   ```bash
   git clone git@github.com:camilabr74/Flask-IBGE-Data-API.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
   cd Flask-IBGE-Data-API
   ```
3. Crie um ambiente virtual:
   ```bash
   python -m venv venv
   ```
4. Ative o ambiente virtual:
   - No Windows:
     ```bash
     venv\Scripts\activate
     ```
   - No macOS/Linux:
     ```bash
     source venv/bin/activate
     ```
5. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

## Configuração

Antes de iniciar a aplicação, configure as variáveis de ambiente necessárias. Você pode criar um arquivo `.env` na raiz do projeto e definir as variáveis conforme necessário.

## Uso

Para iniciar a aplicação Flask, execute:

```bash
flask run
```

A API estará disponível em `http://localhost:5000`.

## Agradecimentos
Gostaria de agradecer ao meu branch (mentor), Bob Marley Wendell, por sua orientação e suporte durante o desenvolvimento deste projeto.

## Licença
Este projeto está licenciado sob a Licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

Em desenvolvimento por Camis2 🧡

# Documentação de Arquitetura - Portal 923A

Este documento descreve as decisões arquiteturais, o fluxo de dados e a organização das camadas lógicas do Portal 923A.

## 🏢 1. Padrão Arquitetural
O sistema adota uma arquitetura **Cliente-Servidor (Client-Server)** baseada no modelo **MVC (Model-View-Controller)** no backend, combinada com o padrão **RAG (Retrieval-Augmented Generation)** para o funcionamento da Inteligência Artificial.

As responsabilidades são divididas em 3 camadas principais:

### Camada de Apresentação (Frontend)
* **Tecnologias:** React 19, Vite, CSS Modules/Puro.
* **Responsabilidade:** Renderizar a interface, capturar eventos de clique/digitação (formulários e chat), gerenciar o estado da sessão (Token JWT) e o roteamento no lado do cliente.

### Camada de Lógica de Negócios (Backend)
* **Tecnologias:** Node.js, Express, LangChain.
* **Responsabilidade:** Receber requisições HTTP, aplicar middlewares de segurança (autenticação JWT), orquestrar fluxos com o banco de dados (`authController`) e processar as perguntas para a IA (`chatController`).

### Camada de Persistência e Dados
* **Tecnologias:** SQLite local e Memory Vector Store.
* **Responsabilidade:** 1. Armazenar contas de usuário e senhas seguras (`database.sqlite`).
  2. Carregar o arquivo estático `dados.json` para a memória, permitindo que o LangChain faça buscas vetoriais.

---

## 🔄 2. Fluxo de Dados (Data Flow)

### Fluxo de Autenticação
1. **Cliente:** O componente `<Login />` envia um `POST /api/login` com `{ email, senha }`.
2. **Servidor:** `authController` busca o e-mail no SQLite.
3. **Servidor:** Usa `bcrypt.compare()` para validar a senha. Se sucesso, assina um Token JWT com o `JWT_SECRET`.
4. **Resposta:** Retorna o token para o Cliente, que o armazena e libera a navegação para o painel.

### Fluxo de Inteligência Artificial (RAG)
1. **Cliente:** Usuário digita a dúvida no `<ChatArea />` e envia `POST /api/chat`.
2. **Middleware:** Intercepta a rota para garantir que o JWT no cabeçalho `Authorization` é válido.
3. **Controlador:** O `chatController` repassa a pergunta para a configuração de IA (`ai.js`).
4. **Embeddings:** O LangChain (via `@xenova/transformers`) transforma a pergunta do usuário em vetores matemáticos.
5. **Recuperação (Retrieval):** O modelo consulta o Vector Store em memória gerado a partir do `dados.json` para achar os dados mais similares à pergunta.
6. **Geração (Generation):** A API do Groq recebe um prompt com a Regra ("Use este contexto para responder") + Contexto do JSON + Pergunta do aluno.
7. **Resposta:** A string processada retorna para o Express, que devolve ao React, renderizando o balão de fala.

---

## 🧩 3. Diagrama de Componentes

O projeto está encapsulado em dois blocos principais que se comunicam via rede:

* **hound-ai-web (Frontend)**
  * `App` (Roteador central)
    * `Layout` / `ThemeContext`
      * `Login` / `Register` (Abas de Autenticação)
      * `Sidebar` (Visualização estática dos horários)
      * `ChatArea` (Interface de comunicação com NLP)

* **hound-ai-back (Backend)**
  * `server.js` (Ponto de montagem da porta e middlewares)
    * `routes.js` (Definição de caminhos da API REST)
      * `authController` <-> `database.js` <-> `database.sqlite`
      * `chatController` <-> `ai.js` <-> LangChain / Groq / `dados.json`

## ⚙️ 4. Justificativa das Tecnologias
* **Node + React:** Utilização da mesma linguagem (JavaScript/ES Modules) em todo o ciclo de desenvolvimento, diminuindo a curva de aprendizado da equipe.
* **SQLite:** Elimina a necessidade de servidores de banco de dados separados para validação de MVP, reduzindo a complexidade de deploy.
* **LangChain + RAG Local:** Permite a IA ter conhecimento específico sobre a turma (que os modelos comuns como o ChatGPT não possuem) de forma rápida e controlada, sem expor os dados para treinamento público.
# Portal Acadêmico Integrado — Turma 923A (IFAL)
### Engenharia de Software, Gestão de Cronogramas e Inteligência Artificial com Arquitetura RAG

O **Portal 923A** é uma solução Full Stack corporativa e acadêmica projetada para centralizar, monitorar e otimizar a rotina letiva dos estudantes do Curso Técnico em Desenvolvimento de Sistemas do Instituto Federal de Alagoas (IFAL). 

A plataforma resolve o problema crônico da fragmentação de informações (prazos, entregas, contraturnos e avaliações) através de uma interface reativa que integra um **Mecanismo de Inteligência Artificial baseado em RAG (Retrieval-Augmented Generation)**. O assistente cognitivo consome uma base de dados determinística em formato JSON e responde de forma humanizada a consultas complexas sobre o calendário da turma.

---

## 1. Escopo do Projeto

* **O que está incluído:**
  * Sistema de Autenticação (Cadastro e Login) com encriptação de senhas (`bcrypt`).
  * Painel de controle (Dashboard) com exibição da grade horária e alertas de contraturno.
  * ChatBot inteligente integrado com LangChain e modelos LLM para leitura da base de conhecimento da turma (`dados.json`).
* **O que está excluído:**
  * Envio/Upload de trabalhos pela plataforma (o sistema é estritamente informativo).
  * Lançamento de notas ou faltas (função exclusiva do sistema oficial do IFAL).
  * Chat em tempo real entre alunos (mensageria humana).
* **Limitações conhecidas:**
  * O assistente virtual depende da atualização manual do arquivo `dados.json` para conhecer novas datas.
  * Necessita de conexão à internet para comunicar com a API da Groq.

---

## 2. Personas e Casos de Uso

Para guiar o desenvolvimento, definimos 3 personas interagindo com o sistema:
1. **João (O Aluno):** Esquece prazos facilmente. Precisa do chat de IA para perguntar de forma rápida "Quando é a prova de Física?".
2. **Maria (A Representante):** Organizada, acessa a plataforma para confirmar as grades de horários e repassar os avisos no grupo da turma.
3. **Prof. Carlos (Docente):** Quer verificar em quais dias e horários ele dá aula e o que o sistema informa sobre suas avaliações.

### 📝 Histórias de Usuário Principais
* **UC-01 (Cadastro):** *Como* aluno não cadastrado, *quero* me registrar informando minha matrícula e senha *para* ter acesso ao portal restrito. (Critério de aceitação: E-mail único, senha com hash).
* **UC-02 (Autenticação):** *Como* aluno, *quero* fazer login seguro *para* acessar a área do chat. (Critério de aceitação: Geração de Token JWT válido).
* **UC-03 (Consulta de Grade):** *Como* usuário logado, *quero* visualizar minha grade semanal *para* saber se tenho contraturno. (Critério de aceitação: Interface renderizar os dias da semana corretamente).
* **UC-04 (Consulta com IA):** *Como* estudante, *quero* perguntar à IA sobre trabalhos *para* receber uma resposta imediata. (Critério de aceitação: A IA deve ler o `dados.json` e responder sem inventar informações/alucinar).

---

## 3. Arquitetura do Sistema e Fluxo de Dados

O projeto adota uma arquitetura **Cliente-Servidor (Client-Server)** baseada no modelo **MVC** no backend.

```text
[ Camada de Apresentação ]       [ Camada de Aplicação ]       [ Persistência & Vetores ]
   React 19 / Vite SPA                 Express 5 API             SQLite3 (User Auth)
         │                                   │                           │
         ├─── (Autenticação JWT) ───────────►│◄─── (Query / Hash) ───────┘
         │                                   │
         └─── (Prompt do Aluno) ────────────►│─── (Embeddings Locais Xenova)
                                             │              │
                                             ▼              ▼
                                        [ LangChain ] ◄──► [ Memory Vector Store ]
                                             │               (dados.json Indexado)
                                             ▼
                                     [ Groq Inference ]

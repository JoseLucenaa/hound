# Hound: Inteligência Artificial para Saúde e Triagem Animal
Este documento contém a especificação técnica e o planejamento estratégico para o desenvolvimento do **Hound**, uma plataforma web baseada em Inteligência Artificial para triagem de sintomas de animais de estimação, auxiliando tutores a compreenderem melhor as condições de saúde de seus pets e conectando-os ao cuidado veterinário adequado.
## 1. APRESENTAÇÃO DO PROJETO INICIAL
### 1.1. Objetivo
 * **Qual problema o projeto resolve?** Tutores de pets frequentemente enfrentam momentos de desespero quando seus animais apresentam sintomas anômalos fora do horário comercial ou em fins de semana. A busca por sintomas em motores convencionais de pesquisa (como o Google) costuma gerar diagnósticos alarmistas, errados e perigosos. Além disso, muitos adiam idas necessárias ao veterinário por falta de clareza na gravidade da situação, enquanto outros superlotam clínicas de emergência com questões simples de manejo.
 * **Por que é importante?**
   O **Hound** oferece uma triagem preliminar baseada em Inteligência Artificial generativa, agindo como um "pré-veterinário" acessível. O sistema organiza as informações fornecidas pelo tutor, traduz sintomas de forma humanizada, gera um pré-relatório estruturado que pode ser compartilhado com o veterinário real e orienta se o caso exige atendimento emergencial, consulta agendada ou apenas monitoramento doméstico básico. Isso otimiza o tempo do profissional e salva vidas animais pela agilidade na tomada de decisão.
### 1.2. Escopo do Projeto
#### O que está incluído (In-Scope):
 * **Módulo de Cadastro de Pets**: Registro de dados vitais do animal (nome, espécie, raça, idade, peso, alergias e condições preexistentes).
 * **Módulo de Triagem Inteligente**: Chatbot especializado que coleta sintomas descritos pelo tutor e gera uma análise de probabilidade de quadros clínicos (com disclaimers explícitos).
 * **Classificação de Gravidade (Triage Score)**: Identificação visual por cores (Vermelho: Emergência, Amarelo: Atenção, Verde: Monitoramento).
 * **Módulo de Histórico**: Linha do tempo contendo todas as triagens passadas feitas para cada pet cadastrado.
 * **Exportação de Relatório de Triagem**: Geração de um PDF consolidando a conversa e a triagem para apresentação direta ao médico veterinário.
#### O que está excluído (Out-of-Scope):
 * **Receituário Médico**: O sistema **nunca** indicará doses de medicamentos, substâncias ativas ou tratamentos farmacológicos específicos.
 * **Diagnóstico Definitivo**: O Hound é uma ferramenta de triagem e não substitui de forma alguma o diagnóstico físico ou laboratorial realizado por um profissional habilitado.
 * **Telemedicina/Consultas síncronas**: Chat direto com veterinários humanos em tempo real (fora do escopo deste MVP).
#### Limitações conhecidas:
 * **Alucinações de IA**: Como qualquer modelo LLM, há possibilidade de inferências incorretas caso as informações fornecidas pelo usuário sejam ambíguas ou falsas.
 * **Limitação Física**: A impossibilidade de realizar exames de palpação, ausculta e testes laboratoriais restringe o diagnóstico de precisão da IA.
### 1.3. Casos de Uso Principais
```
                 +-----------------------------------+

| HOUND |
| :--- |
| +---------------------------+ |
|  | UC01: Cadastrar Pet |  |
| +---------------------------+ |
| ^ |
|  | (inclui) |
| +---------------------------+ | <br> +----->    |   | UC02: Realizar Triagem    |   |
|  | +---------------------------+ | <br> Tutor         |                 |                 | <br> (Ator)         |                 v (estende)       |
|  | +---------------------------+ | <br> +----->    |   | UC03: Exportar Relatório  |   |
|  | +---------------------------+ |
| :--- | :--- | <br> +----->    |   | UC04: Consultar Histórico |   |

                 +-----------------------------------+
```
#### UC01: Cadastrar Novo Pet
 * **Ator Principal**: Tutor.
 * **Fluxo Principal**:
   1. O usuário acessa a dashboard e clica em "Adicionar Pet".
   2. O sistema exibe um formulário solicitando Nome, Espécie (Cão/Gato), Raça, Idade, Peso e Histórico Médico.
   3. O usuário preenche as informações e clica em "Salvar".
   4. O sistema valida os campos, armazena no banco de dados e exibe a confirmação de criação com sucesso.
 * **Fluxo Alternativo (Espécie não listada)**: Se o usuário selecionar "Outros", o sistema permite a inserção manual da espécie e raça, sinalizando que a IA de triagem é mais otimizada para cães e gatos domésticos.
#### UC02: Realizar Triagem de Sintomas
 * **Ator Principal**: Tutor.
 * **Pré-condições**: O usuário deve ter pelo menos um pet cadastrado.
 * **Fluxo Principal**:
   1. O usuário seleciona o pet e clica em "Iniciar Nova Triagem".
   2. O sistema inicia o chat interativo perguntando qual o principal sintoma observado.
   3. O usuário descreve os sintomas em linguagem natural (ex: "Meu cachorro está vomitando uma espuma amarela e parece muito triste hoje").
   4. A IA processa a entrada, faz perguntas de acompanhamento refinadas (máximo 3 perguntas para evitar atrito).
   5. A IA gera um relatório de triagem contendo: Hipóteses prováveis, Nível de Alerta (Verde/Amarelo/Vermelho) e Próximos Passos recomendados.
 * **Fluxo Alternativo (Emergência Crítica)**: Se o usuário mencionar sintomas de trauma grave (ex: atropelamento, envenenamento imediato), a IA interrompe o questionário, exibe imediatamente o Alerta Vermelho e instrui a busca imediata por uma clínica emergencial.
#### UC03: Exportar Relatório de Triagem para PDF
 * **Ator Principal**: Tutor.
 * **Fluxo Principal**:
   1. Após o encerramento de uma triagem, o usuário clica em "Gerar PDF para o Veterinário".
   2. O sistema coleta as respostas da triagem, os dados biométricos do pet e a análise gerada pela IA.
   3. O sistema renderiza um arquivo PDF formatado e limpo.
   4. O download do arquivo inicia automaticamente no dispositivo do usuário.
#### UC04: Consultar Histórico de Triagens
 * **Ator Principal**: Tutor.
 * **Fluxo Principal**:
   1. O usuário acessa a página de perfil ou histórico do pet.
   2. O sistema carrega uma lista cronológica de todas as triagens já efetuadas.
   3. O usuário clica em uma triagem específica para ler a conversa completa e as recomendações geradas anteriormente.
### 1.4. Arquitetura do Sistema e Fluxo de Dados
O Hound adota uma arquitetura de camadas moderna e desacoplada, utilizando um padrão de comunicação RESTful e integração com serviços de inteligência artificial na nuvem.
#### Componentes e Camadas do Sistema:
 1. **Camada de Apresentação (Frontend)**:
   * Desenvolvida em **React (Single Page Application)** com **Tailwind CSS**.
   * Interfaces altamente responsivas para desktop e dispositivos mobile.
   * Consome a API do Backend via requisições assíncronas (Axios/Fetch).
 2. **Camada de Aplicação (Backend API)**:
   * Desenvolvida em **Python com FastAPI** ou **Node.js com Express**.
   * Responsável pelas rotas de CRUD de Pets, controle de Sessões e Autenticação.
   * Atua como barreira de segurança e orquestrador de chamadas para as APIs de IA.
 3. **Camada de Integração de IA**:
   * **Gemini SDK**: Interfere as mensagens do usuário diretamente à API do Gemini (gemini-2.5-flash-preview-09-2025) usando engenharia de prompt especializada para garantir respostas amigáveis, precisas e seguras sob a ótica veterinária.
 4. **Camada de Persistência (Banco de Dados)**:
   * Banco de dados relacional **PostgreSQL** para armazenar os usuários, perfis de pets e referências das sessões de chat.
#### Diagrama de Arquitetura:
```
+--------------------------------------------------------------+
|                    CLIENT (Navegador/Celular)                |
|               [ Frontend React.js + Tailwind CSS ]           |
+--------------------------------------------------------------+
                                |  (Requisições HTTP/JSON)
                                v
+--------------------------------------------------------------+
|                      BACKEND API SERVER                      |
|                      [ Python / FastAPI ]                    |
+--------------------------------------------------------------+
             /                                    \
            / (Query/Save)                         \ (Prompt / JSON payload)
           v                                        v
+----------------------+                 +-----------------------+
|  DATABASE (Postgres) |                 |    GOOGLE GEMINI API  |
| [Users, Pets, Logs]  |                 |  [Análise de Triagem] |
+----------------------+                 +-----------------------+
```
### 1.5. Tecnologia Escolhida e Justificativa
 * **Frontend**: **React.js & Tailwind CSS**
   * *Justificativa*: React permite a criação de interfaces ricas, reativas e modulares ideais para sistemas de chat interativos. O Tailwind CSS assegura o design responsivo nativo, crucial para tutores acessando o app pelo celular com pressa.
 * **Backend**: **FastAPI (Python)**
   * *Justificativa*: Python é a linguagem líder em ecossistemas de Inteligência Artificial e possui integração nativa simplificada com o SDK da Google. O FastAPI fornece alto desempenho, documentação automática de rotas via Swagger e facilidade de desenvolvimento.
 * **Banco de Dados**: **PostgreSQL**
   * *Justificativa*: Ideal para garantir a integridade dos dados através de relacionamentos fortes (User -> Pets -> Triagens) e possui excelente suporte em todas as plataformas cloud gratuitas/trial.
 * **Inteligência Artificial**: **API do Google Gemini (Modelo 2.5 Flash)**
   * *Justificativa*: Excelente tempo de resposta e excelente custo-benefício em processamento de linguagem natural estruturada, permitindo configurar instruções do sistema (*system instructions*) rígidas para que a IA se comporte estritamente como um assistente de triagem de triagem animal prévia.
## 2. REPOSITÓRIO GIT COMPARTILHADO E PROJETO DOCKER
A estrutura do repositório foi planejada para garantir escalabilidade, portabilidade em contêineres e um processo simples de deploy em serviços SaaS (Render/Railway).
### 2.1. Estrutura de Diretórios Recomendada
```text
hound/
├── .gitignore
├── README.md
├── docker-compose.yml
├── docs/
│   ├── arquitetura.png
│   └── casos_de_uso.md
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── src/
└── backend/
    ├── Dockerfile
    ├── requirements.txt
    ├── main.py
    └── app/
        ├── database.py
        ├── models.py
        └── ai_service.py
```
### 2.2. Arquivos de Configuração de Ambientes Isolados (Docker)
#### Backend Dockerfile (backend/Dockerfile):
```dockerfile
FROM python:3.11-slim
WORKDIR /app
# Instala dependências do sistema necessárias
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```
#### Frontend Dockerfile (frontend/Dockerfile):
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# Servidor estático leve para produção
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
#### Docker Compose Multi-serviços (docker-compose.yml):
```yaml
version: '3.8'
services:
  db:
    image: postgres:15-alpine
    container_name: hound_db
    restart: always
    environment:
      POSTGRES_USER: hound_user
      POSTGRES_PASSWORD: hound_password
      POSTGRES_DB: hound_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  backend:
    build: ./backend
    container_name: hound_backend
    restart: always
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://hound_user:hound_password@db:5432/hound_db
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    depends_on:
      - db
  frontend:
    build: ./frontend
    container_name: hound_frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    environment:
      - VITE_API_URL=http://localhost:8000
volumes:
  postgres_data:
```
### 2.3. Guia do Repositório: README.md do Projeto
```markdown
# Hound - Triagem Inteligente para Pets 
O **Hound** é uma aplicação web voltada para a saúde de animais de estimação. Utilizando Inteligência Artificial (Google Gemini), o sistema permite realizar triagens rápidas e intuitivas com base nos sintomas apresentados pelo seu animal doméstico, ajudando a entender a urgência do caso e preparando um relatório consolidado de saúde pré-consulta.
##  Como executar o projeto com Docker
Para rodar todo o ecossistema localmente com apenas um comando, você precisa possuir o **Docker** e o **Docker Compose** instalados na sua máquina.
### Pré-requisitos
Antes de subir os containers, crie um arquivo `.env` na raiz do projeto e configure sua chave da API da Google:
```env
GEMINI_API_KEY=sua_chave_de_api_aqui
```
### Executando em Desenvolvimento:
```bash
# Subir os serviços de banco de dados, backend e frontend
docker-compose up --build
```
Após o build, acesse:
 * **Frontend (Aplicação Web)**: http://localhost
 * **API Swagger (Documentação do Backend)**: http://localhost:8000/docs
##  Tecnologias Utilizadas
 * **Frontend**: React.js, Tailwind CSS, Axios
 * **Backend**: Python, FastAPI, SQLAlchemy, Google GenAI SDK
 * **Banco de Dados**: PostgreSQL
 * **Infraestrutura**: Docker & Docker Compose
```
---
## 3. QUALIDADE TÉCNICA E PADRÕES DE COMMITS
Para garantir que o repositório atinja a pontuação máxima de **Qualidade Técnica (20%)** e **Repositório Git (30%)**, a equipe concorda em seguir os seguintes padrões organizacionais durante o desenvolvimento do projeto:
### 3.1. Convenção de Commits (Conventional Commits)
Todas as mensagens de commit devem ser curtas e estruturadas usando prefixos de identificação semântica:
* `feat:` Adição de novas funcionalidades (ex: `feat: add modulo de triagem com gemini`).
* `fix:` Correção de bugs (ex: `fix: corrige validacao do peso do pet`).
* `docs:` Alterações na documentação ou arquivos de texto (ex: `docs: atualiza guia de setup no readme`).
* `style:` Ajustes estéticos, CSS e formatação que não alteram lógica (ex: `style: melhora responsividade do chat no mobile`).
* `refactor:` Alteração de código focado em melhorias internas sem alterar comportamento externo (ex: `refactor: otimiza query de busca de historico`).
---
Este projeto constitui o repositório inicial e os planos de implementação para as entregas de **Especificação do Sistema** e **MVP Funcional**.
```

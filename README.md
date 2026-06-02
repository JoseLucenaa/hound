#  Hound - Inteligência Artificial para Saúde e Triagem Animal

O **Hound** é uma plataforma web baseada em Inteligência Artificial desenvolvida para auxiliar tutores de animais de estimação na compreensão inicial de sintomas apresentados por seus pets. O sistema realiza uma triagem preliminar inteligente, fornecendo orientações baseadas em uma base de conhecimento veterinária e direcionando o tutor para os cuidados adequados.

>  **Importante:** O Hound não substitui consultas veterinárias, não realiza diagnósticos definitivos e não prescreve medicamentos controlados.

---

#  Objetivo

Tutores de pets frequentemente enfrentam situações de preocupação quando seus animais apresentam sintomas incomuns. Muitas vezes, pesquisas em mecanismos de busca retornam informações alarmistas ou imprecisas.

O Hound foi criado para oferecer uma alternativa mais segura, funcionando como um **assistente de triagem veterinária inteligente**, capaz de:

- Coletar sintomas informados pelo tutor;
- Identificar possíveis condições relacionadas;
- Sugerir cuidados iniciais;
- Orientar quando procurar atendimento veterinário.

---

#  Funcionalidades

##  Cadastro de Animais

Permite registrar informações dos pets para personalizar o atendimento.

### Dados cadastrados

- Nome
- Espécie
- Raça
- Idade
- Peso
- Histórico básico

---

##  Triagem Inteligente

Chat interativo que:

1. Recebe os sintomas informados pelo tutor;
2. Analisa os dados utilizando IA;
3. Consulta uma base de conhecimento veterinária;
4. Retorna orientações claras e humanizadas.

---

##  Base de Conhecimento Veterinária

O sistema utiliza um arquivo JSON estruturado contendo:

- Sintomas;
- Possíveis doenças;
- Recomendações iniciais;
- Nível de atenção.

Exemplo:

```json
[
  {
    "sintomas": [
      "vômito amarelo",
      "letargia",
      "falta de apetite"
    ],
    "possivel_doenca": "Gastrite ou problema hepático",
    "solucao_recomendada": "Pausar alimentação por 6 horas. Oferecer água fresca aos poucos. Se persistir, levar ao veterinário. Nível: Atenção (Amarelo)."
  }
]
```

---

#  Arquitetura do Sistema

O projeto utiliza uma arquitetura Full Stack baseada em JavaScript.

## Frontend

Desenvolvido com:

- React.js

Responsável por:

- Interface do usuário;
- Cadastro de animais;
- Chat de triagem;
- Exibição das respostas da IA.

---

## Backend

Desenvolvido com:

- Node.js
- Express.js

Responsável por:

- Processamento das requisições;
- Comunicação com APIs de IA;
- Consulta à base de conhecimento;
- Persistência dos dados.

---

## Banco de Dados

Utiliza:

- SQLite

Vantagens:

- Leve;
- Simples de configurar;
- Não necessita servidor externo;
- Ideal para MVPs e desenvolvimento rápido.

O banco é armazenado localmente através do arquivo:

```txt
database.sqlite
```

---

#  Inteligência Artificial

O Hound combina duas tecnologias principais:

## Hugging Face

Responsável por:

- Processamento de Linguagem Natural (NLP);
- Interpretação dos sintomas enviados pelo usuário;
- Busca semântica na base de conhecimento.

---

## Groq

Responsável por:

- Geração de respostas humanizadas;
- Conversação em tempo real;
- Explicações claras e acolhedoras para o tutor.

---

#  Estrutura do Projeto

```txt
hound/
│
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── dados.json
│   ├── database.sqlite
│   └── src/
│       ├── routes.js
│       └── ai_service.js
│
└── frontend/
    ├── package.json
    ├── public/
    └── src/
        ├── App.js
        └── index.js
```

---

#  Instalação e Execução

##  Backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
node server.js
```

O backend estará disponível em:

```txt
http://localhost:3001
```

O arquivo `database.sqlite` será criado automaticamente na primeira execução.

---

## 2️ Frontend

Abra um novo terminal e entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Inicie a aplicação:

```bash
npm start
```

A aplicação será aberta automaticamente em:

```txt
http://localhost:3000
```

---

#  Variáveis de Ambiente

Crie um arquivo `.env` dentro da pasta `backend/`.

```env
GROQ_API_KEY=sua_chave_groq_aqui
HUGGINGFACE_API_KEY=sua_chave_huggingface_aqui
```

> Não é necessário configurar URL de banco de dados, pois o SQLite utiliza automaticamente o arquivo `database.sqlite`.

---

#  Limitações do Sistema

O Hound foi desenvolvido para atuar exclusivamente como ferramenta de apoio.

O sistema:

 Realiza triagem preliminar;

 Sugere cuidados iniciais;

 Indica quando procurar um veterinário.

O sistema NÃO:

 Substitui profissionais veterinários;

 Emite diagnósticos definitivos;

 Prescreve medicamentos controlados;

 Toma decisões clínicas.

---

#  Público-Alvo

- Tutores de cães;
- Tutores de gatos;
- Clínicas veterinárias;
- Projetos de bem-estar animal;
- Organizações de proteção animal.

---

#  Visão do Projeto

O Hound busca tornar o cuidado animal mais acessível, utilizando Inteligência Artificial para fornecer orientação rápida, confiável e responsável em momentos de dúvida ou preocupação dos tutores.

Nossa missão é aproximar tecnologia e saúde animal, oferecendo suporte inicial inteligente sem substituir a avaliação profissional veterinária.

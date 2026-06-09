# Documentação de Casos de Uso - Portal 923A

Esta documentação detalha as personas, as histórias de usuário e os fluxos principais de interação com o Portal 923A, garantindo que os requisitos do sistema estejam alinhados com as necessidades dos alunos e professores do IFAL.

## 👥 1. Personas

* **João (Aluno Padrão):** Tem dificuldade em organizar prazos e frequentemente esquece as datas de entrega de projetos. Precisa de um lembrete rápido e acessível.
* **Maria (Representante de Turma):** Muito organizada, acessa a plataforma para confirmar as grades de horários e repassar os avisos precisos no grupo do WhatsApp da turma.
* **Prof. Carlos (Docente):** Precisa verificar a grade de aulas (incluindo contraturnos) e validar se o sistema está informando corretamente os prazos dos trabalhos que ele passou.

---

## 📝 2. Histórias de Usuário e Critérios de Aceitação

### Caso de Uso 1: Cadastro de Novo Estudante (UC-01)
**Ator:** Estudante não cadastrado (João)
**História:** *Como aluno da turma 923A, quero criar uma conta no portal utilizando minha matrícula e e-mail para ter acesso à grade de horários e ao assistente de IA.*
* **Fluxo Principal:**
  1. O usuário acessa a página inicial e clica na aba "Cadastro".
  2. Preenche os campos: Nome, Matrícula, E-mail e Senha.
  3. O frontend envia os dados para a rota de registro do backend.
  4. O backend verifica se o e-mail/matrícula já existe.
  5. A senha é encriptada (hash) e o usuário é salvo no SQLite.
* **Critérios de Aceitação:** * O sistema não pode permitir dois cadastros com o mesmo e-mail.
  * Senhas devem ter no mínimo 6 caracteres.
  * O usuário deve ser redirecionado para o login após o sucesso.

### Caso de Uso 2: Autenticação Segura (UC-02)
**Ator:** Usuário registrado (Maria / Prof. Carlos)
**História:** *Como usuário cadastrado, quero fazer login com meu e-mail e senha para acessar o painel restrito.*
* **Fluxo Principal:**
  1. O usuário acessa a aba "Login" e insere credenciais.
  2. O backend valida o hash da senha e gera um Token JWT.
  3. O token é salvo no lado do cliente (LocalStorage/SessionStorage).
  4. O usuário é redirecionado para a rota `/dashboard`.
* **Critérios de Aceitação:**
  * Credenciais inválidas devem retornar mensagem clara de erro.
  * Rotas protegidas (como o Chat) não devem carregar sem um JWT válido.

### Caso de Uso 3: Consulta de Grade Horária (UC-03)
**Ator:** Usuário Autenticado
**História:** *Como usuário logado, quero visualizar a estrutura da minha semana para me planejar para as aulas da tarde e os contraturnos da manhã.*
* **Fluxo Principal:**
  1. O usuário acessa o painel principal.
  2. O componente `Sidebar` ou `Layout` carrega as informações visuais de horários (segunda a sexta).
* **Critérios de Aceitação:**
  * O contraturno de Biologia (quinta-feira de manhã) deve ter destaque visual para evitar esquecimento.

### Caso de Uso 4: Consulta ao Assistente IA (UC-04)
**Ator:** Estudante Autenticado (João)
**História:** *Como aluno com dúvidas de prazos, quero perguntar à IA pelo chat sobre trabalhos e provas para receber uma resposta imediata.*
* **Fluxo Principal:**
  1. O usuário digita no `ChatArea` uma pergunta (ex: "Quando é a prova de Física?").
  2. O frontend envia a pergunta + JWT para a API.
  3. O backend utiliza LangChain para buscar o contexto no `dados.json`.
  4. O Groq LLM gera a resposta e o backend devolve ao frontend.
  5. A resposta aparece na tela do chat.
* **Critérios de Aceitação:**
  * O tempo de resposta não deve ultrapassar 5 segundos.
  * A IA não deve inventar dados (alucinação); se a informação não estiver no JSON, deve informar que não sabe.
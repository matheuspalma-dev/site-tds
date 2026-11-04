# Site institucional da turma Técnico em Desenvolvimento de Sistemas do Colégio SOUZA NAVES, C E-EF M PROFIS

Este documento descreve as diretrizes de contribuição e o fluxo de trabalho Git da nossa equipe de desenvolvimento.

---

##  Estrutura de Branches

* `main`  **(Produção):** Contém o código estável em produção. **Nenhum commit direto é permitido nesta branch.**
* `development` **(Homologação/Staging):** Branch de integração. É a partir dela que novas branches de funcionalidade são criadas e para onde os Pull Requests (PRs) devem ser direcionados.

---

## Fluxo de Trabalho

Para manter a organização do código e garantir revisões adequadas, todos os desenvolvedores devem seguir o passo a passo abaixo:

### 1. Atualizar a branch de desenvolvimento
Antes de iniciar qualquer nova tarefa, garanta que sua `development` local esteja atualizada:
```bash
git checkout development
git pull origin development
```

### 2. Criar uma nova branch de funcionalidade
Crie uma nova branch a partir da development seguindo o padrão de nomenclaturas:

feature/nome-da-feature (para novas funcionalidades)

```bash
git checkout -b feature/cardapio-cantina
```

### 3. Desenvolver e Commitar
Faça alterações no código e comite com mensagens claras e descritivas:

```bash
git add .
git commit -m "feat: adiciona componente de tabela para o cardápio da cantina"
```

### 4. Enviar a branch para o repositório (Push)
Envie a sua branch para o repositório remoto no GitHub:

```bash
git push origin feature/cardapio-cantina
```

### 5. Abrir um Pull Request (PR)
Vá até o repositório no GitHub.

Clique no botão "Compare & pull request".

ATENÇÃO: Garanta que a branch de destino (base) seja a development e a branch de origem (compare) seja a sua branch (feature/nome-da-feature).

### 6. Code Review e Merge
O Pull Request será analisado pelo Gerente de Projeto/Tech Lead.

Se aprovado, o Merge será realizado para a branch development.

Após o merge, a branch de funcionalidade poderá ser deletada.

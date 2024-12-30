# Deploy de Projeto NestJS para EC2 com GitHub Actions

Este repositório inclui um workflow do GitHub Actions para realizar o deploy automático de um projeto NestJS em uma instância EC2 sempre que alterações forem enviadas para o branch `main`.

## Visão Geral do Workflow

- **Disparo:** O workflow é executado automaticamente a cada push no branch `main`.
- **Etapas do Deploy:**
  1. Conecta-se à instância EC2 via SSH usando uma chave privada armazenada como segredo no GitHub.
  2. Faz pull do código mais recente do repositório.
  3. Instala as dependências com `npm install`.
  4. Compila o projeto com `npm run build`.
  5. Reinicia a aplicação utilizando o `PM2`.

## Configuração

### 1. Segredos Necessários
- **`EC2_SSH_KEY`**: Chave SSH privada para acessar a instância EC2.
- **`DYNAMIC_EC2_IP`** *(opcional)*: O endereço IP dinâmico da instância EC2. Caso não esteja configurado, o workflow usará o IP padrão definido no arquivo do workflow.
- **`PROJECT_FOLDER`**: Caminho do diretório do projeto na instância EC2.

### 2. IP Padrão da EC2
O workflow utiliza um IP padrão (`203.0.113.42`) caso o segredo `DYNAMIC_EC2_IP` não esteja configurado. Substitua este valor no arquivo do workflow pelo IP padrão da sua instância EC2.

### 3. Configuração Necessária na EC2
Certifique-se de que os seguintes itens estejam instalados e configurados na sua instância EC2:
- **Node.js** (versão compatível com o seu projeto)
- **PM2** (para gerenciamento de processos)
- **Git** (para realizar pull do código mais recente)

### 4. Diretório de Deploy
O workflow agora utiliza um diretório de deploy dinâmico, configurado através do segredo `PROJECT_FOLDER`. Certifique-se de definir este segredo com o caminho correto do diretório do projeto na sua instância EC2.

## Como Disparar o Deploy
Basta fazer push das suas alterações para o branch `main`. O workflow cuidará de todo o processo.

## Atualizando o IP da EC2
Se o IP da sua instância EC2 mudar:
1. Acesse **Configurações > Segredos e Variáveis > Actions** no seu repositório.
2. Adicione ou atualize o segredo `DYNAMIC_EC2_IP` com o novo endereço IP.

## Atualizando o Diretório do Projeto
Se o diretório do projeto na sua instância EC2 mudar:
1. Acesse **Configurações > Segredos e Variáveis > Actions** no seu repositório.
2. Adicione ou atualize o segredo `PROJECT_FOLDER` com o novo caminho do diretório.

---

Para dúvidas ou problemas, fique à vontade para abrir uma issue ou contribuir!
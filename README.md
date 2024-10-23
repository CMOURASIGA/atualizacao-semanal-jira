# Atualização Semanal das Atividades no JIRA

## Descrição
Este projeto automatiza o envio de emails semanais com resumos das atividades e status de tarefas no JIRA. O script identifica atividades pendentes e envia alertas detalhados para a equipe, garantindo que as tarefas sejam atualizadas regularmente.

## Funcionalidades
- Verificação de atividades pendentes no JIRA e envio de notificações.
- Personalização de mensagens para casos com e sem atividades pendentes.
- Formatação HTML de emails para destacar tarefas e responsáveis.
- Automatização do envio através de agendamento semanal via Google Apps Script.

## Pré-requisitos
- **API Token** do JIRA para autenticação.
- Permissão para acessar e modificar o projeto e tarefas no JIRA.
- Configuração do Google Apps Script para automatizar o envio semanal.

## Como Configurar
1. Gere um **API Token** no JIRA e salve para autenticação.
2. Crie um novo projeto no Google Apps Script e copie o script disponível neste repositório.
3. Atualize as variáveis no script:
   - `jiraUsername`: Seu usuário do JIRA.
   - `jiraApiToken`: Seu token de autenticação JIRA.
   - `jiraUrl`: URL com o JQL para filtrar as atividades relevantes.
4. Ajuste os emails dos destinatários conforme a necessidade no trecho do código responsável pelo envio.

## Estrutura do Projeto
- **/scripts**: Código do Google Apps Script utilizado para automação (`atualizacao_semanal_jira.js`).
- **/docs**: Documentação e instruções detalhadas.

## Futuras Melhorias
- Implementação de logs mais detalhados para acompanhamento.
- Opção de personalização adicional para as mensagens e agendamentos.

## Autor
Christian Moura - Inspira Rede de Educadores

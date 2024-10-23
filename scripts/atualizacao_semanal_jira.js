function sendJiraEmail() {
  Logger.log("Iniciando o processo de envio de email...");

  try {
    const jiraUrl = "https://redeinspiraeducadores.atlassian.net/rest/api/3/search?jql=filter=10073";
    const jiraUsername = //colocar o nome de usuario do JIRA;
    const jiraApiToken = //colocar a API TOKEN do JIRA;

    const headers = {
      "Authorization": "Basic " + Utilities.base64Encode(jiraUsername + ":" + jiraApiToken),
      "Content-Type": "application/json"
    };

    const options = { "method": "get", "headers": headers };
    const response = UrlFetchApp.fetch(jiraUrl, options);
    const data = JSON.parse(response.getContentText());

    // Verificar se há atividades
    if (data.issues.length === 0) {
      const noActivityMessages = [
        `Olá equipe,<br><br>Parabéns pelo ótimo trabalho! Atualmente, não há atividades pendentes no JIRA, o que reflete o comprometimento de todos com os processos e prazos.<br><br>Lembrando que, em gestão de projetos, além de concluir as tarefas, é crucial garantir que tudo esteja devidamente documentado. Isso fortalece nosso controle documentacional e governança, fornecendo subsídios para análises futuras.<br><br>Continuem assim e mantenham a documentação em dia para garantirmos o sucesso contínuo!`,
        `Oi equipe,<br><br>Ótimas notícias: não há atividades pendentes no JIRA! Isso é um reflexo direto da eficiência e dedicação da equipe.<br><br>Mesmo sem pendências, lembrem-se de que a documentação adequada é essencial para garantir que estamos seguindo boas práticas de governança. As atividades finalizadas também precisam estar documentadas para fornecer base para futuras análises e decisões estratégicas.<br><br>Parabéns e continuem com o excelente trabalho!`,
        `Prezados,<br><br>Atualmente, não temos nenhuma atividade pendente no JIRA. Gostaria de parabenizar a todos pelo empenho e pela organização que resultaram nessa conquista.<br><br>Vale ressaltar que a documentação detalhada das atividades concluídas continua sendo um pilar fundamental para a governança e controle documentacional. Isso nos permite manter a clareza dos processos e gerar insights valiosos para futuras decisões.<br><br>Obrigado pela dedicação de sempre e vamos manter essa excelente performance!`
      ];

      const randomNoActivityMessage = noActivityMessages[Math.floor(Math.random() * noActivityMessages.length)];

      MailApp.sendEmail({
        to: "yohan.gregorio@redeinspiraeducadores.com.br, christian.moura@redeinspiraeducadores.com.br,andre.ventura@redeinspiraeducadores.com.br, gustavo.barros@redeinspiraeducadores.com.br",
        subject: "Parabéns pelo ótimo trabalho! Nenhuma atividade pendente no JIRA",
        htmlBody: randomNoActivityMessage
      });

      Logger.log("Email enviado: Não há atividades pendentes.");
      return;
    }

    Logger.log("Atividades encontradas. Construindo o email...");

    // Identificar a data de atualização mais antiga
    let oldestDate = null;
    data.issues.forEach(function(issue) {
      const issueDate = new Date(issue.fields.updated);
      if (!oldestDate || issueDate < oldestDate) {
        oldestDate = issueDate;
      }
    });

    // Formatar a data mais antiga para comparação
    const formattedOldestDate = Utilities.formatDate(oldestDate, Session.getScriptTimeZone(), "dd/MM/yy");

    // Mensagens variáveis para o caso de haver atividades pendentes
    const messages = [
      "Olá equipe,<br><br>Percebi que algumas atividades no JIRA não foram atualizadas há algum tempo. Por favor, revisem as tarefas listadas abaixo e façam as atualizações necessárias.<br><br>Agradeço pela parceria de todos na resolução dessas demandas!<br><br>",
      "Bom dia equipe,<br><br>Algumas atividades no JIRA estão pendentes de atualização. Solicitamos que revisem as tarefas listadas abaixo e atualizem-nas conforme necessário.<br><br>Contamos com a colaboração de todos para mantermos o progresso constante!<br><br>",
      "Oi equipe,<br><br>Notamos que algumas atividades no JIRA não receberam atualizações recentes. Por favor, verifiquem as tarefas abaixo e realizem as devidas atualizações.<br><br>Agradecemos a dedicação e o apoio de sempre!<br><br>",
      "Prezados,<br><br>Há atividades no JIRA que precisam de atenção. Solicitamos que revisem as tarefas abaixo e atualizem-nas conforme necessário.<br><br>Obrigado pela parceria e empenho na resolução dessas atividades!<br><br>"
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    let emailBody = randomMessage;

    emailBody += "<table border='1' cellpadding='10' cellspacing='0' style='border-collapse: collapse; width: 100%;'>";
    emailBody += "<thead><tr style='background-color: #2F5597; color: #ffffff;'><th>Chave</th><th>Resumo</th><th>Responsável</th><th>Status</th><th>Prioridade</th><th>Última Data de Atualização</th><th>Categoria</th></tr></thead>";
    emailBody += "<tbody>";

    data.issues.forEach(function(issue, index) {
      const lastUpdated = Utilities.formatDate(new Date(issue.fields.updated), Session.getScriptTimeZone(), "dd/MM/yy");
      const assignee = issue.fields.assignee ? issue.fields.assignee.displayName : "Não atribuído";
      const priority = issue.fields.priority ? issue.fields.priority.name : "Sem prioridade";
      const category = issue.fields.project ? issue.fields.project.name : "Sem categoria"; 

      const rowColor = index % 2 === 0 ? "#ffffff" : "#f9f9f9";
      const attentionStyle = lastUpdated === formattedOldestDate ? "background-color: #ffdddd;" : ""; // Destaque na data mais antiga

      const issueLink = `https://redeinspiraeducadores.atlassian.net/browse/${issue.key}`; // Link para a atividade no JIRA

      emailBody += "<tr style='background-color:" + rowColor + ";'>";
      emailBody += `<td><strong><a href="${issueLink}" target="_blank">${issue.key}</a></strong></td>`;
      emailBody += "<td>" + issue.fields.summary + "</td>";
      emailBody += "<td><strong>" + assignee + "</strong></td>";
      emailBody += "<td>" + issue.fields.status.name + "</td>";
      emailBody += "<td>" + priority + "</td>";
      emailBody += `<td style="${attentionStyle}">` + lastUpdated + "</td>";
      emailBody += "<td>" + category + "</td>";
      emailBody += "</tr>";
    });

    emailBody += "</tbody></table>";

    MailApp.sendEmail({
      to: "yohan.gregorio@redeinspiraeducadores.com.br, christian.moura@redeinspiraeducadores.com.br,andre.ventura@redeinspiraeducadores.com.br, gustavo.barros@redeinspiraeducadores.com.br",
      subject: "Atualização Semanal das Atividades no JIRA",
      htmlBody: emailBody
    });

    Logger.log("Email enviado com atividades pendentes.");

  } catch (error) {
    Logger.log("Erro no processo: " + error.message);
  }
}

function createTrigger() {
  ScriptApp.newTrigger("sendJiraEmail")
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.MONDAY)
    .atHour(9)
    .create();
}

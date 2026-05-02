import email from "infra/email.js";
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe("infra/email.js", () => {
  test("send()", async () => {
    await orchestrator.deleteAllEmails();

    await email.send({
      from: "TutuTech <contato@notifications.tututech.com.br>",
      to: "contato@curso.dev",
      subject: "teste de assunto",
      text: "teste de corpo.",
    });

    // para testar se a função lastEmail() está funcionando.
    await email.send({
      from: "TutuTech <contato@notifications.tututech.com.br>",
      to: "contato@curso.dev",
      subject: "Último email enviado",
      text: "teste de corpo do último email.",
    });

    const lastEmail = await orchestrator.getLastEmail();

    expect(lastEmail.sender).toBe("<contato@notifications.tututech.com.br>");
    expect(lastEmail.recipients[0]).toBe("<contato@curso.dev>");
    expect(lastEmail.subject).toBe("Último email enviado");
    expect(lastEmail.text).toBe("teste de corpo do último email.\r\n");
  });
});

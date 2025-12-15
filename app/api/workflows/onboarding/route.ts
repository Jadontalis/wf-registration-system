import { serve } from "@upstash/workflow/nextjs";

interface InitialData {
  email: string;
  fullName: string;
}

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName } = context.requestPayload;

  await context.run("send-welcome-email", async () => {
    console.log(`[Mock Email] Sending welcome email to ${email} (${fullName})`);
    return { sent: true, email };
  });
});

export default defineEventHandler(() => {
  const { QSTASH_AUTHORIZATION, SMTP } = useRuntimeConfig();
  if (!QSTASH_AUTHORIZATION || !SMTP) return false;
  const SMTPValues = [...Object.values(SMTP)] as string[];
  return SMTPValues.length === 6 && SMTPValues.every(v => v !== '');
});

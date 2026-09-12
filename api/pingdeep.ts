import { sanitizeModel, detectToolIntent, MODEL_PERSONAS } from './lib/swapAI';

export default async function handler(req: any, res: any) {
  const intent = detectToolIntent('find active skills I can take part in');
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      ok: true,
      route: '/api/pingdeep',
      model: sanitizeModel('hy3'),
      persona: MODEL_PERSONAS.hy3.name,
      intent: intent?.toolName || null,
    })
  );
}

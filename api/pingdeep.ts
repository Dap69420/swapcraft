import { sanitizeModel, detectToolIntent, MODEL_PERSONAS } from './_lib/swapAI';

export default async function handler(req: any, res: any) {
  const intent = detectToolIntent('find active skills I can take part in');
  res.status(200).json({
    ok: true,
    route: '/api/pingdeep',
    model: sanitizeModel('hy3'),
    persona: MODEL_PERSONAS.hy3.name,
    intent: intent?.toolName || null,
  });
}

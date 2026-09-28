import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AssistantService } from '../services/assistantService';

/**
 * POST /api/assistant/message or POST /api/ai/assistant
 */
export const handleAssistantQuery = async (req: AuthRequest, res: Response) => {
  try {
    const { query, message, history = [], language = 'en', pageContext = {}, simpleLanguage = false } = req.body || {};
    const inputQuery = message || query;

    if (!inputQuery || typeof inputQuery !== 'string' || inputQuery.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'query or message string is required' });
    }

    const userId = req.user?.id;
    const response = await AssistantService.processUserQuery(userId, inputQuery.trim(), history, language, pageContext, simpleLanguage);
    return res.json({ success: true, response });
  } catch (err: any) {
    console.error('❌ Assistant Service Error:', err);
    return res.status(500).json({
      success: false,
      message: 'AI Assistant is temporarily unavailable. Please try again.',
    });
  }
};

/**
 * POST /api/ai/stream
 * Real SSE streaming response
 */
export const handleAssistantStream = async (req: AuthRequest, res: Response) => {
  try {
    const { query, message, history = [], language = 'en', pageContext = {}, simpleLanguage = false } = req.body || {};
    const inputQuery = message || query;

    if (!inputQuery || typeof inputQuery !== 'string' || !inputQuery.trim()) {
      return res.status(400).json({ success: false, message: 'query is required' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const userId = req.user?.id;
    const result = await AssistantService.processUserQuery(userId, inputQuery.trim(), history, language, pageContext, simpleLanguage);

    // Send metadata header
    res.write(`data: ${JSON.stringify({
      type: 'start',
      responseMeta: {
        suggestedActions: result.suggestedActions,
        actionRoute: result.actionRoute,
        sourceName: result.sourceName,
        sourceUrl: result.sourceUrl,
        lastVerifiedAt: result.lastVerifiedAt,
        simpleExplanation: result.simpleExplanation,
      },
    })}\n\n`);

    // Stream text chunks
    const text = result.answer || '';
    const words = text.split(/(\s+)/);
    for (let i = 0; i < words.length; i++) {
      if (res.writableEnded) break;
      res.write(`data: ${JSON.stringify({ type: 'chunk', text: words[i] })}\n\n`);
      await new Promise((r) => setTimeout(r, 12));
    }

    if (!res.writableEnded) {
      res.write(`data: ${JSON.stringify({ type: 'done', fullResponse: result })}\n\n`);
      res.end();
    }
  } catch (err: any) {
    console.error('❌ Stream Error:', err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: 'Stream failed' });
    }
    res.write(`data: ${JSON.stringify({ type: 'error', message: err.message })}\n\n`);
    res.end();
  }
};


/**
 * POST /api/assistant/context
 * Updates or evaluates assistant context state.
 */
export const handleAssistantContext = async (req: AuthRequest, res: Response) => {
  try {
    const { pageContext = {} } = req.body || {};
    const userRole = req.body?.userRole || req.user?.role || 'STUDENT';
    return res.json({
      success: true,
      activeContext: {
        pageContext,
        userRole,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * GET /api/assistant/suggestions
 * Returns contextual prompt chips based on route or role.
 */
export const getAssistantSuggestions = async (req: AuthRequest, res: Response) => {
  try {
    const routePath = req.query.routePath || '';
    const role = (req.query.role as string) || req.user?.role || 'STUDENT';
    let suggestions: string[] = [];

    if (role === 'ADMIN') {
      suggestions = [
        'Why are applications delayed at Institute Verification?',
        'What is the total disbursed grant amount?',
        'Which district has the highest document deficiency rate?',
      ];
    } else if (role === 'INSTITUTE') {
      suggestions = [
        'Which applications require officer review today?',
        'How do I issue a return-for-correction comment?',
        'What is our institute average verification time?',
      ];
    } else {
      if (String(routePath).includes('digital-twin')) {
        suggestions = ['Why is my application pending?', 'Who is currently reviewing my application?', 'What is my next step?'];
      } else if (String(routePath).includes('documents')) {
        suggestions = ['Why was my document flagged?', 'How do I fix name mismatch?', 'What document is missing?'];
      } else if (String(routePath).includes('renewals')) {
        suggestions = ['When is my renewal due?', 'What document should I prepare for renewal?', 'Check my readiness score'];
      } else {
        suggestions = ['What should I do now?', 'Find scholarships relevant to me', 'What opportunities might be relevant after graduation?'];
      }
    }

    return res.json({ success: true, suggestions });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

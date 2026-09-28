import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const prisma = new PrismaClient();

export const getUserPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    let pref = await prisma.userPreference.findUnique({ where: { userId } });

    if (!pref) {
      pref = await prisma.userPreference.create({
        data: {
          userId,
          preferredLanguage: 'en',
          voiceEnabled: true,
          ttsEnabled: true,
          fontSize: 'normal',
          highContrast: false,
          simpleLanguage: false,
        },
      });
    }

    return res.json({ success: true, preferences: pref });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateUserPreferences = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { preferredLanguage, voiceEnabled, ttsEnabled, fontSize, highContrast, simpleLanguage } = req.body;

    const pref = await prisma.userPreference.upsert({
      where: { userId },
      update: {
        ...(preferredLanguage !== undefined && { preferredLanguage }),
        ...(voiceEnabled !== undefined && { voiceEnabled: Boolean(voiceEnabled) }),
        ...(ttsEnabled !== undefined && { ttsEnabled: Boolean(ttsEnabled) }),
        ...(fontSize !== undefined && { fontSize }),
        ...(highContrast !== undefined && { highContrast: Boolean(highContrast) }),
        ...(simpleLanguage !== undefined && { simpleLanguage: Boolean(simpleLanguage) }),
      },
      create: {
        userId,
        preferredLanguage: preferredLanguage || 'en',
        voiceEnabled: voiceEnabled !== undefined ? Boolean(voiceEnabled) : true,
        ttsEnabled: ttsEnabled !== undefined ? Boolean(ttsEnabled) : true,
        fontSize: fontSize || 'normal',
        highContrast: highContrast !== undefined ? Boolean(highContrast) : false,
        simpleLanguage: simpleLanguage !== undefined ? Boolean(simpleLanguage) : false,
      },
    });

    return res.json({ success: true, message: 'Preferences updated successfully', preferences: pref });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

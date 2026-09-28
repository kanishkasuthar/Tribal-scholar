/**
 * Web Speech API Voice Service for Speech-to-Text and Text-to-Speech across 7 Indian languages.
 */

export interface SpeechRecognitionResultHandler {
  onResult: (text: string) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

const LANGUAGE_SPEECH_MAP: Record<string, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  kn: 'kn-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

export class VoiceService {
  private static recognition: any = null;
  private static synth: SpeechSynthesis | null = typeof window !== 'undefined' ? window.speechSynthesis : null;

  /**
   * Checks if Speech Recognition is supported in the current browser.
   */
  static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  /**
   * Checks if Text-to-Speech (Speech Synthesis) is supported.
   */
  static isTTSSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Starts listening for voice input in the selected language.
   */
  static startListening(lang: string = 'en', handlers: SpeechRecognitionResultHandler) {
    if (!VoiceService.isSpeechRecognitionSupported()) {
      handlers.onError('Voice input is not supported in this browser. You can continue using text.');
      return;
    }

    try {
      const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      VoiceService.recognition = new SpeechRecognitionClass();
      VoiceService.recognition.continuous = false;
      VoiceService.recognition.interimResults = false;
      VoiceService.recognition.lang = LANGUAGE_SPEECH_MAP[lang] || 'en-IN';

      VoiceService.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handlers.onResult(transcript);
      };

      VoiceService.recognition.onerror = (event: any) => {
        handlers.onError(event.error || 'Speech recognition error occurred.');
      };

      VoiceService.recognition.onend = () => {
        handlers.onEnd();
      };

      VoiceService.recognition.start();
    } catch (e: any) {
      handlers.onError(e.message || 'Microphone access error.');
    }
  }

  /**
   * Stops active speech recognition listening.
   */
  static stopListening() {
    if (VoiceService.recognition) {
      try {
        VoiceService.recognition.stop();
      } catch (e) {
        console.error(e);
      }
    }
  }

  /**
   * Reads aloud text response using browser Text-to-Speech.
   */
  static speak(text: string, lang: string = 'en', onEnd?: () => void) {
    if (!VoiceService.isTTSSupported() || !VoiceService.synth) {
      return;
    }

    VoiceService.stopSpeaking();

    // Strip markdown formatting for natural speech output
    const cleanText = text.replace(/#/g, '').replace(/\*/g, '').replace(/\[.*?\]\(.*?\)/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANGUAGE_SPEECH_MAP[lang] || 'en-IN';
    utterance.rate = 0.95;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    VoiceService.synth.speak(utterance);
  }

  /**
   * Pauses or stops active speech output.
   */
  static stopSpeaking() {
    if (VoiceService.synth) {
      VoiceService.synth.cancel();
    }
  }
}

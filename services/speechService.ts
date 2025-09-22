import { audioData } from '../data/audioData';
import { alphabetData } from '../data/alphabetData';

let currentAudio: HTMLAudioElement | null = null;

const soundToLetterFormsMap = new Map<string, string>();
// Some letters have multiple forms, we take the first one as the primary sound.
alphabetData.forEach(item => {
  if (!soundToLetterFormsMap.has(item.sound)) {
    soundToLetterFormsMap.set(item.sound, item.letterForms);
  }
});

// Manual mappings for vowels and special cases from quiz data
soundToLetterFormsMap.set('اَ', 'اَ  َ');
soundToLetterFormsMap.set('اِ', 'اِ   ِ ـه ه');
soundToLetterFormsMap.set('اُ', 'اُ  ُ');
soundToLetterFormsMap.set('او', 'او و');
soundToLetterFormsMap.set('ای', 'ایـ یـ ی ای');
// Ensure comprehension menu audio works
soundToLetterFormsMap.set('درک مطلب', 'درک مطلب');


export const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
        cancelSpeech();

            // Check for user interaction before playing audio
            const hasUserInteracted = window.document.hasFocus() && (window.navigator.userActivation?.isActive || false);
            if (!hasUserInteracted) {
                alert('برای پخش صوت ابتدا با صفحه تعامل داشته باشید (مثلاً کلیک کنید).');
                resolve();
                return;
            }
        const normalizedText = text.trim()
            .replace(/\s+/g, ' ') // Normalize spaces
            .replace(/می\s/g, 'می‌'); // Ensure "می" is connected

        // Handle quiz-specific sound prompts like "صدای ب"
        const quizSoundMatch = normalizedText.toLowerCase().match(/^صدای (.+)/);
        let audioKey = quizSoundMatch ? quizSoundMatch[1].trim() : normalizedText;

        if (soundToLetterFormsMap.has(audioKey)) {
            audioKey = soundToLetterFormsMap.get(audioKey)!;
        }

        // First, try to find a direct match for the key.
        // The keys in `audioData` are case-sensitive and may contain spaces.
        const audioUrl = audioData[audioKey];

        if (audioUrl) {
            const audio = new Audio(audioUrl);
            currentAudio = audio;

            const cleanupAndResolve = () => {
                if (currentAudio === audio) {
                    audio.onended = null;
                    audio.onerror = null;
                    currentAudio = null;
                }
                resolve();
            };

            audio.onended = cleanupAndResolve;
            
            audio.onerror = (e) => {
                let errorMsg = `\n❌ خطا در پخش صوت برای "${text}".`;
                errorMsg += `\nلینک: ${audioUrl}`;
                let errorDetail = '';
                if (typeof e === 'string') {
                    errorDetail = e;
                } else if (e && typeof (e as any).message === 'string') {
                    errorDetail = (e as any).message;
                } else {
                    errorDetail = JSON.stringify(e);
                }
                errorMsg += `\nکد خطا: ${errorDetail}`;
                errorMsg += `\nممکن است مشکل از فرمت فایل، محدودیت مرورگر یا دسترسی به اینترنت باشد.`;
                errorMsg += `\nاگر فایل صوتی در مرورگر باز می‌شود، احتمالا باید با کلیک کاربر پخش شود یا فرمت را به mp3 تغییر دهید.`;
                alert(errorMsg);
                console.error(errorMsg, e);
             if (currentAudio === audio) {
                 currentAudio = null;
             }
             resolve(); // Resolve silently to not break app flow
            };

            audio.play().catch((e: DOMException) => {
                // AbortError is expected when playback is interrupted by cancelSpeech()
                if (e.name === 'AbortError') {
                    cleanupAndResolve();
                    return;
                }
                console.error(`Audio play() rejected for "${text}".`, e);
                if (currentAudio === audio) {
                     currentAudio = null;
                }
                resolve(); // Resolve silently
            });
        } else {
            // Log a warning for missing audio and provide debug information
            console.warn(`No pre-recorded audio for "${text}". TTS is disabled. Tried key: "${audioKey}"`);
            resolve();
        }
    });
};

export const cancelSpeech = (): void => {
    if (currentAudio) {
        // Detach listeners to prevent them from being called during cancellation
        currentAudio.onended = null;
        currentAudio.onerror = null;
        // Pause and reset the audio object to stop playback and download
        currentAudio.pause();
        currentAudio.src = ''; 
        currentAudio = null;
    }
    // No TTS to cancel
};

// Play the specific audio file for "درک مطلب"
// new Audio('https://raw.githubusercontent.com/Numixious/Neshanak-Voices/main/منو/درک مطلب.m4a').play();

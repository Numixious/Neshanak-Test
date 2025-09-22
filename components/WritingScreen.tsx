import React, { useState, useEffect, useCallback } from 'react';
import { generateImageForWriting, getWritingFeedback } from '../services/geminiService';
import Spinner from './shared/Spinner';
import { speak } from '../services/speechService';

const SoundIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.66 1.905H6.44l4.5 4.5c.945.945 2.56.276 2.56-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 01-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
        <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
    </svg>
);

const WritingScreen: React.FC = () => {
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [imageData, setImageData] = useState<{ prompt: string; url: string } | null>(null);
  const [error, setError] = useState('');
  const [userText, setUserText] = useState('');
  const [feedback, setFeedback] = useState('');

  const fetchImage = useCallback(async () => {
    setIsLoadingImage(true);
    setError('');
    setImageData(null);
    setFeedback('');
    setUserText('');
    try {
      const { prompt, imageB64 } = await generateImageForWriting();
      const imageUrl = `data:image/jpeg;base64,${imageB64}`;
      setImageData({ prompt, url: imageUrl });
    } catch (err) {
      setError('مشکلی در ساختن تصویر پیش آمد. دوباره تلاش کن.');
    } finally {
      setIsLoadingImage(false);
    }
  }, []);

  useEffect(() => {
    fetchImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    if (!userText || !imageData) return;
    setIsLoadingFeedback(true);
    setFeedback('');
    setError('');
    try {
      const generatedFeedback = await getWritingFeedback(userText, imageData.prompt);
      setFeedback(generatedFeedback);
    } catch (err) {
      setError('مشکلی در بررسی نوشته پیش آمد. لطفا دوباره تلاش کن.');
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-brand-text dark:text-slate-100 mb-2">حالا نوبت توئه که بنویسی!</h2>
        <p className="text-lg text-slate-600 dark:text-slate-400">بگو در تصویر زیر چه می‌بینی؟</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 rounded-2xl shadow-xl min-h-[300px] flex items-center justify-center">
          {isLoadingImage ? (
            <Spinner text="دارم برات یه عکس جالب می‌کشم..." size="lg" />
          ) : error && !imageData ? (
            <div className="text-center text-red-500 dark:text-red-400">
              <p className="text-2xl mb-2">(＞﹏＜)</p>
              <p className="font-bold">{error}</p>
              <button onClick={fetchImage} className="mt-4 px-6 py-2 bg-brand-accent text-white font-bold rounded-full">دوباره تلاش کن</button>
            </div>
          ) : imageData ? (
            <img src={imageData.url} alt={imageData.prompt} className="rounded-xl max-h-[400px] w-auto shadow-lg" />
          ) : null}
        </div>

        {imageData && !isLoadingImage && (
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl flex flex-col gap-4">
            <textarea
              value={userText}
              onChange={(e) => setUserText(e.target.value)}
              placeholder="اینجا بنویس..."
              className="w-full p-4 text-2xl border-2 bg-white dark:bg-slate-700 dark:text-slate-100 dark:placeholder-slate-400 border-brand-primary-light dark:border-brand-primary rounded-xl focus:ring-2 focus:ring-brand-accent focus:border-transparent transition duration-300 min-h-[120px]"
              disabled={isLoadingFeedback}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoadingFeedback || !userText}
              className="w-full md:w-1/2 mx-auto py-4 px-6 text-xl font-bold text-white bg-brand-secondary rounded-full shadow-lg hover:bg-pink-500 transition-all duration-300 transform hover:-translate-y-1 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoadingFeedback ? <Spinner size="sm" /> : <span>بررسی کن</span>}
            </button>

            {feedback && (
              <div className="mt-4 p-4 bg-green-100 dark:bg-green-900/50 border-r-4 border-green-500 dark:border-green-600 text-green-800 dark:text-green-200 rounded-lg">
                <p className="text-xl/relaxed font-medium">{feedback}</p>
              </div>
            )}
            {error && !feedback && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 border-r-4 border-red-500 dark:border-red-600 text-red-800 dark:text-red-200 rounded-lg">
                    <p className="text-xl/relaxed font-medium">{error}</p>
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WritingScreen;
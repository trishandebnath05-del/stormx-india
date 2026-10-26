import React, { useState } from 'react';
import { 
  Newspaper, Globe, ExternalLink, RefreshCw, Key, 
  Check, Sparkles, Filter, ChevronRight, Share2 
} from 'lucide-react';
import { NewsArticle, NewsCategory, NewsLanguage } from '../types/weather';

interface NewsScreenProps {
  articles: NewsArticle[];
  isLoading: boolean;
  sourceUsed: string;
  selectedCategory: NewsCategory;
  selectedLanguage: NewsLanguage;
  customApiKey: string;
  onSelectCategory: (cat: NewsCategory) => void;
  onSelectLanguage: (lang: NewsLanguage) => void;
  onSaveApiKey: (key: string) => void;
  onRefresh: () => void;
}

export const NewsScreen: React.FC<NewsScreenProps> = ({
  articles,
  isLoading,
  sourceUsed,
  selectedCategory,
  selectedLanguage,
  customApiKey,
  onSelectCategory,
  onSelectLanguage,
  onSaveApiKey,
  onRefresh
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [tempKey, setTempKey] = useState(customApiKey);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const categories: { id: NewsCategory; enLabel: string; hiLabel: string }[] = [
    { id: 'national', enLabel: 'National', hiLabel: 'राष्ट्रीय' },
    { id: 'technology', enLabel: 'Technology', hiLabel: 'तकनीक' },
    { id: 'sports', enLabel: 'Sports', hiLabel: 'खेल' },
    { id: 'entertainment', enLabel: 'Entertainment', hiLabel: 'मनोरंजन' },
  ];

  const handleSave = () => {
    onSaveApiKey(tempKey);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setShowConfig(false);
    }, 1200);
  };

  return (
    <div className="flex-1 flex flex-col space-y-4 p-4 pb-8 overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[#F0F6FC]">Indian News Wire</h2>
          <p className="text-xs text-[#8B9CB5]">Verified national & thematic coverage</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher Button (English / Hindi) */}
          <div className="flex items-center p-1 bg-[#0D172E] border border-[#1E2D54] rounded-xl">
            <button
              onClick={() => onSelectLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLanguage === 'en'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onSelectLanguage('hi')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedLanguage === 'hi'
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                  : 'text-[#8B9CB5] hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`p-2 rounded-xl border transition ${
              customApiKey
                ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]'
                : 'bg-[#0D172E] border-[#1E2D54] text-[#8B9CB5] hover:text-white'
            }`}
            title="Configure News API Key"
          >
            <Key className="w-4 h-4" />
          </button>

          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 rounded-xl bg-[#0D172E] border border-[#1E2D54] text-[#8B9CB5] hover:text-[#00E5FF] transition disabled:opacity-50"
            title="Refresh news feed"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#00E5FF]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Configurable News API Drawer */}
      {showConfig && (
        <div className="p-4 rounded-2xl bg-[#0D172E] border border-[#00E5FF]/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-[#00E5FF]">
              <Key className="w-4 h-4" />
              <span>Configurable News API Integration</span>
            </div>
            <span className="text-[10px] text-[#00E676] bg-[#00E676]/10 px-2 py-0.5 rounded border border-[#00E676]/30">
              Zero Hardcoded Keys
            </span>
          </div>

          <p className="text-[11px] text-[#CBD5E1] leading-relaxed">
            StormX India protects your security: no API keys are exposed in client code. 
            Optionally insert your free GNews or NewsData key for personalized queries, safely stored in your local storage.
          </p>

          <div className="flex gap-2">
            <input
              type="password"
              value={tempKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Paste custom GNews or NewsData API key..."
              className="flex-1 bg-[#050914] border border-[#1E2D54] rounded-xl px-3 py-2 text-xs text-[#F0F6FC] placeholder-[#5A6D88] focus:outline-none focus:border-[#00E5FF]"
            />
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black text-xs font-bold rounded-xl transition flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </>
              ) : (
                <span>Apply</span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const label = selectedLanguage === 'hi' ? cat.hiLabel : cat.enLabel;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-[#00E5FF] text-black shadow-[0_0_10px_rgba(0,229,255,0.35)]'
                  : 'bg-[#0D172E] border border-[#1E2D54] text-[#8B9CB5] hover:text-[#CBD5E1]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Source attribution badge */}
      <div className="flex items-center justify-between text-[11px] text-[#5A6D88] px-1 font-mono">
        <span>Source: {sourceUsed}</span>
        <span>{articles.length} verified articles</span>
      </div>

      {/* News Articles List */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-3 text-[#8B9CB5]">
          <RefreshCw className="w-6 h-6 animate-spin text-[#00E5FF]" />
          <span className="text-xs">Fetching verified Indian headlines...</span>
        </div>
      ) : articles.length === 0 ? (
        <div className="py-12 text-center text-xs text-[#8B9CB5]">
          No headlines found for this category. Tap refresh to query latest wire.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-2xl bg-[#0D172E] border border-[#1E2D54]/70 hover:border-[#00E5FF]/40 transition group"
            >
              <div className="flex gap-3">
                {article.imageUrl && (
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#050914] shrink-0 border border-[#1E2D54]/60">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      loading="lazy"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold text-[#00E5FF] uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#00E5FF]/10">
                      {article.source}
                    </span>
                    <span className="text-[10px] text-[#8B9CB5]">{article.publishedAt}</span>
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#F0F6FC] leading-snug group-hover:text-[#00E5FF] transition line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-[11px] text-[#8B9CB5] line-clamp-2 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#1E2D54]/50 flex items-center justify-between text-[11px] text-[#8B9CB5]">
                <span className="text-[#5A6D88]">Real publisher dispatch</span>
                <span className="text-[#00E5FF] group-hover:underline flex items-center gap-1 font-semibold text-xs">
                  <span>Read Full Story</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

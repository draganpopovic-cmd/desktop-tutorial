import { useState } from 'react';
import { ArrowLeft, ArrowRight, RefreshCw, House, Plus, X, Globe } from 'lucide-react';

interface Tab {
  id: number;
  url: string;
  title: string;
  history: string[];
  historyIndex: number;
}

export function BrowserWindow() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 1,
      url: 'https://www.wikipedia.org',
      title: 'Wikipedia',
      history: ['https://www.wikipedia.org'],
      historyIndex: 0,
    },
  ]);
  const [activeTabId, setActiveTabId] = useState(1);
  const [inputUrl, setInputUrl] = useState('https://www.wikipedia.org');
  const [nextTabId, setNextTabId] = useState(2);

  const activeTab = tabs.find((tab) => tab.id === activeTabId);

  const createNewTab = () => {
    const newTab: Tab = {
      id: nextTabId,
      url: 'about:blank',
      title: 'Neuer Tab',
      history: ['about:blank'],
      historyIndex: 0,
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(nextTabId);
    setInputUrl('');
    setNextTabId(nextTabId + 1);
  };

  const closeTab = (tabId: number) => {
    if (tabs.length === 1) return; // Keep at least one tab
    
    const newTabs = tabs.filter((tab) => tab.id !== tabId);
    setTabs(newTabs);
    
    if (activeTabId === tabId) {
      setActiveTabId(newTabs[0].id);
      setInputUrl(newTabs[0].url);
    }
  };

  const switchTab = (tabId: number) => {
    setActiveTabId(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) {
      setInputUrl(tab.url);
    }
  };

  const navigateToUrl = (url: string) => {
    if (!activeTab) return;

    let finalUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://') && url !== 'about:blank') {
      finalUrl = 'https://' + url;
    }

    const newHistory = activeTab.history.slice(0, activeTab.historyIndex + 1);
    newHistory.push(finalUrl);

    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId
          ? {
              ...tab,
              url: finalUrl,
              history: newHistory,
              historyIndex: newHistory.length - 1,
              title: extractDomain(finalUrl),
            }
          : tab
      )
    );
    setInputUrl(finalUrl);
  };

  const goBack = () => {
    if (!activeTab || activeTab.historyIndex === 0) return;

    const newIndex = activeTab.historyIndex - 1;
    const newUrl = activeTab.history[newIndex];

    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, url: newUrl, historyIndex: newIndex }
          : tab
      )
    );
    setInputUrl(newUrl);
  };

  const goForward = () => {
    if (!activeTab || activeTab.historyIndex === activeTab.history.length - 1) return;

    const newIndex = activeTab.historyIndex + 1;
    const newUrl = activeTab.history[newIndex];

    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId
          ? { ...tab, url: newUrl, historyIndex: newIndex }
          : tab
      )
    );
    setInputUrl(newUrl);
  };

  const refresh = () => {
    if (!activeTab) return;
    // Trigger iframe reload by updating key
    setTabs(
      tabs.map((tab) =>
        tab.id === activeTabId
          ? { ...tab }
          : tab
      )
    );
  };

  const goHome = () => {
    navigateToUrl('https://www.wikipedia.org');
  };

  const extractDomain = (url: string): string => {
    try {
      if (url === 'about:blank') return 'Neuer Tab';
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      navigateToUrl(inputUrl);
    }
  };

  return (
    <div className="w-full h-full max-w-7xl mx-auto bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
      {/* Tab Bar */}
      <div className="bg-gray-200 flex items-end gap-1 px-2 pt-2">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg cursor-pointer transition-colors ${
              activeTabId === tab.id
                ? 'bg-white'
                : 'bg-gray-300 hover:bg-gray-350'
            }`}
            onClick={() => switchTab(tab.id)}
          >
            <Globe className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="text-sm max-w-[150px] truncate">{tab.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="hover:bg-gray-200 rounded p-1 transition-colors"
              disabled={tabs.length === 1}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <button
          onClick={createNewTab}
          className="p-2 hover:bg-gray-300 rounded-t-lg transition-colors"
          title="Neuer Tab"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-2">
        <button
          onClick={goBack}
          disabled={!activeTab || activeTab.historyIndex === 0}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Zurück"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goForward}
          disabled={!activeTab || activeTab.historyIndex === activeTab.history.length - 1}
          className="p-2 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Vorwärts"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <button
          onClick={refresh}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Aktualisieren"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
        <button
          onClick={goHome}
          className="p-2 hover:bg-gray-100 rounded transition-colors"
          title="Startseite"
        >
          <House className="w-5 h-5" />
        </button>

        {/* Address Bar */}
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
          <input
            type="text"
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="URL eingeben oder suchen..."
            className="flex-1 bg-transparent outline-none"
          />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white relative">
        {activeTab && activeTab.url !== 'about:blank' ? (
          <iframe
            key={`${activeTab.id}-${activeTab.url}`}
            src={activeTab.url}
            className="w-full h-full border-none"
            title={activeTab.title}
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <Globe className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h2 className="text-gray-400 mb-2">Neuer Tab</h2>
              <p className="text-gray-400 text-sm">Gib eine URL ein, um zu starten</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

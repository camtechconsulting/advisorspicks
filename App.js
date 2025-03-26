
import React, { useState, useEffect } from 'react';
import './App.css';

const tabs = ['TradingView', 'Profit.com', 'Trendlyne'];

function App() {
  const [activeTab, setActiveTab] = useState('TradingView');
  const [trendlyneStock, setTrendlyneStock] = useState('M&M');
  const [inputSymbol, setInputSymbol] = useState('');

  useEffect(() => {
    const container = document.getElementById('widget-container');
    container.innerHTML = '';

    if (activeTab === 'TradingView') {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
      script.async = true;
      script.innerHTML = JSON.stringify({
        width: '100%',
        height: '100%',
        defaultColumn: 'overview',
        defaultScreen: 'most_capitalized',
        market: 'america',
        showToolbar: true,
        colorTheme: 'dark',
        locale: 'en',
        isTransparent: false
      });
      const containerDiv = document.createElement('div');
      containerDiv.className = 'tradingview-widget-container__widget';
      container.appendChild(containerDiv);
      container.appendChild(script);
    }

    if (activeTab === 'Profit.com') {
      container.innerHTML = `
        <iframe style="border: none; width:100%; height: 100%;" data-widget-name="ScreenerWidget"
          src="https://widget.darqube.com/screener-widget?token=67e44fe80f1fb4e115255fb0"
          id="ScreenerWidget-5r51mzn"></iframe>
        <script>
          window.top.addEventListener("message", function(msg) {
            const widget = document.getElementById('ScreenerWidget-5r51mzn');
            if (!widget) return;
            const styles = msg.data?.styles;
            const token = msg.data?.token;
            const urlToken = new URL(widget.src)?.searchParams?.get?.('token');
            if (styles && token === urlToken) {
              Object.keys(styles).forEach(key => widget.style.setProperty(key, styles[key]))
            }
          });
        </script>
      `;
    }

    if (activeTab === 'Trendlyne') {
      const oldScript = document.querySelector('script[src*="trendlyne.com"]');
      if (oldScript) oldScript.remove();

      setTimeout(() => {
        const wrapper = document.createElement('div');
        wrapper.className = 'trendlyne-wrapper';

        const block = document.createElement('blockquote');
        block.className = 'trendlyne-widgets';
        block.setAttribute('data-get-url', `https://trendlyne.com/web-widget/qvt-widget/Poppins/${trendlyneStock}/?posCol=00A25B&primaryCol=006AFF&negCol=EB3B00&neuCol=F7941E`);
        block.setAttribute('data-theme', 'dark');
        wrapper.appendChild(block);

        const script = document.createElement('script');
        script.src = 'https://cdn-static.trendlyne.com/static/js/webwidgets/tl-widgets.js';
        script.async = true;
        script.charset = 'utf-8';

        container.appendChild(wrapper);
        container.appendChild(script);
      }, 100);
    }
  }, [activeTab, trendlyneStock]);

  const handleStockChange = () => {
    if (inputSymbol.trim() !== '') {
      setTrendlyneStock(inputSymbol.toUpperCase());
    }
  };

  return (
    <div className="App">
      <h1>Advisors' Picks Screener</h1>
      <div className="tabs">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'active' : ''}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Trendlyne' && (
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Stock Symbol (e.g. AAPL)"
            value={inputSymbol}
            onChange={(e) => setInputSymbol(e.target.value)}
          />
          <button onClick={handleStockChange}>Load</button>
        </div>
      )}

      <div id="widget-container" className="widget-container"></div>
    </div>
  );
}

export default App;

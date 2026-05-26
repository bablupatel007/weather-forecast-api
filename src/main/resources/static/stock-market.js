/* ========================================
   ICA STOCK MARKET STUDIO - JAVASCRIPT
   Advanced AI-Powered Financial Analytics
   ======================================== */

// Stock Market Data Store
const ICAStockMarket = {
    // Market data
    stocks: [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 178.50, sector: 'Technology' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, sector: 'Technology' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.80, sector: 'Technology' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, sector: 'Consumer' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.50, sector: 'Automotive' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.30, sector: 'Technology' },
        { symbol: 'META', name: 'Meta Platforms', price: 485.20, sector: 'Technology' },
        { symbol: 'JPM', name: 'JPMorgan Chase', price: 195.40, sector: 'Finance' },
        { symbol: 'V', name: 'Visa Inc.', price: 275.60, sector: 'Finance' },
        { symbol: 'WMT', name: 'Walmart Inc.', price: 165.80, sector: 'Retail' },
        { symbol: 'JNJ', name: 'Johnson & Johnson', price: 158.90, sector: 'Healthcare' },
        { symbol: 'PG', name: 'Procter & Gamble', price: 162.30, sector: 'Consumer' },
        { symbol: 'XOM', name: 'Exxon Mobil', price: 112.50, sector: 'Energy' },
        { symbol: 'BAC', name: 'Bank of America', price: 35.80, sector: 'Finance' },
        { symbol: 'DIS', name: 'Walt Disney Co.', price: 112.40, sector: 'Entertainment' }
    ],
    
    indices: [
        { symbol: 'S&P 500', value: 5200, change: 0 },
        { symbol: 'NASDAQ', value: 16500, change: 0 },
        { symbol: 'DOW', value: 38500, change: 0 },
        { symbol: 'NIFTY 50', value: 22500, change: 0 }
    ],
    
    sectors: [
        { name: 'Technology', icon: '💻', performance: 0 },
        { name: 'Finance', icon: '🏦', performance: 0 },
        { name: 'Healthcare', icon: '🏥', performance: 0 },
        { name: 'Energy', icon: '⚡', performance: 0 },
        { name: 'Consumer', icon: '🛒', performance: 0 },
        { name: 'Industrial', icon: '🏭', performance: 0 }
    ],
    
    // Initialize the ICA Studio
    init: function() {
        this.setupTabs();
        this.generateTicker();
        this.generateOverview();
        this.startLiveUpdates();
    },
    
    // Setup tab navigation
    setupTabs: function() {
        const tabs = document.querySelectorAll('.ica-stock-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs and contents
                document.querySelectorAll('.ica-stock-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.ica-stock-tab-content').forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
                
                // Load content based on tab
                this.loadTabContent(tabId);
            });
        });
    },
    
    // Load content for specific tab
    loadTabContent: function(tabId) {
        switch(tabId) {
            case 'tab-overview':
                this.generateOverview();
                break;
            case 'tab-analytics':
                this.generateAnalytics();
                break;
            case 'tab-news':
                this.generateNews();
                break;
            case 'tab-predictions':
                this.generatePredictions();
                break;
            case 'tab-watchlist':
                this.generateWatchlist();
                break;
        }
    },
    
    // Generate live ticker
    generateTicker: function() {
        const tickerTrack = document.getElementById('tickerTrack');
        if (!tickerTrack) return;
        
        // Update indices with random changes
        this.indices.forEach(index => {
            index.change = (Math.random() * 2 - 1).toFixed(2);
        });
        
        // Create ticker items (duplicate for seamless loop)
        const tickerHTML = this.indices.concat(this.indices).map(index => {
            const isPositive = parseFloat(index.change) >= 0;
            return `
                <div class="ica-stock-ticker-item">
                    <span class="ica-stock-ticker-symbol">${index.symbol}</span>
                    <span class="ica-stock-ticker-price">${index.value.toLocaleString()}</span>
                    <span class="ica-stock-ticker-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '▲' : '▼'} ${Math.abs(index.change)}%
                    </span>
                </div>
            `;
        }).join('');
        
        tickerTrack.innerHTML = tickerHTML;
    },
    
    // Generate Overview tab content
    generateOverview: function() {
        this.generateMarketHeatmap();
        this.generateAIInsights();
        this.generateTrendingStocks();
        this.generateMarketSentiment();
    },
    
    // Generate Market Heatmap
    generateMarketHeatmap: function() {
        const heatmap = document.getElementById('marketHeatmap');
        if (!heatmap) return;
        
        const heatmapHTML = this.stocks.slice(0, 12).map(stock => {
            const change = (Math.random() * 10 - 5).toFixed(2);
            const isPositive = parseFloat(change) >= 0;
            const intensity = Math.abs(change) / 5;
            
            let bgColor;
            if (isPositive) {
                bgColor = `rgba(0, 228, 0, ${0.3 + intensity * 0.5})`;
            } else {
                bgColor = `rgba(255, 0, 0, ${0.3 + intensity * 0.5})`;
            }
            
            return `
                <div class="ica-stock-heatmap-cell" style="background: ${bgColor};">
                    <div class="ica-stock-heatmap-symbol">${stock.symbol}</div>
                    <div class="ica-stock-heatmap-change">${isPositive ? '+' : ''}${change}%</div>
                </div>
            `;
        }).join('');
        
        heatmap.innerHTML = heatmapHTML;
    },
    
    // Generate AI Insights
    generateAIInsights: function() {
        const insights = document.getElementById('aiInsights');
        if (!insights) return;
        
        const insightData = [
            { icon: '📈', text: 'Strong bullish momentum detected in tech sector', type: 'bullish', badge: 'HIGH' },
            { icon: '⚠️', text: 'Increased volatility expected in energy stocks', type: 'neutral', badge: 'MEDIUM' },
            { icon: '💹', text: 'Volume breakout identified in NVDA', type: 'bullish', badge: 'HIGH' },
            { icon: '🎯', text: 'Resistance zone approaching for S&P 500 at 5,250', type: 'neutral', badge: 'MEDIUM' },
            { icon: '📊', text: 'Market sentiment remains positive with 68% bullish indicators', type: 'bullish', badge: 'LOW' }
        ];
        
        const insightsHTML = insightData.map(insight => `
            <div class="ica-stock-insight-item ${insight.type}">
                <div class="ica-stock-insight-icon">${insight.icon}</div>
                <div class="ica-stock-insight-text">${insight.text}</div>
                <div class="ica-stock-insight-badge ${insight.badge.toLowerCase()}">${insight.badge}</div>
            </div>
        `).join('');
        
        insights.innerHTML = insightsHTML;
    },
    
    // Generate Trending Stocks
    generateTrendingStocks: function() {
        const trending = document.getElementById('trendingStocks');
        if (!trending) return;
        
        const trendingStocks = this.stocks.slice(0, 5).map((stock, index) => {
            const change = (Math.random() * 8 - 2).toFixed(2);
            const isPositive = parseFloat(change) >= 0;
            const price = (stock.price * (1 + parseFloat(change) / 100)).toFixed(2);
            
            return `
                <div class="ica-stock-list-item">
                    <div class="ica-stock-list-rank">${index + 1}</div>
                    <div class="ica-stock-list-info">
                        <div class="ica-stock-list-symbol">${stock.symbol}</div>
                        <div class="ica-stock-list-name">${stock.name}</div>
                    </div>
                    <div class="ica-stock-list-price">
                        <div class="ica-stock-list-value">$${price}</div>
                        <div class="ica-stock-list-change ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '▲' : '▼'} ${Math.abs(change)}%
                        </div>
                    </div>
                    <canvas class="ica-stock-list-graph" id="trend-${stock.symbol}"></canvas>
                </div>
            `;
        }).join('');
        
        trending.innerHTML = trendingStocks;
        
        // Draw mini graphs
        setTimeout(() => {
            this.stocks.slice(0, 5).forEach(stock => {
                this.drawMiniGraph(`trend-${stock.symbol}`);
            });
        }, 100);
    },
    
    // Generate Market Sentiment
    generateMarketSentiment: function() {
        const sentiment = Math.floor(Math.random() * 30) + 55; // 55-85
        const sentimentValue = document.getElementById('sentimentValue');
        const sentimentLabel = document.getElementById('sentimentLabel');
        const sentimentDesc = document.getElementById('sentimentDesc');
        
        if (sentimentValue) sentimentValue.textContent = sentiment;
        
        if (sentimentLabel && sentimentDesc) {
            if (sentiment >= 70) {
                sentimentLabel.textContent = 'Bullish';
                sentimentLabel.style.color = '#00E400';
                sentimentDesc.textContent = 'Strong positive market sentiment with high buying pressure';
            } else if (sentiment >= 50) {
                sentimentLabel.textContent = 'Neutral';
                sentimentLabel.style.color = '#FFA500';
                sentimentDesc.textContent = 'Balanced market conditions with mixed signals';
            } else {
                sentimentLabel.textContent = 'Bearish';
                sentimentLabel.style.color = '#FF0000';
                sentimentDesc.textContent = 'Negative market sentiment with selling pressure';
            }
        }
    },
    
    // Generate Analytics tab content
    generateAnalytics: function() {
        this.generateTopGainers();
        this.generateTopLosers();
        this.generateVolumeAnalysis();
        this.generateSectorPerformance();
    },
    
    // Generate Top Gainers
    generateTopGainers: function() {
        const gainers = document.getElementById('topGainers');
        if (!gainers) return;
        
        const gainersData = this.stocks.slice(0, 5).map((stock, index) => {
            const change = (Math.random() * 5 + 2).toFixed(2);
            const price = (stock.price * (1 + parseFloat(change) / 100)).toFixed(2);
            
            return `
                <div class="ica-stock-list-item">
                    <div class="ica-stock-list-rank">${index + 1}</div>
                    <div class="ica-stock-list-info">
                        <div class="ica-stock-list-symbol">${stock.symbol}</div>
                        <div class="ica-stock-list-name">${stock.name}</div>
                    </div>
                    <div class="ica-stock-list-price">
                        <div class="ica-stock-list-value">$${price}</div>
                        <div class="ica-stock-list-change positive">▲ ${change}%</div>
                    </div>
                    <canvas class="ica-stock-list-graph" id="gainer-${stock.symbol}"></canvas>
                </div>
            `;
        }).join('');
        
        gainers.innerHTML = gainersData;
        
        setTimeout(() => {
            this.stocks.slice(0, 5).forEach(stock => {
                this.drawMiniGraph(`gainer-${stock.symbol}`, true);
            });
        }, 100);
    },
    
    // Generate Top Losers
    generateTopLosers: function() {
        const losers = document.getElementById('topLosers');
        if (!losers) return;
        
        const losersData = this.stocks.slice(5, 10).map((stock, index) => {
            const change = (Math.random() * 5 + 2).toFixed(2);
            const price = (stock.price * (1 - parseFloat(change) / 100)).toFixed(2);
            
            return `
                <div class="ica-stock-list-item">
                    <div class="ica-stock-list-rank">${index + 1}</div>
                    <div class="ica-stock-list-info">
                        <div class="ica-stock-list-symbol">${stock.symbol}</div>
                        <div class="ica-stock-list-name">${stock.name}</div>
                    </div>
                    <div class="ica-stock-list-price">
                        <div class="ica-stock-list-value">$${price}</div>
                        <div class="ica-stock-list-change negative">▼ ${change}%</div>
                    </div>
                    <canvas class="ica-stock-list-graph" id="loser-${stock.symbol}"></canvas>
                </div>
            `;
        }).join('');
        
        losers.innerHTML = losersData;
        
        setTimeout(() => {
            this.stocks.slice(5, 10).forEach(stock => {
                this.drawMiniGraph(`loser-${stock.symbol}`, false);
            });
        }, 100);
    },
    
    // Generate Volume Analysis
    generateVolumeAnalysis: function() {
        const volumeBars = document.getElementById('volumeBars');
        if (!volumeBars) return;
        
        const volumes = Array.from({ length: 10 }, () => Math.random() * 100);
        const maxVolume = Math.max(...volumes);
        
        const barsHTML = volumes.map(volume => {
            const height = (volume / maxVolume) * 100;
            return `<div class="ica-stock-volume-bar" style="height: ${height}%" data-value="${volume.toFixed(0)}M"></div>`;
        }).join('');
        
        volumeBars.innerHTML = barsHTML;
    },
    
    // Generate Sector Performance
    generateSectorPerformance: function() {
        const sectors = document.getElementById('sectorPerformance');
        if (!sectors) return;
        
        const sectorsHTML = this.sectors.map(sector => {
            const performance = (Math.random() * 10 - 5).toFixed(2);
            const isPositive = parseFloat(performance) >= 0;
            const width = Math.abs(performance) * 10;
            
            return `
                <div class="ica-stock-sector-item">
                    <div class="ica-stock-sector-icon">${sector.icon}</div>
                    <div class="ica-stock-sector-info">
                        <div class="ica-stock-sector-name">${sector.name}</div>
                        <div class="ica-stock-sector-bar">
                            <div class="ica-stock-sector-fill ${isPositive ? 'positive' : 'negative'}" style="width: ${width}%"></div>
                        </div>
                    </div>
                    <div class="ica-stock-sector-change ${isPositive ? 'positive' : 'negative'}">
                        ${isPositive ? '+' : ''}${performance}%
                    </div>
                </div>
            `;
        }).join('');
        
        sectors.innerHTML = sectorsHTML;
    },
    
    // Generate News tab content
    generateNews: function() {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;
        
        const newsData = [
            { title: 'Tech Stocks Rally on Strong Earnings', time: '2 hours ago', sentiment: 'bullish' },
            { title: 'Federal Reserve Maintains Interest Rates', time: '4 hours ago', sentiment: 'neutral' },
            { title: 'Energy Sector Faces Headwinds', time: '6 hours ago', sentiment: 'bearish' },
            { title: 'AI Companies See Record Investment', time: '8 hours ago', sentiment: 'bullish' },
            { title: 'Market Volatility Expected This Week', time: '10 hours ago', sentiment: 'neutral' }
        ];
        
        const newsHTML = newsData.map(news => `
            <div class="ica-stock-insight-item ${news.sentiment}">
                <div class="ica-stock-insight-icon">📰</div>
                <div class="ica-stock-insight-text">
                    <strong>${news.title}</strong><br>
                    <small style="opacity: 0.7;">${news.time}</small>
                </div>
            </div>
        `).join('');
        
        newsContainer.innerHTML = newsHTML;
    },
    
    // Generate Predictions tab content
    generatePredictions: function() {
        const predictions = document.getElementById('predictionsContainer');
        if (!predictions) return;
        
        const predictionData = [
            { stock: 'AAPL', prediction: 'Upward', confidence: 85, target: 195 },
            { stock: 'MSFT', prediction: 'Upward', confidence: 78, target: 445 },
            { stock: 'GOOGL', prediction: 'Neutral', confidence: 65, target: 145 },
            { stock: 'TSLA', prediction: 'Downward', confidence: 72, target: 235 },
            { stock: 'NVDA', prediction: 'Upward', confidence: 92, target: 950 }
        ];
        
        const predictionsHTML = predictionData.map(pred => {
            const type = pred.prediction === 'Upward' ? 'bullish' : pred.prediction === 'Downward' ? 'bearish' : 'neutral';
            const icon = pred.prediction === 'Upward' ? '📈' : pred.prediction === 'Downward' ? '📉' : '➡️';
            
            return `
                <div class="ica-stock-insight-item ${type}">
                    <div class="ica-stock-insight-icon">${icon}</div>
                    <div class="ica-stock-insight-text">
                        <strong>${pred.stock}</strong> - ${pred.prediction} trend predicted<br>
                        <small style="opacity: 0.7;">Target: $${pred.target} | Confidence: ${pred.confidence}%</small>
                    </div>
                    <div class="ica-stock-insight-badge ${pred.confidence >= 80 ? 'high' : pred.confidence >= 65 ? 'medium' : 'low'}">
                        ${pred.confidence}%
                    </div>
                </div>
            `;
        }).join('');
        
        predictions.innerHTML = predictionsHTML;
    },
    
    // Generate Watchlist tab content
    generateWatchlist: function() {
        const watchlist = document.getElementById('watchlistContainer');
        if (!watchlist) return;
        
        const watchlistData = this.stocks.slice(0, 8).map((stock, index) => {
            const change = (Math.random() * 6 - 3).toFixed(2);
            const isPositive = parseFloat(change) >= 0;
            const price = (stock.price * (1 + parseFloat(change) / 100)).toFixed(2);
            
            return `
                <div class="ica-stock-list-item">
                    <div class="ica-stock-list-rank">⭐</div>
                    <div class="ica-stock-list-info">
                        <div class="ica-stock-list-symbol">${stock.symbol}</div>
                        <div class="ica-stock-list-name">${stock.name}</div>
                    </div>
                    <div class="ica-stock-list-price">
                        <div class="ica-stock-list-value">$${price}</div>
                        <div class="ica-stock-list-change ${isPositive ? 'positive' : 'negative'}">
                            ${isPositive ? '▲' : '▼'} ${Math.abs(change)}%
                        </div>
                    </div>
                    <canvas class="ica-stock-list-graph" id="watch-${stock.symbol}"></canvas>
                </div>
            `;
        }).join('');
        
        watchlist.innerHTML = watchlistData;
        
        setTimeout(() => {
            this.stocks.slice(0, 8).forEach(stock => {
                this.drawMiniGraph(`watch-${stock.symbol}`);
            });
        }, 100);
    },
    
    // Draw mini graph on canvas
    drawMiniGraph: function(canvasId, forcePositive = null) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width = canvas.offsetWidth * 2;
        const height = canvas.height = canvas.offsetHeight * 2;
        
        ctx.clearRect(0, 0, width, height);
        
        // Generate data points
        const points = 10;
        const data = [];
        let value = 50;
        
        for (let i = 0; i < points; i++) {
            value += (Math.random() - 0.5) * 20;
            value = Math.max(20, Math.min(80, value));
            data.push(value);
        }
        
        // Determine if positive or negative trend
        const isPositive = forcePositive !== null ? forcePositive : data[points - 1] > data[0];
        
        // Ensure trend matches
        if (forcePositive !== null) {
            if (forcePositive) {
                data[points - 1] = Math.max(data[points - 1], data[0] + 15);
            } else {
                data[points - 1] = Math.min(data[points - 1], data[0] - 15);
            }
        }
        
        // Draw line
        ctx.beginPath();
        ctx.strokeStyle = isPositive ? '#00E400' : '#FF0000';
        ctx.lineWidth = 3;
        
        const stepX = width / (points - 1);
        data.forEach((value, index) => {
            const x = index * stepX;
            const y = height - (value / 100 * height);
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();
        
        // Draw area
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = isPositive ? 'rgba(0, 228, 0, 0.15)' : 'rgba(255, 0, 0, 0.15)';
        ctx.fill();
    },
    
    // Start live updates
    startLiveUpdates: function() {
        // Update ticker every 3 seconds
        setInterval(() => {
            this.generateTicker();
        }, 3000);
        
        // Update active tab content every 5 seconds
        setInterval(() => {
            const activeTab = document.querySelector('.ica-stock-tab.active');
            if (activeTab) {
                const tabId = activeTab.getAttribute('data-tab');
                this.loadTabContent(tabId);
            }
        }, 5000);
    }
};

// Initialize when Stock Market page is active
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the stock market page
    const stockMarketPage = document.getElementById('page-stock-market');
    if (stockMarketPage) {
        // Initialize when the page becomes active
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.target.classList.contains('active')) {
                    ICAStockMarket.init();
                }
            });
        });
        
        observer.observe(stockMarketPage, {
            attributes: true,
            attributeFilter: ['class']
        });
        
        // Initialize immediately if already active
        if (stockMarketPage.classList.contains('active')) {
            ICAStockMarket.init();
        }
    }
});

// Made with Bob

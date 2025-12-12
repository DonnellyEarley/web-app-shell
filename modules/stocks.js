// Stock tracker using Finnhub API
// Get your free API key at https://finnhub.io/register
const API_KEY = 'd4u7pehr01qu53udbgh0d4u7pehr01qu53udbghg'; // Replace with your free Finnhub API key
const API_BASE_URL = 'https://finnhub.io/api/v1';

let currentStockData = null;

document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const symbolInput = document.getElementById('symbolInput');
  const suggestionBtns = document.querySelectorAll('.suggestion-btn');

  // Show suggestions initially
  showSuggestions();

  // Search button functionality
  searchBtn.addEventListener('click', () => {
    const symbol = symbolInput.value.trim().toUpperCase();
    if (symbol) {
      searchStock(symbol);
    }
  });

  // Allow Enter key to search
  symbolInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const symbol = symbolInput.value.trim().toUpperCase();
      if (symbol) {
        searchStock(symbol);
      }
    }
  });

  // Suggestion buttons
  suggestionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const symbol = btn.getAttribute('data-symbol');
      symbolInput.value = symbol;
      searchStock(symbol);
    });
  });
});

function showSuggestions() {
  document.getElementById('suggestions').style.display = 'block';
  document.getElementById('stockDisplay').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}

function searchStock(symbol) {
  showLoading();
  fetchStockData(symbol);
}

function showLoading() {
  document.getElementById('loading').style.display = 'flex';
  document.getElementById('error').style.display = 'none';
  document.getElementById('stockDisplay').style.display = 'none';
  document.getElementById('suggestions').style.display = 'none';
}

function showError(message) {
  const errorDiv = document.getElementById('error');
  errorDiv.textContent = message;
  errorDiv.style.display = 'block';
  document.getElementById('loading').style.display = 'none';
  document.getElementById('stockDisplay').style.display = 'none';
  document.getElementById('suggestions').style.display = 'none';
}

async function fetchStockData(symbol) {
  try {
    // Fetch quote data
    const quoteResponse = await fetch(
      `${API_BASE_URL}/quote?symbol=${symbol}&token=${API_KEY}`
    );

    if (!quoteResponse.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const quoteData = await quoteResponse.json();

    // Check for API errors
    if (!quoteData.c) {
      showError(`No data found for symbol "${symbol}". Please check the symbol and try again.`);
      return;
    }

    // Fetch company profile
    const profileResponse = await fetch(
      `${API_BASE_URL}/stock/profile2?symbol=${symbol}&token=${API_KEY}`
    );
    const profileData = await profileResponse.json();

    currentStockData = {
      symbol: symbol,
      name: profileData.name || symbol,
      price: quoteData.c,
      open: quoteData.o,
      high: quoteData.h,
      low: quoteData.l,
      previous: quoteData.pc,
      volume: quoteData.v,
      changePercent: quoteData.dp,
      lastRefreshed: new Date().toLocaleString()
    };

    displayStockData(currentStockData);
    document.getElementById('loading').style.display = 'none';
  } catch (error) {
    console.error('Error fetching stock data:', error);
    showError('Failed to fetch stock data. Please try again later.');
  }
}

function displayStockData(stock) {
  // Calculate change from previous close
  const change = stock.price - stock.previous;
  const changePercent = stock.changePercent || ((change / stock.previous) * 100).toFixed(2);

  // Update header
  document.getElementById('stockSymbol').textContent = stock.symbol;
  document.getElementById('stockName').textContent = stock.name;
  document.getElementById('stockPrice').textContent = `$${stock.price.toFixed(2)}`;

  const priceChangeEl = document.getElementById('priceChange');
  priceChangeEl.textContent = `${change > 0 ? '+' : ''}${change.toFixed(2)} (${changePercent.toFixed(2)}%)`;
  priceChangeEl.className = change >= 0 ? 'price-change positive' : 'price-change negative';

  // Update table
  document.getElementById('tablePrice').textContent = `$${stock.price.toFixed(2)}`;
  document.getElementById('tableOpen').textContent = `$${stock.open.toFixed(2)}`;
  document.getElementById('tableHigh').textContent = `$${stock.high.toFixed(2)}`;
  document.getElementById('tableLow').textContent = `$${stock.low.toFixed(2)}`;
  document.getElementById('tablePrevious').textContent = `$${stock.previous.toFixed(2)}`;
  document.getElementById('tableVolume').textContent = stock.volume ? parseInt(stock.volume).toLocaleString() : 'N/A';

  // Show stock display
  document.getElementById('stockDisplay').style.display = 'block';
  document.getElementById('suggestions').style.display = 'none';
  document.getElementById('error').style.display = 'none';
}

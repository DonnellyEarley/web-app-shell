// Initialize all charts when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initializeCharts();
});

function initializeCharts() {
  // Defaults
  Chart.defaults.font.family = "var(--font-family)";
  Chart.defaults.color = '#999';

  // Trend Chart (Line Chart)
  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  new Chart(revenueCtx, {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [{
        label: 'Revenue ($)',
        data: [32000, 35000, 38000, 36500, 42000, 45000, 48000, 46000, 50000, 52000, 51000, 45231],
        borderColor: '#4a90e2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#4a90e2',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });

  // Category Chart (Doughnut Chart)
  const categoryCtx = document.getElementById('categoryChart').getContext('2d');
  new Chart(categoryCtx, {
    type: 'doughnut',
    data: {
      labels: ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books'],
      datasets: [{
        data: [28, 22, 18, 17, 15],
        backgroundColor: [
          '#4a90e2',
          '#e74c3c',
          '#f39c12',
          '#27ae60',
          '#9b59b6'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            padding: 15,
            usePointStyle: true
          }
        }
      }
    }
  });

  // Growth Chart (Bar Chart)
  const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
  new Chart(userGrowthCtx, {
    type: 'bar',
    data: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
      datasets: [{
        label: 'New Users',
        data: [250, 320, 280, 410, 450, 520, 480, 550],
        backgroundColor: '#4a90e2',
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      indexAxis: 'x',
      plugins: {
        legend: {
          display: true,
          labels: {
            usePointStyle: true,
            padding: 15
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // Funnel Chart (Bar Chart - Horizontal)
  const conversionCtx = document.getElementById('conversionChart').getContext('2d');
  new Chart(conversionCtx, {
    type: 'bar',
    data: {
      labels: ['Visitors', 'Leads', 'Trials', 'Customers'],
      datasets: [{
        label: 'Count',
        data: [10000, 3500, 850, 210],
        backgroundColor: [
          'rgba(74, 144, 226, 0.8)',
          'rgba(74, 144, 226, 0.6)',
          'rgba(74, 144, 226, 0.4)',
          'rgba(74, 144, 226, 0.2)'
        ],
        borderColor: '#4a90e2',
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

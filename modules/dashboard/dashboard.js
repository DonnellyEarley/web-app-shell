const kpiData = [
  { title: "Users", value: 1200, icon: "users" },
  { title: "Sales", value: 3050, icon: "cart" },
  { title: "Revenue", value: "$12,400", icon: "credit-card" }
];

export function fetchKpiData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(kpiData);
    }, 500);
  });
}

export function fetchLineChartData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [{
          label: "Line Dataset",
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1
        }]
      });
    }, 500);
  });
}

export function fetchBarChartData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
          label: "Bar Dataset",
          data: [12, 19, 3, 5, 2, 3],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }]
      });
    }, 500);
  });
}

export async function renderKpiCards() {
  const kpiCardsContainer = document.getElementById("kpi-cards");
  if (!kpiCardsContainer) return;

  const data = await fetchKpiData();

  kpiCardsContainer.innerHTML = data.map(kpi => `
    <div class="uk-card uk-card-default uk-card-body uk-box-shadow-hover-medium uk-margin-right">
      <span uk-icon="icon: ${kpi.icon}; ratio: 2" class="uk-text-primary"></span>
      <h3 class="uk-card-title">${kpi.value}</h3>
      <p class="uk-text-meta">${kpi.title}</p>
    </div>
  `).join("");
}

export async function renderLineChart() {
  const ctx = document.getElementById("line-chart").getContext("2d");
  const data = await fetchLineChartData();
  new Chart(ctx, {
    type: "line",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Line Chart"
        }
      }
    }
  });
}

export async function renderBarChart() {
  const ctx = document.getElementById("bar-chart").getContext("2d");
  const data = await fetchBarChartData();
  new Chart(ctx, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Bar Chart"
        }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderKpiCards();
  await renderLineChart();
  await renderBarChart();
});

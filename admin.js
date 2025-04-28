<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Panel</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        #resultsChart {
            width: 100%;
            height: 400px;
        }
    </style>
</head>
<body>

<canvas id="resultsChart"></canvas>
<div id="total-votes">Total votes: 0</div>
<button id="reset-votes">Reset Votes</button>

<script>
// Chart configuration
let chart;
const platforms = ['Bubble', 'Power Apps', 'Adalo', 'App Sheet', 'Others'];
const colors = ['#4a6bff', '#6c63ff', '#ff6b6b', '#4ecdc4', '#ffd166'];

// Register custom plugin for percentage labels
Chart.register({
    id: 'percentageLabels',
    afterDatasetsDraw(chart) {
        const { ctx } = chart;
        ctx.save();
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = '12px Arial';

        chart.data.datasets.forEach((dataset, i) => {
            const meta = chart.getDatasetMeta(i);
            meta.data.forEach((bar, index) => {
                const data = dataset.data[index];
                const total = dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? (data / total * 100).toFixed(1) + '%' : '0%';
                ctx.fillText(percentage, bar.x + 10, bar.y);
            });
        });

        ctx.restore();
    }
});

// Initialize chart
function initChart() {
    const ctx = document.getElementById('resultsChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: platforms,
            datasets: [{
                data: platforms.map(() => 0),
                backgroundColor: colors,
                borderWidth: 1,
                borderRadius: 6,
                maxBarThickness: 60
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // horizontal bar
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? (value / total * 100).toFixed(1) : 0;
                            return `${value} votes (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { precision: 0 }
                },
                y: {
                    grid: { display: false }
                }
            }
        }
    });
}

// Update chart with new data
function updateChart(votes) {
    const totalVotes = Object.values(votes.platforms || {}).reduce((a, b) => a + b, 0);
    const voteCounts = platforms.map(platform => votes.platforms?.[platform] || 0);

    chart.data.datasets[0].data = voteCounts;
    chart.update();

    document.getElementById('total-votes').textContent = `Total votes: ${totalVotes}`;
}

// Reset all votes
function resetVotes() {
    if (confirm('Are you sure you want to reset all votes? This action cannot be undone.')) {
        const initialVotes = {
            teams: {},
            platforms: {
                'Bubble': 0,
                'Power Apps': 0,
                'Adalo': 0,
                'App Sheet': 0, // Corrected "App Sheet"
                'Others': 0
            }
        };
        localStorage.setItem('votes', JSON.stringify(initialVotes));
        updateChart(initialVotes);
    }
}

// Check admin credentials
function checkAdminLogin() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
        window.location.href = '/login.html';
    }
}

// Fetch votes from localStorage
function fetchVotes() {
    const votes = JSON.parse(localStorage.getItem('votes') || '{}');
    updateChart(votes);
}

// Initialize the admin page
document.addEventListener('DOMContentLoaded', () => {
    checkAdminLogin();
    initChart();
    fetchVotes();

    const resetButton = document.getElementById('reset-votes');
    if (resetButton) {
        resetButton.addEventListener('click', resetVotes);
    }

    // Fetch votes every 30 seconds
    setInterval(fetchVotes, 30000);
});
</script>

</body>
</html>

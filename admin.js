// Chart configuration
let chart;
const platforms = ['Bubble', 'Webflow', 'Adalo', 'Glide', 'Softr', 'Wix', 'Others'];
const colors = [
    '#4a6bff',
    '#6c63ff',
    '#ff6b6b',
    '#4ecdc4',
    '#ffd166',
    '#06d6a0',
    '#ef476f'
];

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
            indexAxis: 'y',  // Make it a horizontal bar chart
            plugins: {
                legend: {
                    display: false  // Hide legend since we don't need it for a single dataset
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
                    grid: {
                        display: false
                    },
                    ticks: {
                        precision: 0  // Show only whole numbers
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            },
            afterDraw: function (chart) {
                var ctx = chart.ctx;
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.font = '12px Arial';

                chart.data.datasets.forEach(function (dataset) {
                    chart.getDatasetMeta(0).data.forEach(function (bar, index) {
                        var data = dataset.data[index];
                        var total = dataset.data.reduce((a, b) => a + b, 0);
                        var percentage = total > 0 ? (data / total * 100).toFixed(1) + '%' : '0%';
                        ctx.fillText(percentage, bar.x + 10, bar.y);
                    });
                });
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
                'Webflow': 0,
                'Adalo': 0,
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
    // Check if admin is logged in
    checkAdminLogin();

    initChart();
    fetchVotes();

    // Set up reset button
    const resetButton = document.getElementById('reset-votes');
    if (resetButton) {
        resetButton.addEventListener('click', resetVotes);
    }

    // Fetch votes every 30 seconds
    setInterval(fetchVotes, 30000);
}); 

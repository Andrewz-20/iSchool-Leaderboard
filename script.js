// Replace with your published Google Sheets CSV URL
const SHEET_URL = 'https://api.allorigins.win/raw?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vTdpSgrmQc3oQH2LxE6vQsR6I9oJXVPT5JEBeVFKCaPETDE02FfQOfow3lwaDxz60XfkQfbX2XBxDpk/pub?output=csv';

// Fetch data and update leaderboard every 10 seconds
const UPDATE_INTERVAL = 10000; // 10 seconds

async function fetchData() {
    try {
        const response = await fetch(`${SHEET_URL}&nocache=${Math.random()}`);
        const csv = await response.text();
        const data = csvToArray(csv);
        // Process data: sort, distinct, limit to top 20
        const uniqueUsers = [...new Map(data.map(item => [item.Name, item])).values()];
        const sorted = uniqueUsers.sort((a, b) => b.XP - a.XP).slice(0, 20);

        // Generate HTML
        const list = document.getElementById('leaderboard');
        list.innerHTML = sorted.map((user, index) => `
            <li class="user-item">
                <div class="rank">${index + 1}</div>
                <img src="${user.ImageURL}" class="avatar" alt="${user.Name}">
                <div class="user-info">
                    <div class="name">${user.Name}</div>
                    <div class="xp">${user.XP} XP</div>
                </div>
                <div class="xp-badge">Level ${user.Level}</div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// CSV to JSON converter
function csvToArray(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        return line.split(',').reduce((acc, val, i) => {
            acc[headers[i]] = val.trim();
            return acc;
        }, {});
    });
}

// Initial fetch and periodic updates
fetchData();
setInterval(fetchData, UPDATE_INTERVAL);

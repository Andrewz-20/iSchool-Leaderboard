const SHEET_URL = 'https://api.allorigins.win/raw?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vTdpSgrmQc3oQH2LxE6vQsR6I9oJXVPT5JEBeVFKCaPETDE02FfQOfow3lwaDxz60XfkQfbX2XBxDpk/pub?output=csv';
const UPDATE_INTERVAL = 10000; // 10 seconds

async function fetchData() {
    try {
        const response = await fetch(`${SHEET_URL}&nocache=${Math.random()}`);
        const csv = await response.text();
        const data = csvToArray(csv);
        const uniqueUsers = [...new Map(data.map(item => [item.Name, item])).values()];
        const sorted = uniqueUsers.sort((a, b) => b.XP - a.XP);

        // Render Top 3 Users
        const topThreeContainer = document.getElementById('top-three');
        topThreeContainer.innerHTML = sorted.slice(0, 3).map((user, index) => `
            <div class="user-item">
                <div class="rank">${index + 1}</div>
                <img src="${user.ImageURL}" class="avatar" alt="${user.Name}">
                <div class="user-info">
                    <div class="name">${user.Name}</div>
                    <div class="xp">${user.XP} XP</div>
                </div>
            </div>
        `).join('');

        // Render Rest of the Users
        const list = document.getElementById('leaderboard');
        list.innerHTML = sorted.slice(3).map((user, index) => `
            <li class="user-item">
                <div class="rank">${index + 4}</div>
                <img src="${user.ImageURL}" class="avatar" alt="${user.Name}">
                <div class="user-info">
                    <div class="name">${user.Name}</div>
                    <div class="xp">${user.XP} XP</div>
                </div>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

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

fetchData();
setInterval(fetchData, UPDATE_INTERVAL);
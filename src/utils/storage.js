// Utility for localStorage history
const HISTORY_KEY = 'postman_history';

export function saveRequest(request) {
    const history = loadHistory();
    request.id = Date.now();
    history.unshift(request);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadHistory() {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

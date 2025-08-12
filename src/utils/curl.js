// Minimal cURL parser and generator for RequestComposer
export function parseCurl(curl) {
    // Basic regex-based parser for demo purposes
    const result = { method: 'GET', url: '', headers: '', body: '' };
    if (!curl.startsWith('curl')) return result;
    const urlMatch = curl.match(/curl\s+['"]?([^\s'"]+)['"]?/);
    if (urlMatch) result.url = urlMatch[1];
    const methodMatch = curl.match(/-X\s+(\w+)/);
    if (methodMatch) result.method = methodMatch[1];
    const headerMatches = [...curl.matchAll(/-H\s+'([^']+)'|-H\s+"([^"]+)"/g)];
    if (headerMatches.length) {
        const headers = {};
        headerMatches.forEach(m => {
            const h = m[1] || m[2];
            const [k, v] = h.split(/:\s*/);
            headers[k] = v;
        });
        result.headers = JSON.stringify(headers, null, 2);
    }
    const bodyMatch = curl.match(/--data-raw\s+'([^']+)'|--data-raw\s+"([^"]+)"|--data\s+'([^']+)'|--data\s+"([^"]+)"/);
    if (bodyMatch) {
        result.body = bodyMatch[1] || bodyMatch[2] || bodyMatch[3] || bodyMatch[4];
    }
    return result;
}

export function generateCurl({ url, method, headers, body }) {
    let curl = `curl -X ${method || 'GET'} '${url || ''}'`;
    try {
        const hdrs = headers ? JSON.parse(headers) : {};
        Object.entries(hdrs).forEach(([k, v]) => {
            curl += ` -H '${k}: ${v}'`;
        });
    } catch { }
    if (body) curl += ` --data-raw '${body}'`;
    return curl;
}

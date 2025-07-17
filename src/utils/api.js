// Utility for sending HTTP requests
export async function sendHttpRequest({ url, method, headers, body }) {
    // Timeout logic (10s)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    try {
        const res = await fetch(url, {
            method,
            headers: headers ? JSON.parse(headers) : {},
            body: method !== 'GET' ? body : undefined,
            signal: controller.signal
        });
        clearTimeout(timeout);
        const responseHeaders = {};
        res.headers.forEach((v, k) => responseHeaders[k] = v);
        const responseBody = await res.text();
        return {
            status: res.status,
            headers: JSON.stringify(responseHeaders, null, 2),
            body: responseBody,
            time: 0, // To be set by caller
            size: responseBody.length
        };
    } catch (e) {
        clearTimeout(timeout);
        return { status: 'error', headers: '', body: e.message || 'Network error', time: 0, size: 0 };
    }
}

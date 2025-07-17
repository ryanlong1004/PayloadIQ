// Utility for sending HTTP requests
export async function sendHttpRequest({ url, method, headers, body }) {
    try {
        const res = await fetch(url, {
            method,
            headers: headers ? JSON.parse(headers) : {},
            body: method !== 'GET' ? body : undefined
        });
        const responseHeaders = {};
        res.headers.forEach((v, k) => responseHeaders[k] = v);
        const responseBody = await res.text();
        return {
            status: res.status,
            headers: JSON.stringify(responseHeaders, null, 2),
            body: responseBody,
            time: 0, // To be implemented
            size: responseBody.length
        };
    } catch (e) {
        return { status: 'error', headers: '', body: e.message, time: 0, size: 0 };
    }
}

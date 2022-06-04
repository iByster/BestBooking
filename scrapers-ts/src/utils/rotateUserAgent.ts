import UserAgent from 'user-agents';

function rotateUserAgent(headers: any) {
    const userAgent = new UserAgent();
    headers['User-Agent'] = userAgent.toString();
    return headers;
}

export default rotateUserAgent;
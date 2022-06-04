const setContentLength = (headers: any, contentLength: number) => {
    headers['Content-Length'] = contentLength;
    return headers;
}

export default setContentLength;
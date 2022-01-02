function extractWindowOpenUrl(href) {
    const indexStart = href.indexOf('window.open')
    const indexEnd = href.indexOf(',')
    const windowOpen = href.substring(indexStart, indexEnd)
    const firstReplace = decodeURI(windowOpen.replace('window.open(\'', ''))
    return firstReplace.replace(/'/g, '')
}

module.exports = {
    extractWindowOpenUrl
}
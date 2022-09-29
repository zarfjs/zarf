

export function getMountPath(prefix: string, path: string): string {
    if(prefix.length === 0 || prefix === '/') {
        return path[0] === '/' ? path : `/${path}`
    } else {
        return `${prefix}${path}`
    }
}

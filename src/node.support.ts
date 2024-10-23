
const normalizePath = (path: string): string[] => {
    if (path.endsWith('/') || path.endsWith(',')) {
        path = path.slice(0, -1);
    }

    let parts = path.split('/').filter(part => part !== '');
    if (parts.length === 0) {
        throw new Error('Invalid Path: No Path encounter')
    }

    parts = parts.map(cur => cur.replace(/^[^a-zA-Z0-9-_\,]+|[^a-zA-Z0-9-_\,]+$/g, ''));

    return parts;
};

const validatePath = (path: string, obj: object) => {
    if (Array.isArray(obj)) {
        throw new Error('Invalid Format: The object is an array');
    }

    const Nodes = normalizePath(path);
    for (let i = 0; i < Nodes.length - 1; i++) {
        if (Nodes[i].includes(',')) {
            throw new Error('Invalid Path: The path contains a comma');
        }
    }

    let lastPath: string | string[] = Nodes[Nodes.length - 1];
    return {
        Navigation: Nodes,
        firstPath: Nodes[0],
        lastPath: lastPath,
        lastValues: lastPath.split(',')
    }

}

export const support = {
    normalizePath,
    validatePath
}
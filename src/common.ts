/**
 * Returns path of current directory's package.json
 */
export function getPkgJsonPath() {
    return `${process.cwd()}/package.json`
}
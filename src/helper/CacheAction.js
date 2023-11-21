import NodeCache from 'node-cache';

const cacheAllRecipe = new NodeCache();

export function setCache(key, value) {
    return cacheAllRecipe.set(key, value);
}

export function getCache(key) {
    return cacheAllRecipe.get(key);
}
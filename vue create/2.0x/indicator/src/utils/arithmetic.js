
import { resolve } from 'path';
import { url } from '@utils/regexp';


export function searchTree(element, key, val) {
  if (element[key] === val) {
    return element;
  } else if (element.items != null) {
    let i;
    let result = null;
    for (i = 0; result === null && i < element.items.length; i++) {
      result = searchTree(element.items[i], key, val);
    }
    return result;
  }
  return null;
}

export function searchTreeL(element, key) {
  if (element[key].length === 0) {
    return element;
  } else if (element[key].length !== 0) {
    let i;
    let result = null;
    for (i = 0; result === null && i < element.items.length; i++) {
      result = searchTreeL(element.items[i], key);
    }
    return result;
  }
  return null;
}

export function handleAuthMenu(element, baseUrl) {
  if (element.children.length === 0) {
    const url = resolvePath(baseUrl, element.menuUrl);
    return {...element, url};
  } else if (element.children.length !== 0) {
    const url = resolvePath(baseUrl, element.menuUrl);
    const arr = [];
    element.children.forEach(item => {
      arr.push(handleAuthMenu(item, url));
    });
    return {...element, url, children: arr};
  }
}

function resolvePath(basePath, path) {
  if (url.test(path)) {
    return path;
  }
  if (url.test(basePath)) {
    return basePath;
  }
  path = path.match(/^\/(.*)/) ? path.match(/^\/(.*)/)[1] : path;
  return resolve(basePath, path);
}

export function pathSlashFindActiveItem(obj, path) {
  const activeItems = searchTree(obj, 'url', path);
  if (activeItems) {
    return activeItems;
  }
  if (!path || path.lastIndexOf('/') === 0) {
    return null;
  } else {
    const url = path.substring(0, path.lastIndexOf('/'));
    return pathSlashFindActiveItem(obj, url);
  }
}

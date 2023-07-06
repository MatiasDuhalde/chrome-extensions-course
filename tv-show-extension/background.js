chrome.runtime.onInstalled.addListener((details) => {
  chrome.contextMenus.create({
    title: 'Sample Context Menu',
    id: 'context-menu-1',
    contexts: ['page', 'selection'],
  });

  chrome.contextMenus.create({
    title: 'Search Selection',
    id: 'context-menu-1',
    id: 'context-menu-search',
    parentId: 'context-menu-1',
    contexts: ['selection'],
  });
  chrome.contextMenus.create({
    title: 'Test 1',
    id: 'context-menu-sub-1',
    parentId: 'context-menu-1',
    contexts: ['page', 'selection'],
  });
  chrome.contextMenus.create({
    title: 'Test 2',
    id: 'context-menu-sub-2',
    parentId: 'context-menu-1',
    contexts: ['page', 'selection'],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    const { menuItemId } = info;
    if (menuItemId === 'context-menu-1') {
      console.log(info);
      console.log(tab);
    } else if (menuItemId === 'context-menu-search') {
      const { selectionText } = info;
      const url = `https://www.imdb.com/find?q=${selectionText}`;
      chrome.tabs.create({
        url,
      });
    }
  });
});

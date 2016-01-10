var BrowserWindow = require('electron').remote.BrowserWindow;
var UserStore = require('../../stores/user-store.js');
var Logger = require('../../logger.js');

var win;

// official Steam client uses this as their user agent
var USER_AGENT = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US; Valve Steam Client/1451445940; ) ' + // eslint-disable-line no-unused-vars
                 'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.49 Safari/537.36';

function open(url) {
  var cookies = UserStore.getWebSession().cookies;

  // if we don't have cookies, abort
  if(cookies.length === 0) {
    Logger.debug('SteamCommunityWindow: cookies are missing');
    return;
  }

  if(win) {
    Logger.debug('SteamCommunityWindow: reusing existing instance');
    win.loadURL(url);
    return win;
  }

  Logger.debug('SteamCommunityWindow: creating new instance');

  win = new BrowserWindow({
    width: 1024,
    height: 768,
    show: false,
    center: true,
    title: 'Loading...',
    webPreferences: {
      nodeIntegration: false,
      allowDisplayingInsecureContent: true,
      allowRunningInsecureContent: true
    },
    autoHideMenuBar: true
  });

  win.on('closed', function() {
    win = null;
  });

  win.webContents.on('new-window', function(event, newUrl) {
    event.preventDefault();
    Logger.debug('SteamCommunityWindow: opening new url');
    win.loadURL(newUrl);
  });

  cookies.forEach(function(cookie) {
    var split = cookie.split('=');

    win.webContents.session.cookies.set({
      url : 'https://steamcommunity.com',
      name : split[0],
      value : split[1],
      session: split[0].indexOf('steamLogin') > -1 ? true : false,
      secure: split[0] === 'steamLoginSecure'
    }, function(){});

    win.webContents.session.cookies.set({
      url : 'https://store.steampowered.com',
      name : split[0],
      value : split[1],
      session: split[0].indexOf('steamLogin') > -1 ? true : false,
      secure: split[0] === 'steamLoginSecure'
    }, function(){});
  });

  win.loadURL(url);
  win.show();
}

var SteamCommunityWindow = {
  open: open
};

module.exports = SteamCommunityWindow;

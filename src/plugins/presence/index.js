const SteamUser = require('steam-user');

const Dispatcher = require('../../dispatcher');
const Constants = require('../../constants');

/**
 * Presence
 * Handles online state and display name changes.
 */
module.exports = function(steamUser) {
  steamUser.on('loggedOn', (response) => {
    if (response.eresult === SteamUser.EResult.OK) {
      steamUser.setPersona(SteamUser.EPersonaState.Online);
    }
  });

  Dispatcher.register((action) => {
    switch(action.type) {
      case Constants.UserActions.USER_CHANGE_STATE:
        steamUser.setPersona(action.state);
        break;

      case Constants.UserActions.USER_CHANGE_NAME:
        // TODO: Not sure if `null` works; need to test
        steamUser.setPersona(null, action.name);
        break;

      default:
        // ignore
    }
  });
};

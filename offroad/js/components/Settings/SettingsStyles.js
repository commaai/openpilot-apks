import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  settings: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,.03)',
    flex: 1,
  },
  settingsHeader: {
    borderBottomWidth: 2,
    borderBottomColor: 'rgba(0,0,0,.05)',
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    paddingTop: 5,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
  },
  settingsHeaderBackIcon: {
    height: '100%',
    transform: [{ rotate: '-90deg' }],
    width: '100%',
  },
  settingsWindow: {
    height: 'auto',
    paddingLeft: 10,
    paddingRight: 10,
  },
  settingsMenuItem: {
    borderRightWidth: 1,
    borderRightColor: 'rgba(233,233,233,.05)',
    display: 'flex',
    height: '100%',
    width: '25%',
  },
  settingsMenuItemBorderless: {
    borderRightWidth: 0,
  },
  settingsMenuItemButton: {
    alignItems: 'center',
    borderRadius: 0,
    borderWidth: 0,
  },
  settingsMenuItemIcon: {
    height: 50,
    marginTop: 10,
    width: 50,
  },
  settingsMenuItemTitle: {
    alignItems: 'center',
    display: 'flex',
    paddingTop: 3,
    paddingBottom: 3,
  },
  settingsMenuItemContext: {
    alignItems: 'center',
    display: 'flex',
    paddingBottom: 20,
  },
  settingsSpeedLimitOffset: {
    alignItems: 'center',
    display: 'flex',
    height: 66,
    flexDirection: 'row',
    width: '100%',
  },
  settingsNumericButton: {
    backgroundColor: 'transparent',
    height: 22,
    width: 22,
  },
  settingsNumericIcon: {
    display: 'flex',
    height: 22,
    width: '100%',
  },
  settingsNumericValue: {
    textAlign: 'center',
    width: 40,
  },
  githubUsernameInputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  githubUsernameInput: {
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingLeft: 8,
    width: 200,
    height: 38,
    color: 'rgba(0,0,0,0.9)',
  },
  githubUsernameInputLabel: {
    paddingTop: 7,
    paddingRight: 15,
  },
  githubUsernameInputResultIcon: {
    width: 30,
    maxWidth: 30,
    height: 30,
  },
  githubUsernameInputStatus: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubUsernameSaveButton: {
    minWidth: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubSshKeyClearContainer: {
    paddingTop: 20,
  },
})

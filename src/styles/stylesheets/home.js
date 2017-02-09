import {colors} from '../resources'

export default StyleSheet => StyleSheet.extend({
  container: {
    flex: 1
  },

  nearbyContainer: {
    flex: 1
  },

  listIcon: {
    backgroundColor: colors.pink,
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  nearbyMapContainer: {
    flex: 1
  },
})

import { getSelfProfile } from 'api/ProfileApi';

/**
 * A singleton for storing user profile
 */
class ProfileStore {
  /**
   * @constructor
   * The constructor
   *
   * Initializes profile to null
   */
  constructor () {
    this.profile = null;
  }

  /**
   * Populate the store with a profile object
   * @param  {Object} profile The logged in user's profile
   */
  populate (profile) {
    this.profile = profile;
  }

  /**
   * Get the stored profile of the user in the application
   * @return {Object} The stored profile
   */
  getProfile () {
    return this.profile;
  }

  /**
   * Fetch and store user profile.
   *
   * If an error occurs, we store an anonymous profile so that user
   * can still work with the app, but APIs will be validated with permissions
   *
   * When we implement permissions for user, only basic read permission for bog
   * standard user will be supplied.
   */
  async fetchProfile () {
    try {
      let profile = await getSelfProfile();
      this.profile = profile;
    } catch (e) {
      this.profile = {
        name: 'Unknown User',
        email: 'unknown@bigpiventures.com',
        organizations: [],
        currentOrganization: null
      };
    }
  }
}

export default new ProfileStore();

import ProfileStore from '../ProfileStore';

import * as profileApi from 'api/ProfileApi';

const PROFILE = { name: 'Hello' };

describe('ProfileStore', () => {
  describe('initialization', () => {
    let spy;
    beforeEach(() => {
      spy = jest
        .spyOn(profileApi, 'getSelfProfile')
        .mockImplementation(() => null);
      ProfileStore.profile = null;
    });

    it('Initializes profile to null', () => {
      expect(ProfileStore.getProfile()).toBe(null);
    });

    it('does not make API call to get profile', () => {
      expect(spy).not.toHaveBeenCalled();
    });

    afterEach(() => {
      spy.mockRestore();
    });
  });

  describe('methods', () => {
    let spy;
    beforeEach(() => {
      spy = jest
        .spyOn(profileApi, 'getSelfProfile')
        .mockImplementation(() => PROFILE);
      ProfileStore.profile = null;
    });

    it('has a getProfile method for retrieving user profiles', () => {
      expect(ProfileStore.getProfile).toBeInstanceOf(Function);
    });

    it('has a getProfile method for fetching user profile', () => {
      expect(ProfileStore.fetchProfile).toBeInstanceOf(Function);
    });

    it('makes a call to getSelfProfile when fetching profiles', done => {
      let promise = ProfileStore.fetchProfile();
      expect(spy).toHaveBeenCalled();
      promise.then(() => {
        expect(ProfileStore.getProfile()).toEqual(PROFILE);
        done();
      });
    });

    it('sets dummy profile if error occurs', done => {
      spy = jest.spyOn(profileApi, 'getSelfProfile').mockImplementation(() => {
        throw new Error('oh noes');
      });
      let promise = ProfileStore.fetchProfile();
      expect(spy).toHaveBeenCalled();
      promise.then(() => {
        expect(ProfileStore.getProfile()).not.toEqual(PROFILE);
        expect(ProfileStore.getProfile()).toEqual({
          name: 'Unknown User',
          email: 'unknown@bigpiventures.com',
          organizations: [],
          currentOrganization: null
        });
        done();
      });
    });

    it('accepts a profile via populate method', () => {
      expect(ProfileStore.populate).toBeInstanceOf(Function);
      const PROFILE = {};
      ProfileStore.populate(PROFILE);
      expect(ProfileStore.getProfile()).toEqual(PROFILE);
    });

    afterEach(() => {
      spy.mockRestore();
    });
  });
});

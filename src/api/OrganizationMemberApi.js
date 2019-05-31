import fetch, { safeJSONParse } from 'utils/FetchUtils';

export default class OrganizationMemberApi {
  /**
   * Search and return members(users) that have names that match the given
   * search string
   * @param  {String} organizationId  The id of the organization to search in
   * @param  {String} searchString The string to match names against
   * @return {Array}               Array of user ids and user names
   */
  static async searchMembers (organizationId, searchString) {
    let response = await fetch(
      `/api/v1/organizations/${organizationId}/members?search=${searchString}`,
      {
        credentials: 'same-origin'
      }
    );
    // Read stream
    const body = await response.text();
    if (response.status === 200) {
      return safeJSONParse(body, {
        members: []
      }).members;
    }
    // Other status codes will be reported by browser/autohandled.
    return [];
  }
}

/**
 * Generate a templated endpoint that consists of URL root,
 * a react router template and a function to provide parametrized routes
 * @param  {String} root    The root URI
 * @param  {String} idParam The parameter to use in React Router Routes
 * @return {Object}         Object with root, template and function to generate parametrized route
 */
function generateTemplatedEndpoint (root, idParam) {
  return {
    root: `/${root}`,
    template: `/${root}/:${idParam}`,
    fn: id => `/${root}/${id}`
  };
}

export const AppEndpoints = {
  inbox: '/inbox',
  dashboard: '/',
  proposalResearchPage: generateTemplatedEndpoint(
    'proposal-research-page',
    'containerId'
  ),
  contentSourceResearchPage: generateTemplatedEndpoint(
    'content-source-research-page',
    'containerId'
  ),
  extractedContentSourcesPage: generateTemplatedEndpoint(
    'extracted-content-sources',
    'docId'
  ),
  extractedProposalsPage: generateTemplatedEndpoint(
    'extracted-proposal-pages',
    'docId'
  ),
  contentSourceContainersPage: generateTemplatedEndpoint(
    'content-source-containers',
    'containerId'
  ),
  proposalContainersPage: generateTemplatedEndpoint(
    'proposal-containers',
    'containerId'
  ),
  proposalsSearchPage: '/proposals-search',
  proposalQuestionsSearchPage: '/proposal-questions-search',
  contentSourcesSearchPage: '/content-sources-search',
  contentSourceQuestionsSearchPage: '/content-source-questions-search'
};

// TODO: Tharun These will injected via window.__serverEndpoints by backend server.
export const ServerEndpoints = {
  login: '/auth/login',
  logout: '/auth/logout',
  switchOrgContext: '/auth/org-contexts'
};

export const CellTypes = {
  COMMAND: 'COMMAND',
  DOC: 'DOC',
  CODE: 'CODE'
};

export const LanguageDefinitions = {
  JAVASCRIPT: {
    name: 'javascript',
    extension: 'js',
    value: 'JAVASCRIPT'
  },
  SHELL: {
    name: 'script',
    extension: 'sh',
    value: 'SHELL'
  },
  HTML: {
    name: 'html',
    extension: 'html',
    value: 'HTML'
  },
  MARKDOWN: {
    name: 'markdown',
    extension: 'md',
    value: 'MARKDOWN'
  },
  PYTHON: {
    name: 'python',
    extension: 'py',
    value: 'PYTHON'
  },
  REDIS: {
    name: 'redis',
    extension: 'redis',
    value: 'REDIS'
  }
};

export const CellContentTypes = {
  [CellTypes.COMMAND]: {
    JAVASCRIPT: LanguageDefinitions.JAVASCRIPT,
    SHELL: LanguageDefinitions.SHELL
  },
  [CellTypes.DOC]: {
    HTML: LanguageDefinitions.HTML,
    MARKDOWN: LanguageDefinitions.MARKDOWN
  },
  [CellTypes.CODE]: {
    JAVASCRIPT: LanguageDefinitions.JAVASCRIPT,
    PYTHON: LanguageDefinitions.PYTHON
  }
};

export const KernelTypes = {
  BROWSER: 'BROWSER'
};

export const KernelDefinitions = {
  BROWSER: {
    name: 'bwsr',
    supportedLanguages: [LanguageDefinitions.JAVASCRIPT.value],
    value: 'browser'
  }
};

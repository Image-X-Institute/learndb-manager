const CBCT_BRANCH_PATTERN = /\/CBCT\/(CBCT\d+)(?:\/|$)/i;

export const getMultipleCbctFieldNames = (trialStructure) => {
  const fraction = trialStructure?.fraction || {};
  return Object.entries(fraction)
    .filter(([, config]) => config?.multiple && config?.branch_variable === 'cbct_branch')
    .map(([name]) => name);
};

export const extractCbctBranch = (path) => {
  if (!path || typeof path !== 'string') {
    return null;
  }
  const match = path.match(CBCT_BRANCH_PATTERN);
  if (match) {
    return match[1];
  }
  const fallback = path.match(/(CBCT\d+)/i);
  return fallback ? fallback[1] : null;
};

export const parseMultipleFieldValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return {};
  }
  if (typeof value === 'object' && !Array.isArray(value)) {
    return { ...value };
  }
  if (typeof value !== 'string') {
    return {};
  }

  const result = {};
  value.split(';').map((item) => item.trim()).filter(Boolean).forEach((path) => {
    const branch = extractCbctBranch(path);
    if (branch) {
      result[branch] = path;
    }
  });
  return result;
};

export const buildCbctBranchGroups = (fractionItem, multipleFieldNames) => {
  const branches = new Set();
  const fieldMaps = {};

  multipleFieldNames.forEach((fieldName) => {
    fieldMaps[fieldName] = parseMultipleFieldValue(fractionItem[fieldName]);
    Object.keys(fieldMaps[fieldName]).forEach((branch) => branches.add(branch));
  });

  return Array.from(branches)
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((branch) => ({
      branch,
      fields: Object.fromEntries(
        multipleFieldNames.map((fieldName) => [fieldName, fieldMaps[fieldName][branch] ?? '']),
      ),
    }));
};

export const buildCbctBranchesInitialValues = (fractionItem, multipleFieldNames) => {
  const cbctBranches = {};
  buildCbctBranchGroups(fractionItem, multipleFieldNames).forEach(({ branch, fields }) => {
    cbctBranches[branch] = fields;
  });
  return cbctBranches;
};

const mapsAreEqual = (left, right) => JSON.stringify(left) === JSON.stringify(right);

export const collectCbctFieldChanges = (cbctBranches, originalItem, multipleFieldNames) => {
  const changes = {};

  multipleFieldNames.forEach((fieldName) => {
    const originalMap = parseMultipleFieldValue(originalItem[fieldName]);
    const nextMap = {};

    Object.entries(cbctBranches || {}).forEach(([branch, branchFields]) => {
      const value = branchFields?.[fieldName];
      if (value !== undefined && value !== null && value !== '') {
        nextMap[branch] = value;
      }
    });

    if (!mapsAreEqual(originalMap, nextMap)) {
      changes[fieldName] = nextMap;
    }
  });

  return changes;
};

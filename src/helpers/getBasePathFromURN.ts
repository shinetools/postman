const getBasePathFromURN = (urn: string): string => {
  if (!urn.includes('.')) {
    return '';
  }

  const [part] = urn.split('.');
  const parts = part?.split('-') || [];

  const version = parts.pop();

  return `/${version}/${parts.join('_')}`;
};

export default getBasePathFromURN;

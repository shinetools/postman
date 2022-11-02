const getExcludedOperationIds = (operationIds: string): string[] => {
  return operationIds
    .split('|')
    .filter((operation) => operation)
    .map((operation) => operation.trim());
};

export default getExcludedOperationIds;

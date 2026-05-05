let counter = 215;

export const generateIssueId = (): string => {
  const id = `ISS-${String(counter).padStart(3, '0')}`;
  counter++;
  return id;
};

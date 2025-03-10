export const asyncWrapper = (asyncFN) => {
  return (req, res, next) => {
    asyncFN(req, res, next).catch(next);
  };
};

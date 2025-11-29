export const getDebug = (req, res) => {
  const authHeader = req.headers.authorization || null;
  res.json({
    message: 'debug info',
    authHeader,
    user: req.user || null
  });
};

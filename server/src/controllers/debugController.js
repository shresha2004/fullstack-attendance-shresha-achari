export const getDebug = (req, res) => {
  // Return helpful debug info about the authenticated request
  const authHeader = req.headers.authorization || null;
  res.json({
    message: 'debug info',
    authHeader,
    user: req.user || null,
  });
};

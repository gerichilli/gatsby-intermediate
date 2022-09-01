export default function handler(req, res) {
  const loggedIn = Boolean(req.cookies && req.cookies['frontend-master-auth']);
  res.json({ loggedIn });
}

export default function handler(req, res) {
  res.setHeader('Set-Cookie', 'frontend-master-auth=true; path=/;');
  res.json({ status: 'ok' });
}

export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' });
        return;
    }
    const body = JSON.parse(req.body);
    res.status(200).send({ access_token: '', user: {} });
}

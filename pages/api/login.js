export default function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(400).send({ message: 'Only POST requests allowed' });
        return;
    }
    // const body = JSON.parse(req.body);
    res.status(401).send({ error: 'Incorrect username or password' });
}

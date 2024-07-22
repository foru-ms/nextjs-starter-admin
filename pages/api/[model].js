// pages/api/[model].js
const API_URL = process.env.FORU_MS_API_URL;
const API_KEY = process.env.FORU_MS_API_KEY;

export default async function handler(req, res) {
  const { model } = req.query;
  const { method } = req;

  switch (method) {
    case 'GET':
      const response = await fetch(`${API_URL}/${model}s?page=${req.query.page || 1}`, {
        method: 'GET',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      const data = await response.json();
      res.status(200).json(data);
      break;
    case 'POST':
      const createResponse = await fetch(`${API_URL}/${model}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(req.body),
      });
      const createData = await createResponse.json();
      res.status(201).json(createData);
      break;
    case 'PUT':
      const updateResponse = await fetch(`${`${API_URL}/${model}`}/${req.body.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body: JSON.stringify(req.body),
      });
      const updateData = await updateResponse.json();
      res.status(200).json(updateData);
      break;
    case 'DELETE':
      const deleteResponse = await fetch(`${`${API_URL}/${model}`}/${req.body.id}`, {
        method: 'DELETE',
        headers: {
          'x-api-key': API_KEY,
        },
      });
      const deleteData = await deleteResponse.json();
      res.status(204).json(deleteData);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

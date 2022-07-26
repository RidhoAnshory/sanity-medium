import SanityClientConstructor, { ClientConfig } from '@sanity/client';
import { NextApiRequest, NextApiResponse } from 'next';

const config: ClientConfig = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_TOKEN,
};

const client = SanityClientConstructor(config);

export default async function createComment(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { _id, name, email, comment } = JSON.parse(req.body);

    try {
      await client.create({
        _type: 'comment',
        post: {
          _type: 'reference',
          _ref: _id,
        },
        name,
        email,
        comment,
      });
    } catch (err) {
      return res.status(500).json({ message: `Couldn't submit comment`, err });
    }

    console.log('Comment submitted');
    return res.status(200).json({ message: 'Comment submitted' });
  }
}

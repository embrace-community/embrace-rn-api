import { Blob } from 'node:buffer';
import Bundlr from '@bundlr-network/client';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const POLYGON_PK_KEY = process.env.POLYGON_PK_KEY;

if (!POLYGON_PK_KEY) {
  throw new Error('Missing PK');
}

export const bundlrUpload = async (req: Request, res: Response) => {
  const bundlr = new Bundlr(
    'http://node2.bundlr.network',
    'matic',
    POLYGON_PK_KEY,
  );

  await bundlr.ready();

  const { file } = req;

  const { name, handle } = req.body;

  if (!name || !handle) {
    res.status(400).json({ message: 'Missing name or handle' });
    return;
  }

  try {
    let avatarId;
    if (file) {
      // We prefer this approach to the client.store() method as we just want the CID not the name of the file appended to the CID
      const imageBlob = Buffer.from(file.buffer);
      avatarId = await bundlr.upload(imageBlob, {
        tags: [{ name: 'Content-Type', value: 'image/jpg' }],
      });
    }

    const image = avatarId ? `ar://${avatarId}` : null;

    if (!avatarId) {
      console.log('No image provided');
    } else {
      console.log(`Image uploaded to AR with Id: ${avatarId}`);
    }

    const metadataString = JSON.stringify({
      name,
      description: `Embrace Community profile NFT for ${handle}`,
      image,
      properties: {
        handle,
      },
    });

    // We prefer this approach to the client.store() method as we just want the CID not the name of the file appended to the CID
    const metadataId = await bundlr.upload(metadataString, {
      tags: [{ name: 'Content-Type', value: 'application/json' }],
    });

    console.log(`Metadata uploaded to AR with CID ${metadataId}`);

    console.log('Returning metadata CID and avatar CID', metadataId, avatarId);
    res.status(200).json({ metadataCid: metadataId, avatarCid: avatarId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something went wrong' });
    return;
  }
};

import { Blob } from 'node:buffer';
import { NFTStorage } from 'nft.storage';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;

if (!NFT_STORAGE_API_KEY) {
  throw new Error('Missing storage API key');
}

const nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });

export const nftStorageUpload = async (req: Request, res: Response) => {
  console.log('Upload request received');

  const { file } = req;
  const { name, handle } = req.body;

  if (!name || !handle) {
    res.status(400).json({ message: 'Missing name or handle' });
    return;
  }

  try {
    let avatarCid;
    if (file) {
      // We prefer this approach to the client.store() method as we just want the CID not the name of the file appended to the CID
      const imageBlob = new Blob([file.buffer]);
      avatarCid = await nftStorage.storeBlob(imageBlob);
    }

    const imageUri = avatarCid ? `ipfs://${avatarCid}` : null;

    if (!avatarCid) {
      console.log('No image provided');
    } else {
      console.log(`Image uploaded to IPFS with CID: ${avatarCid}`);
    }

    const metadataBlob = new Blob(
      [
        JSON.stringify({
          name,
          description: `Embrace Community profile NFT for ${handle}`,
          image: imageUri,
          properties: {
            handle,
          },
        }),
      ],
      { type: 'application/json' },
    );

    // We prefer this approach to the client.store() method as we just want the CID not the name of the file appended to the CID
    const metadataCid = await nftStorage.storeBlob(metadataBlob);

    console.log(`Metadata uploaded to IPFS with CID ${metadataCid}`);

    console.log(
      'Returning metadata CID and avatar CID',
      metadataCid,
      avatarCid,
    );
    res
      .status(200)
      .json({ metadata: `ipfs://${metadataCid}`, avatar: imageUri });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Something went wrong' });
    return;
  }
};

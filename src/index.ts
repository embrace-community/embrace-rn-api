import express from 'express';
import multer from 'multer';
const upload = multer({
  storage: multer.memoryStorage(),
});
import { Blob } from 'node:buffer';
import { NFTStorage } from 'nft.storage';
import dotenv from 'dotenv';

dotenv.config();

const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY;

if (!NFT_STORAGE_API_KEY) {
  throw new Error('Missing storage API key');
}

const nftStorage = new NFTStorage({ token: NFT_STORAGE_API_KEY });

const app = express();

app.use(express.json());

app.get(`/`, async (req, res) => {
  res.json({ message: 'Hello world' });
});

app.post(`/profile`, upload.single('image'), async (req, res) => {
  console.log('Upload request received');

  const { file } = req;
  const { name, handle } = req.body;

  if (!name || !handle) {
    res.status(400).json({ message: 'Missing name or handle' });
    return;
  }

  let avatarCid;
  if (file) {
    // We prefer this approach to the client.store() method as we just want the CID not the name of the file appended to the CID
    const imageBlob = new Blob([file.buffer]);
    avatarCid = await nftStorage.storeBlob(imageBlob);
  }

  const image = avatarCid ?? `ipfs://${avatarCid}`;

  if (!avatarCid) {
    console.log('No image provided');
  } else {
    console.log(`Image uploaded to IPFS with CID ${avatarCid}`);
  }

  const metadataBlob = new Blob(
    [
      JSON.stringify({
        name,
        description: `Embrace Community profile NFT for ${handle}`,
        image,
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

  console.log('Returning metadata CID and avatar CID', metadataCid, avatarCid);

  res.status(200).json({ metadataCid, avatarCid });
});

const server = app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`),
);

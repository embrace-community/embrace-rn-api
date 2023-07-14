import express from 'express';
import multer from 'multer';
import { nftStorageUpload } from './ipfs';
import { bundlrUpload } from './ar';
const ipfsUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // keep images size < 10 MB
  },
});

const arUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // keep images size < 100 KB
    fileSize: 100 * 1024,
  },
});

const app = express();

app.use(express.json());

app.get(`/`, async (req, res) => {
  res.json({ message: 'Hello world' });
});

app.post(`/nft-ipfs`, ipfsUpload.single('asset'), nftStorageUpload);
app.post(`/nft-ar`, arUpload.single('asset'), bundlrUpload);

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`),
);

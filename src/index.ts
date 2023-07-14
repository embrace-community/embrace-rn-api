import express from 'express';
import multer from 'multer';
import { nftStorageUpload } from './ipfs';
import { bundlrUpload } from './ar';
const upload = multer({
  storage: multer.memoryStorage(),
});

const app = express();

app.use(express.json());

app.get(`/`, async (req, res) => {
  res.json({ message: 'Hello world' });
});

app.post(`/nft-ipfs`, upload.single('asset'), nftStorageUpload);
app.post(`/nft-ar`, upload.single('asset'), bundlrUpload);

app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`),
);

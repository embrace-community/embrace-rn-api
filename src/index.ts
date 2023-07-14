import express from 'express';
import { nftStorageUpload } from './ipfs';
import { bundlrUpload } from './ar';
import { arUpload, ipfsUpload } from './multer';

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

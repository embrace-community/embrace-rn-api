import multer from 'multer';

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

export { ipfsUpload, arUpload };

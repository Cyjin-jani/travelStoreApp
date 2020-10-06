const express = require('express');
const router = express.Router();
const multer = require('multer');

const { Product } = require('../models/Product');

//=================================
//             Product
//=================================
//Storage MULTER CONFIG
let storage = multer.diskStorage({
  //파일을 올리면 어디에 그 파일을 저장할지를 정함.
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  //어떠한 파일이름으로 저장을 할 지. (여기서는 날짜 + 원본파일이름)
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  // //파일 확장자 검색. (비디오 mp4확장자만 업로드 가능)
  // fileFilter: (req, file, cb) => {
  //   const ext = path.extname(file.originalname);
  //   if (ext !== '.mp4') {
  //     return cb(res.status(400).end('Only JPG, PNG, MP4 is allowed'), false);
  //   }
  //   cb(null, true);
  // },
});

const upload = multer({ storage: storage }).single('file');

router.post('/image', (req, res) => {
  //가져온 이미지를 저장한다.
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }

    return res.status(200).json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post('/', (req, res) => {
  //받아온 정보들을 DB에 넣어준다.

  const product = new Product(req.body);

  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

module.exports = router;
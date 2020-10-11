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

//전체상품가져오기
router.post('/products', (req, res) => {
  //product collection에 들어있는 모든 상품 정보를 가져오기.

  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0], //greater than equal 크거나 같다.
          $lte: req.body.filters[key][1], //less than equal 작거나 같다.
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }
  // console.log('findArgs', findArgs);

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });

        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  } else {
    Product.find(findArgs)
      .populate('writer')
      .skip(skip)
      .limit(limit)
      .exec((err, productInfo) => {
        if (err) return res.status(400).json({ success: false, err });

        return res
          .status(200)
          .json({ success: true, productInfo, postSize: productInfo.length });
      });
  }
});

//상세페이지에서 상품 정보 가져오기.
router.get('/products_by_id', (req, res) => {

  let type = req.query.type;
  let productIds = req.query.id;


  if(type === 'array') {
    let ids = req.query.id.split(',')
    productIds = ids.map(item => {
      return item
    })
  }
  
  //productIds를 이용해서 DB에서 productIds와 같은 상품의 정보를 가져온다.
  Product.find({_id: {$in: productIds } })
  .populate('writer')
  .exec((err, product) => {
    if(err) return res.status(400).send(err)
    return res.status(200).send(product)
  })


});


module.exports = router;

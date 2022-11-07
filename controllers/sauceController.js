import Sauce from '../models/sauce.js';

export const getAll = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

export const getOne = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error,
      });
    });
};

export const create = (req, res, next) => {
  const sauceRequest = JSON.parse(req.body.sauce);
  const sauce = new Sauce({
    userId: sauceRequest.userId,
    name: sauceRequest.name,
    manufacturer: sauceRequest.manufacturer,
    description: sauceRequest.description,
    mainPepper: sauceRequest.mainPepper,
    heat: sauceRequest.heat,
    imageUrl: '',
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: 'Sauce saved successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

export const modify = (req, res, next) => {
  const sauce = new Sauce({
    _id: req.params.id,
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    price: req.body.price,
    userId: req.body.userId,
  });
  Sauce.updateOne({ _id: req.params.id }, sauce)
    .then(() => {
      res.status(201).json({
        message: 'Sauce updated successfully!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

export const deleteOne = (req, res, next) => {
  Sauce.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).json({
        message: 'Sauce deleted!',
      });
    })
    .catch((error) => {
      res.status(400).json({
        error,
      });
    });
};

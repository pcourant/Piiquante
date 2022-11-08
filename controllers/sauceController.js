import fs from 'fs';
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

export const createOne = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;

  const sauce = new Sauce({
    ...sauceObject,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
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

export const modifyOne = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res.status(200).json({ message: 'Sauce modified succesfully!' })
          )
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

export const likeOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      let indexLiked = sauce.usersLiked.findIndex(
        (user) => user === req.auth.userId
      );
      let indexDisliked = sauce.usersDisliked.findIndex(
        (user) => user === req.auth.userId
      );
      switch (req.body.like) {
        // case 1 = LIKE and CANCEL DISLIKE
        case 1:
          if (indexLiked > -1)
            res.status(400).json({ message: 'Sauce already liked' });
          else {
            if (indexDisliked > -1) {
              sauce.usersDisliked.splice(indexDisliked, 1);
              sauce.dislikes--;
            }
            sauce.usersLiked.push(req.auth.userId);
            sauce.likes++;
          }
          break;
        // case 0 = CANCEL LIKE and CANCEL DISLIKE
        case 0:
          if (indexLiked > -1) {
            sauce.usersLiked.splice(indexLiked, 1);
            sauce.likes--;
          }
          if (indexDisliked > -1) {
            sauce.usersDisliked.splice(indexDisliked, 1);
            sauce.dislikes--;
          }
          break;
        // case -1 = DISLIKE and CANCEL LIKE
        case -1:
          if (indexDisliked > -1)
            res.status(400).json({ message: 'Sauce already disliked' });
          else {
            if (indexLiked > -1) {
              sauce.usersLiked.splice(indexLiked, 1);
              sauce.likes--;
            }
            sauce.usersDisliked.push(req.auth.userId);
            sauce.dislikes++;
          }
          break;
        default:
          res.status(400).json({ message: 'Invalid fields' });
      }

      Sauce.updateOne({ _id: req.params.id }, sauce)
        .then(() =>
          res
            .status(200)
            .json({ message: 'Likes/dislikes updated succesfully!' })
        )
        .catch((error) => res.status(401).json({ error }));
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

export const deleteOne = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: 'Sauce deleted !' });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

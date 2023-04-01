import mongoose from "mongoose";
import Restaurant from "./restaurant.js";


/**
 * Schema of how posts are stored
 * @property {string} userID - user id of the owner of the post
 * @property {username} username - username of the owner of the post
 * @property {mongoose.Schema.Types.ObjectId} restaurantID - the restaurant mentioned in the post
 * @property {string} restaurantName - restaurant name mentioned in the post
 * @property {string} title - title of the post
 * @property {string} description - content of post published by the post owner
 * @property {string} picturePath - address of image uploaded by post owner as part of the post
 * @property {string} userPicturePath - address of profile picture of post owner
 * @property {number} ratings - rating of the restaurant given by post owner
 */
const postSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    username: {
      type: String,
      required: true,
    },

    restaurantID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Restaurant',
      required: true,
    },

    restaurantName: {
      type: String,
      required: true,

    },

    title: {
      type: String,
      required: true,

    },

    // content
    description: String,
    ratings: Number,

    picturePath: String,
    userPicturePath: String,



    likes: {
      type: Map,
      of: Boolean,
    },
    comments: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;

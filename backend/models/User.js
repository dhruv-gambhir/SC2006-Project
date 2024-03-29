import mongoose from "mongoose";

/**
 * Schema that how users are stored 
 * @property {string} username - username unique to the account user that is between 2-50 characters
 * @property {string} password - password of the account user of minimum 5 characters
 * @property {string} picturePath - address of profile picture of account user
 * @property {array} friends - other account users that account user has followed and followed by
 * @property {number} viewedProfile - number of profiles account user has viewed
 * @property {number} impressions - number of times others has viewed this account user's profile 
 */ 
const UserSchema = new mongoose.Schema(
  {

    username:{
      type: String,
      required: true,
      min: 2,
      max: 50,
      unique: true, // prevent duplicate username
      // will receive error message,such as:
      //errmsg: 'E11000 duplicate key error collection: test.users index: username_1 dup key: { username: "aaa" }',
    },
    
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    friends: {
      type: Array,
      default: [],
    },
    //location: String,
    //occupation: String,
    viewedProfile: Number,
    impressions: Number,
  },
  //dates of created
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;

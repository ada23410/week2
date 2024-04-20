const mongoose = require('mongoose');
// schema 開始 
const postSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, '貼文姓名未填寫']
      },
      tags: [
        {
          type: String,
          required: [true, '貼文標籤 tags 為填寫']
        }
      ],
      type: {
        type: String,
        enum: ['group', 'person'],
        required: [true, '貼文類型 type 未填寫']
      },
      content: {
        type: String,
        required: [true, 'Content 未填寫']
      },
      image: {
        type:String,
        default:"" 
      },
      createdAt: {
        type: Date,
        default: Date.now,
        select: false
      },
      likes: {
          type:Number,
          default:0
        },
      comments: {
        type: Number,
        default: 0
      }
    },
    {
        versionKey: false // 去除資料庫欄位的__v
    } 
);
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
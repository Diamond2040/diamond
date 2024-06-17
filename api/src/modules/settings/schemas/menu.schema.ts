import { Schema } from 'mongoose';

export const MenuSchema = new Schema({
  title: { type: String, default: '' },
  path: { type: String, default: '' },
  internal: { type: Boolean, default: false },
  parentId: { type: Schema.Types.ObjectId },
  help: { type: String, default: '' },
  section: { type: String, default: '' },
  public: { type: Boolean, default: false },
  isPage: { type: Boolean, default: false },
  type: {
    type: String,
    default: 'link'
  },
  icon: {
    type: String
  },
  hideLoggedIn: {
    type: Boolean,
    default: false
  },
  ordering: { type: Number, default: 0 },
  isNewTab: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

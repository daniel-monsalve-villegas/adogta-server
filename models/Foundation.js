const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const FoundationSchema = mongoose.Schema(
  {
    email: {
      type: String,
      match: /.+@.+\..+/,
      required: [true, 'Email is required'],
      validate: {
        validator: async (value) => {
          const foundation = await mongoose
            .model('Foundation')
            .findOne({ email: value });
          const user = await mongoose.model('User').findOne({ email: value });
          if (foundation || user) {
            return null;
          }
          return foundation;
        },
        message: 'Email is already taken',
      },
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    address: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    role: {
      type: String,
      required: [true, ' Role is required'],
    },
    active: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: String,
    photoUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

FoundationSchema.pre('save', async (next) => {
  const foundation = this;
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(foundation.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

FoundationSchema.statics.authenticate = async (email, password) => {
  const foundation = await mongoose.model('Foundation').findOne({ email });
  if (foundation) {
    const result = await bcrypt.compare(password, foundation.password);
    return result === true ? foundation : null;
  }

  return null;
};

const Foundation = mongoose.model('Foundation', FoundationSchema);

module.exports = Foundation;

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema(
  {
    email: {
      type: String,
      match: /.+@.+\..+/,
      required: [true, 'Email is required'],
      validate: {
        validator: async (value) => {
          const user = await mongoose.model('User').findOne({ email: value });
          const foundation = await mongoose.model('Foundation').findOne({ email: value });
          if (user || foundation) {
            return null;
          }
          return user;
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
      required: [true, 'Role is required'],
    },
    active: {
      type: Boolean,
      default: false,
    },
    passwordResetToken: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    epaycoCustomerId: {
      type: String,
    },
    token_card: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.path('email').validate(async (email) => {
  const verifyEmail = await mongoose.model('User').countDocuments({ email });
  return !verifyEmail;
}, 'Email already exists');

UserSchema.pre('save', async (next) => {
  try {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

UserSchema.statics.authenticate = async (email, password) => {
  let user = await mongoose.model('User').findOne({ email });

  if (!user) {
    user = await mongoose.model('Foundation').findOne({ email });
  }

  if (user && user.active === true) {
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      return user;
    }
    throw new Error('Invalid password');
  } else if (user && user.active === false) {
    throw new Error('Please verify your email');
  } else {
    throw new Error('User does not exist');
  }
};

const User = mongoose.model('User', UserSchema);

module.exports = User;

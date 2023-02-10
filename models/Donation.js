const mongoose = require('mongoose');

const DonationSchema = mongoose.Schema(
  {
    transactionId: {
      type: mongoose.Schema.Types.ObjectId,
      // pasarela de pagos
      ref: '',
      required: true,
    },

    foundationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Foundation',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Donation = mongoose.model('Donation', DonationSchema);

module.exports = Donation;

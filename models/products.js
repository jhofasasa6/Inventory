const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = Schema({
  enable: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    require: true
  },
  price: {
    type: String,
    require: true
  },
  presentation: {
    _id: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    quantity: {
      type: Number,
      require: true
    }
  },
  category: {
    _id: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    description: {
      type: String
    }
  },
  sku: {
    type: String
  },
  ActualAmount: {
    type: Number,
    require: true
  },
  Inputs: [
    {
      _id: {
        type: String,
        require: true
      },
      CreationDate: {
        type: Date,
        require: true
      },
      DescriptionInput: {
        type: String,
        require: true
      },
      Input: {
        type: Number,
        require: true
      },
      ActualAmount: {
        type: Number,
        require: true
      }
    }
  ],
  Outputs: [
    {
      _id: {
        type: String,
        require: true
      },
      CreationDate: {
        type: Date,
        require: true
      },
      DescriptionOutput: {
        type: String,
        require: true
      },
      Output: {
        type: Number,
        require: true
      },
      ActualAmount: {
        type: Number,
        require: true
      }
    }
  ]
});

module.exports = Product = mongoose.model("Product", ProductSchema);

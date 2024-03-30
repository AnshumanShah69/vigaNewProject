const express = require("express");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");

const app = express();

app.use(bodyParser.json());

const sequelize = new Sequelize("vigafoodsdb", "postgres", "aman2000", {
  host: "localhost",
  dialect: "postgres",
});

const Organization = sequelize.define("Organization", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Pricing = sequelize.define("Pricing", {
  baseDistanceInKm: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  kmPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  fixPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

const Item = sequelize.define("Item", {
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

Organization.hasMany(Pricing, { foreignKey: "organizationId" });
Pricing.belongsTo(Organization, { foreignKey: "organizationId" });

Item.hasMany(Pricing, { foreignKey: "itemId" });
Pricing.belongsTo(Item, { foreignKey: "itemId" });


app.post("/calculate-price", async (req, res) => {
  const { organizationId, zone, itemType, totalDistance } = req.body;

  try {
    const pricingDetails = await Pricing.findOne({
      where: {
        organizationId: organizationId,
        zone: zone,
        "$Item.type$": itemType,
      },
      include: [
        {
          model: Organization,
          attributes: [],
          required: true,
        },
        {
          model: Item,
          attributes: [],
          required: true,
        },
      ],
    });

    if (!pricingDetails) {
      return res.status(404).json({ error: "Pricing details not found" });
    }

    let totalPrice = pricingDetails.fixPrice;
    if (totalDistance > pricingDetails.baseDistanceInKm) {
      const additionalDistance =
        totalDistance - pricingDetails.baseDistanceInKm;
      totalPrice += additionalDistance * pricingDetails.kmPrice;
    }

    res.json({ total_price: totalPrice });
  } catch (error) {
    console.error("Error calculating price:", error);
    res.status(500).json({ error: "An unexpected error occurred" });
  }
});

const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

const { Product } = require("../models/productModel");

class CategoryFilter {
  constructor(category) {
    this.category = category;
  }

  async applyFilter() {
    const products = await Product.find({ category: this.category })
      .populate("productDescription")
      .populate("location")
      .select([
        "title",
        "category",
        "age",
        "used",
        "imageUrl",
        "condition",
        "city",
        "state",
        "description",
      ])
      .exec();
    return products;
  }
}

class LocationFilter {
  constructor(location) {
    this.location = location;
  }

  async applyFilter() {
    let aggregate = Product.aggregate({
      $lookup: {
        from: "Location",
        localField: "_id",
        foreignField: "_id",
        as: "filteredLocation",
      },
    });

    if (this.location.city) {
      aggregate.append({
        $match: { "filteredLocation.city": this.location.city },
      });
    }
    if (this.location.state) {
      aggregate.append({
        $match: { "filteredLocation.state": this.location.state },
      });
    }
    if (this.location.latitude) {
      aggregate.append({
        $match: { "filteredLocation.latitude": this.location.latitude },
      });
      aggregate.append({
        $match: { "filteredLocation.longitude": this.location.longitude },
      });
    }
    const products = await aggregate.exec();
    return products;
  }
}

class ProductFilter {
  async applyFilters(filters) {
    try {
      let aggregationPipeline = [];
      if (filters.category) {
        aggregationPipeline.push({ $match: { category: filters.category } });
      }

      if (filters.location) {
        aggregationPipeline.push({
          $lookup: {
            from: "locations",
            localField: "location",
            foreignField: "_id",
            as: "filteredLocation",
          },
        });
        if (filters.location.city) {
          aggregationPipeline.push({
            $match: { "filteredLocation.city": filters.location.city },
          });
        }
        if (filters.location.state) {
          aggregationPipeline.push({
            $match: { "filteredLocation.state": filters.location.state },
          });
        }
        if (filters.location.latitude) {
          aggregationPipeline.push({
            $match: { "filteredLocation.latitude": filters.location.latitude },
          });
          aggregationPipeline.push({
            $match: {
              "filteredLocation.longitude": filters.location.longitude,
            },
          });
        }
      }
      const products = await Product.aggregate(aggregationPipeline).exec();
      return products;
    } catch (error) {
      throw new Error(`Error applying filters: ${error.message}`);
    }
  }
}

module.exports = {
  CategoryFilter,
  LocationFilter,
  ProductFilter,
};

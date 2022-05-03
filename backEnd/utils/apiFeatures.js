class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["limit", "sort", "page", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    Object.keys(queryObj).forEach((el) => {
      if (el.trim() === "name") {
        queryObj[el] = {
          $regex: queryObj[el],
          $options: "i",
        };
      }
    });

    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  countDocuments(Model, query) {
    const queryObj = { ...query };
    const excludedFields = ["limit", "sort", "page", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    Object.keys(queryObj).forEach((el) => {
      if (el.trim() === "name") {
        queryObj[el] = {
          $regex: queryObj[el],
          $options: "i",
        };
      }
    });

    //Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    return Model.countDocuments(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;

// userModel.find({jopTitle:new RegExp(filter,'i')})

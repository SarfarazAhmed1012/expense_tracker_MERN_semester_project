// imported th model file, in which we have saved our two models. category and transactions.
const model = require("../models/model");

//  post: http://localhost:8080/api/categories
async function create_Categories(req, res) {
  const Create = new model.Categories({
    type: "Investment",
    color: "#FCBE44",
  });

  // save the above create variable.
  await Create.save(function (err) {
    // if we dont have an error, return the response with create variable.
    if (!err) return res.json(Create);
    return res
      .status(400) // if we have error
      .json({ message: `Error while creating categories ${err}` });
  });
}

//  get: http://localhost:8080/api/categories
async function get_Categories(req, res) {
  // using find function as we want all the documents from the documents.
  // in find we have an {} in which we have object, returning all the object.
  let data = await model.Categories.find({});

  // data.map to iterate to the all values in the array
  // v => value, and then we have an object{}, in which we need only two fields. type and color.
  let filter = await data.map((v) =>
    Object.assign({}, { type: v.type, color: v.color })
  );
  // returning the filtered data
  return res.json(filter);
}

//  post: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
  // if we have nothing inside the body.
  if (!req.body) return res.status(400).json("Post HTTP Data not Provided");
  // to get the data from the user, we are using req.body object.
  // as when you make the request, you pass the body so we can the data with the reqeust.
  let { name, type, amount } = req.body;

  const create = await new model.Transaction({
    name, // also could be written name : name and same for others. here the second name is coming from above destructure.
    type,
    amount,
    date: new Date(),
  });

  // using save function to save the data
  create.save(function (err) {
    if (!err) return res.json(create);
    return res
      .status(400)
      .json({ message: `Erro while creating transaction ${err}` });
  });
}

//  get: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
  let data = await model.Transaction.find({});
  return res.json(data);
}

//  delete: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
  // if there is no body
  if (!req.body) res.status(400).json({ message: "Request body not Found" });
  // delete the requested transaction object
  await model.Transaction.deleteOne(req.body, function (err) {
    if (!err) res.json("Record Deleted...!");
  })
    // clone methid to catch the error.
    .clone()
    .catch(function (err) {
      res.json("Error while deleting Transaction Record");
    });
}

//  get: http://localhost:8080/api/labels
async function get_Labels(req, res) {
  model.Transaction.aggregate([
    // we have an array and in the array we have an object of collections we want to join.
    {
      $lookup: {
        // lookup key allows us to look for specific field from different collection.
        // as we want to join the transaction with the categories.
        // local field is from transaction
        // foreign field is from categories.
        // as => assigning the name to the output array.
        from: "categories",
        localField: "type",
        foreignField: "type",
        as: "categories_info",
      },
    },
    {
      // this will deconstruct array field from input document to output a document for each element.
      $unwind: "$categories_info",
    },
  ])
    .then((result) => {
      // returning the specific fields in response rather than returning the whole bnch of response.
      let data = result.map((v) =>
        Object.assign(
          {},
          {
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.categories_info["color"],
          }
        )
      );
      res.json(data);
    })
    .catch((error) => {
      res.status(400).json("Looup Collection Error");
    });
}

module.exports = {
  create_Categories,
  get_Categories,
  create_Transaction,
  get_Transaction,
  delete_Transaction,
  get_Labels,
};

const Joi707 = require("joi");

// Method to validate the input schema
function validateInput(job) {
  const schema = {
    jobid: Joi707.string(),
    partid: Joi707.number(),
    quantity: Joi707.number(),
  };
  return Joi707.validate(job, schema);
}

module.exports = {
  getJobs: function (req, res) {
    var myDBStore707 = sails.getDatastore(); //gets the default datastore.
    var query707 = "SELECT * FROM jobs;";

    myDBStore707.sendNativeQuery(query707).exec(function (err, result707) {
      if (err) {
        return res.send(err);
      }
      return res.send(result707.rows);
    });
  },
  getJobsById: function (req, res) {
    var myDBStore707 = sails.getDatastore();
    let where707 = "jobid = $1 and partid = $2";
    let query707 = "SELECT * FROM jobs WHERE " + where707;
    let values707 = [req.params.jobid, req.params.partid];
    console.log(query707);
    myDBStore707
      .sendNativeQuery(query707, values707)
      .exec(function (err, result707) {
        if (err) {
          return res.send(err);
        }
        return res.send(result707.rows);
      });
  },
  addJobs: function (req, res) {
    //Input Validation to check if the correct schema JSON is input from request body
    const { error } = validateInput(req.body); // getting only result.error
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    // Checking if the passed combination of jobid and part id is present in DB
    var myDBStore707 = sails.getDatastore();
    let where707 = "jobid = $1 and partid = $2";
    let query707 = "SELECT * FROM jobs WHERE " + where707;
    let values707 = [req.body.jobid, req.body.partid];
    console.log(query707);
    myDBStore707.sendNativeQuery(query707, values707, (err707, result707) => {
      if (err707) {
        throw err707;
      }
      console.log(result707);
      if (result707.rows == "") {
        console.log(
          "The entered data does not exist in database, need to be inserted"
        );
        let insertquery707 =
          "INSERT INTO jobs (jobid, partid, quantity ) values ($1,$2,$3)";
        let data707 = [req.body.jobid, req.body.partid, req.body.quantity];
        myDBStore707.sendNativeQuery(
          insertquery707,
          data707,
          (err707, result707) => {
            if (err707) {
              throw err707;
            }
            //return res.send("Data Inserted into Database successfully");
            res.redirect("/skhatri707/viewData");
            //return res.send(result707.rows);
          }
        );
      } else
        res
          .status(404)
          .send(
            "The given combination of job Id and part Id is already available, so cannot insert"
          );
    });
  },
  updateJobs: function (req, res) {
    //Input Validation to check if the correct schema JSON is input from request body
    const { error } = validateInput(req.body); // getting only result.error
    if (error) {
      res.status(400).send(error.details[0].message);
      return;
    }
    // Checking if the passed combination of jobid and part id is present in DB
    var myDBStore707 = sails.getDatastore();
    let where707 = "jobid = $1 and partid = $2";
    let query707 = "SELECT * FROM jobs WHERE " + where707;
    let values707 = [req.body.jobid, req.body.partid];
    console.log(query707);
    myDBStore707.sendNativeQuery(query707, values707, (err707, result707) => {
      if (err707) {
        throw err707;
      }
      console.log(result707);
      if (result707.rows == "") {
        console.log(
          "The given combination of job Id and part Id does not exist in Database , so cannot update quantity"
        );
        res
          .status(404)
          .send(
            "The given combination of job Id and part Id does not exist in Database , so cannot update quantity"
          );
      } else {
        let updatequery707 = "UPDATE jobs SET quantity=$1 WHERE partid =$2 ";
        let data707 = [req.body.quantity, req.body.partid];
        myDBStore707.sendNativeQuery(
          updatequery707,
          data707,
          (err707, result707) => {
            if (err707) {
              throw err707;
            }
            console.log("Data Updated into Database successfully");
            res.redirect("/skhatri707/viewData");
          }
        );
      }
    });
  },
  viewData: function (req, res) {
    var myDBStore707 = sails.getDatastore();
    let query707 = "SELECT * FROM jobs";
    console.log(query707);
    myDBStore707.sendNativeQuery(query707, (err707, result707) => {
      if (err707) {
        throw err707;
      }
      if (result707.rows != "") {
        res.view("pages/viewData", { jobs_parts_Array: result707.rows });
      } else {
        res.send("No Job Part Data is available");
      }
    });
  },
};

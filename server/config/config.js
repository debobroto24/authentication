const mongoose = require('mongoose');
mongoose.set("strictQuery", false);
 mongoose.connect("mongodb+srv://debobroto:debobroto@cluster0.hsydmt2.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser:true,
});


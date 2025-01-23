const express=require('express');
const router=express.Router();

router.use("/api",require("./api/frontend"));
router.use("/admin",require("./admin/admin"));

module.exports=router;
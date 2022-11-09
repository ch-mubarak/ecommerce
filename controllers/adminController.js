const _ = require("lodash");
const User = require("../models/users");
const Category = require("../models/category");
const Product = require("../models/product");
const Order = require("../models/order");
const Coupon = require("../models/coupon");

module.exports = {
  home: async (req, res) => {
    try {
      const errorMessage = req.flash("message");
      const userCountPromise = User.find({
        isAdmin: false,
      }).countDocuments();
      const orderStatusPendingPromise = Order.find({
        status: "Pending",
      }).countDocuments();
      const orderStatusDeliveredPromise = Order.find({
        status: "Delivered",
      }).countDocuments();
      const totalSalePromise = Order.aggregate([
        {
          $match: {
            status: { $ne: "Cancelled" },
          },
        },
        {
          $group: {
            _id: "",
            totalSale: { $sum: "$total" },
          },
        },
        {
          $project: {
            _id: 0,
            totalAmount: "$totalSale",
          },
        },
      ]);
      const userCount = await userCountPromise;
      const orderStatusPending = await orderStatusPendingPromise;
      const orderStatusDelivered = await orderStatusDeliveredPromise;
      const totalSale = await totalSalePromise;
      const orderStatusCount = [
        orderStatusPending,
        orderStatusDelivered,
        totalSale[0]?.totalAmount.toFixed(2),
      ];
      res.render("admin/index", {
        errorMessage: errorMessage,
        layout: "layouts/adminLayout",
        orderStatusCount: orderStatusCount,
        userCount: userCount,
      });
    } catch (err) {
      console.log(err.message);
      res.redirect("/admin");
    }
  },

  getGraphDetails: async (req, res) => {
    try {
      const totalRegisterPromise = User.aggregate([
        {
          $match: {
            createdAt: { $ne: null },
          },
        },
        {
          $project: {
            month: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
        },
        {
          $group: {
            _id: { createdAt: "$month" },
            count: { $sum: 1 },
          },
        },

        {
          $addFields: {
            createdAt: "$_id.createdAt",
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
        {
          $project: {
            _id: false,
          },
        },
      ]).limit(7);

      const totalSalePromise = Order.aggregate([
        // First Stage
        {
          $match: { createdAt: { $ne: null } },
        },
        {
          $match: { status: { $ne: "Cancelled" } },
        },
        // Second Stage
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            sales: { $sum: "$total" },
          },
        },
        // Third Stage
        {
          $sort: { _id: -1 },
        },
      ]);

      const totalRegister = await totalRegisterPromise;
      const totalSale = await totalSalePromise;
      res
        .status(201)
        .json({ totalRegister: totalRegister, totalSale: totalSale });
    } catch (err) {
      res.status(500).json({ err });
    }
  },

  users: async (req, res) => {
    try {
      const errorMessage = req.flash("message");
      const users = await User.find({}).sort({ createdAt: -1 }).exec();
      res.render("admin/userManagement", {
        users: users,
        errorMessage: errorMessage,
        layout: "layouts/adminLayout",
      });
    } catch (err) {
      console.log(err.message);
      res.redirect("/admin");
    }
  },

  categories: async (req, res) => {
    try {
      const errorMessage = req.flash("message");
      const allCategories = await Category.find()
        .sort({ categoryName: 1 })
        .exec();
      res.render("admin/categoryManagement", {
        allCategories: allCategories,
        errorMessage: errorMessage,
        layout: "layouts/adminLayout",
      });
    } catch (err) {
      console.log(err.message);
      res.redirect("/admin");
    }
  },

  products: async (req, res) => {
    try {
      const errorMessage = req.flash("message");
      const allCategories = await Category.find()
        .sort({ categoryName: 1 })
        .exec();
      const allProducts = await Product.find()
        .populate("category")
        .sort({ createdAt: -1 })
        .exec();
      res.render("admin/productManagement", {
        allCategories: allCategories,
        allProducts: allProducts,
        errorMessage: errorMessage,
        layout: "layouts/adminLayout",
      });
    } catch (err) {
      console.log(err.message);
      res.redirect("/admin");
    }
  },

  orders: async (req, res) => {
    try {
      const errorMessage = req.flash("message");
      const allOrders = await Order.find()
        .populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "products.productId",
            model: "Product",
          },
        ])
        .sort({ createdAt: -1 })
        .exec();
      res.render("admin/orderManagement", {
        allOrders: allOrders,
        errorMessage: errorMessage,
        layout: "layouts/adminLayout",
      });
    } catch (err) {
      console.log(err);
      req.flash("message", "Error getting order details");
      res.redirect("/admin");
    }
  },

  coupons: async (req, res) => {
    const allCoupons = await Coupon.find().sort({ createdAt: -1 }).exec();
    const errorMessage = req.flash("message");
    res.render("admin/couponManagement", {
      allCoupons: allCoupons,
      errorMessage: errorMessage,
      layout: "layouts/adminLayout",
    });
  },

  orderDetails: async (req, res) => {
    try {
      const orderId = req.params.id;
      const myOrder = await Order.findById(orderId)
        .populate([
          {
            path: "userId",
            model: "User",
          },
          {
            path: "products.productId",
            model: "Product",
          },
          {
            path: "coupon",
            model: "Coupon",
          },
        ])
        .exec();
      console.log(myOrder);
      if (myOrder) {
        res.render("admin/orderDetails", {
          myOrder: myOrder,
          layout: "layouts/adminLayout",
        });
      } else {
        req.flash("message", "Invalid orderId");
        res.redirect("/admin/orders");
      }
    } catch (err) {
      req.flash("message", "Invalid orderId");
      res.redirect("/admin/orders");
      console.log(err);
    }
  },

  addCategory: async (req, res) => {
    try {
      const category = new Category({
        categoryName: _.startCase(_.toLower(req.body.categoryName)),
      });
      await category.save();
      res.redirect("/admin/categories");
    } catch (err) {
      console.log(err.message);
      req.flash("message", "category already exists");
      res.redirect("/admin/categories");
    }
  },

  editCategory: async (req, res) => {
    try {
      await Category.findByIdAndUpdate(req.params.id, {
        categoryName: _.startCase(_.toLower(req.body.categoryName)),
      });
      res.redirect("/admin/categories");
    } catch (err) {
      console.log(err.message);
      req.flash("message", "Error editing in category");
      res.redirect("/admin/categories");
    }
  },

  deleteCategory: async (req, res) => {
    let category;
    try {
      category = await Category.findById(req.params.id);
      await category.remove();
      res.redirect("/admin/categories");
    } catch (err) {
      console.log(err.message);
      if (category == null) {
        res.redirect("/admin");
      } else {
        req.flash("message", err.message);
        res.redirect("/admin/categories");
      }
    }
  },

  blockUser: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { isActive: false });
      res.redirect("/admin/users");
    } catch (err) {
      console.log(err.message);
      req.flash("message", "Error blocking User");
      res.redirect("/admin/users");
    }
  },

  unblockUser: async (req, res) => {
    try {
      await User.findByIdAndUpdate(req.params.id, { isActive: true });
      res.redirect("/admin/users");
    } catch (error) {
      console.log(err.message);
      req.flash("message", "Error un blocking User");
      res.redirect("/admin/users");
    }
  },
};

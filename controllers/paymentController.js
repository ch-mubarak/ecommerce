const Razorpay = require("razorpay");

const instance = new Razorpay({
    key_id: process.env.key_id,
    key_secret: process.env.key_secret,
});

module.exports = {
    generateOrder: (req, res) => {
        const options = {
            amount: req.body.amount,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order1001"
        };
        instance.orders.create(options, function (err, order) {
            res.send({ orderId: order.id })
        });
    },

    verifyPayment: (req, res) => {
        let body = req.body.orderId + "|" + req.body.response.razorpay_payment_id;

        const crypto = require("crypto");
        const expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        let response = { "signatureIsValid": "false" }
        if (expectedSignature === req.body.response.razorpay_signature) {
            response = { "signatureIsValid": "true" }
        }
        res.send(response);

    },

    refund: (req, res) => {
        const paymentId = req.params.id
        instance.payments.refund(paymentId, {
            "amount": req.body.amount,
            "speed": "optimum",
            "receipt": "Receipt No. 31"
        })
    },
}
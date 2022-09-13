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
        const orderId = req.params.orderId
        let body = orderId + "|" + req.body.response.razorpay_payment_id;

        const crypto = require("crypto");
        const expectedSignature = crypto.createHmac('sha256', process.env.key_secret)
            .update(body.toString())
            .digest('hex');
        console.log("sig received ", req.body.response.razorpay_signature);
        console.log("sig generated ", expectedSignature);
        let response = { "signatureIsValid": false }
        if (expectedSignature === req.body.response.razorpay_signature) {
            response = { "signatureIsValid": true }
        }
        res.send(response);

    },

    refund: async (req, res) => {
        try {
            const paymentId = req.params.id
            await instance.payments.refund(paymentId, {
                "amount": req.body.amount,
                "speed": "optimum",
            })
            res.status(201).json({ message: "refund success" })
        } catch (err) {
            res.status(500).json({ err })
        }
    },
}
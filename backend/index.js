require("dotenv").config();

const port = process.env.PORT || 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { error } = require("console");
const { type } = require("os");


app.use(cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://your-frontend.vercel.app",
      "https://your-admin.vercel.app"
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Database connection with Mongodb
// mongoose.connect("mongodb+srv://ecommerceMern:Chathumi123@cluster0.wfqmu1m.mongodb.net/ecommerce-mern?retryWrites=true&w=majority&appName=Cluster0")
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
//API Creation
app.get("/", (req,res) => {
    res.send("Express App is running")

})

//Image storage engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

//Creating upload endpoint for images
app.use('/images', express.static('upload/images'))
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success : 1,
        image_url: `http://localhost:4000/images/${req.file.filename}`
    })
})

//Schema for crating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})

//Creating api for addproduct

// app.post('/addproduct', async(req, res) => {
//     let products = await Product.find({});
//     let id;
//     if(products.length > 0){
//         let last_product_array = products.slice(-1);
//         let last_product = last_product_array[0];
//         id = last_product.id +1;
//     }else{
//         id = 1;
//     }
//     const product = new Product({
//         id: id,
//         name: req.body.name,
//         image: req.body.image,
//         category: req.body.category,
//         new_price: req.body.new_price,
//         old_price: req.body.old_price,
//     });
//     console.log(product);
//     await product.save();
//     console.log("Saved")
//     res.json({
//         success: true,
//         name: req.body.name,
//     })
// })
// Creating API for addproduct
app.post('/addproduct', async(req, res) => {
    let products = await Product.find({}).sort({ id: -1 }).limit(1); // Get highest ID
    let id;
    
    if(products.length > 0){
        id = products[0].id + 1; // Increment from highest
    } else {
        id = 1; // First product
    }
    
    // Double-check ID doesn't exist (safety check)
    const existingProduct = await Product.findOne({ id: id });
    if (existingProduct) {
        console.error('ID collision detected! Finding next available ID...');
        const allProducts = await Product.find({}).sort({ id: -1 });
        id = allProducts.length > 0 ? allProducts[0].id + 1 : 1;
    }
    
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    
    console.log('Adding product with ID:', id);
    await product.save();
    console.log("Saved")
    
    res.json({
        success: true,
        name: req.body.name,
        id: id
    })
})

// Creating API for updating product
app.post('/updateproduct', async(req, res) => {
    await Product.findOneAndUpdate(
        {id: req.body.id},
        {
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        }
    );
    console.log("Updated");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//Creating api for addproducts
app.post('/removeproduct', async(req, res) =>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//Creating api to get all products
app.get('/allproducts', async(req, res) => {
    let products = await Product.find({});
        console.log("All products fetched");
        res.send(products);
})

// Schema user model

const User = mongoose.model('User',{
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
})

// Creating endpoint for registering the user
app.post('/signup', async(req, res) => {
    let check = await User.findOne({email: req.body.email});
    if (check){
        return res.status(400).json({success: false, errors: "Existing user found with same email address"})
    }

    let cart = {};
    for (let i = 0; i < 300;i++){
        cart[i] = 0;
    }
    const user = new User({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    await user.save();

        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, process.env.JWT_SECRET);
        res.json({success: true, token})
})

//Creating  endpoint for user login
app.post('/login', async(req, res) => {
    let user = await User.findOne({email: req.body.email});
    if (user){
        const passMatch = req.body.password === user.password;
        if(passMatch){
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({success: true, token})
        }
        else{
            res.json({success: false, errors:"Wrong Password"});
        }
    }else{
        res.json({success: false, errors:"Wrong Email Address"})
    }

})

//Creating endpoint for latestproducts
app.get('/newcollections', async(req, res) => {
    let products = await Product.find({});
    let newcollection =  products.slice(1).slice(-8);
    console.log("Newcollection Fetched")
    res.send(newcollection);
})

//Creating endpoint for popular products
app.get('/popularproducts', async(req, res) => {
    let products = await Product.find({category: "men"});
    let popularproducts =  products.slice(0, 4);
    console.log("popular products Fetched")
    res.send(popularproducts);
})

//Creating middlewear to fetch user
const fetchUser = async(req, res, next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "Please authenticate using valid login"})
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
            next();            
        } catch (error){
            res.status(401).send({errors: "Please authenticate using a valid token"});
        }
    }
}

//Creating endpoint for adding products in cartData
app.post('/addtocart',fetchUser, async(req, res) => {
    console.log("Added", req.body.itemId)
    let userData = await User.findOne({_id: req.user.id})
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    /* res.send("Added"); */
    res.json({ success: true, message: "Added" });
})

// Creating endpoint for removing cartData
app.post('/removefromcart',fetchUser, async(req, res) => {
        console.log("Removed", req.body.itemId)
    let userData = await User.findOne({_id: req.user.id})
    if (userData.cartData[req.body.itemId] >0)
        userData.cartData[req.body.itemId] -= 1;
    await User.findOneAndUpdate({_id:req.user.id}, {cartData:userData.cartData});
    /* res.send("Added"); */
    res.json({ success: true, message: "Removed" });
})

// Creating endpoint to get cart data
app.post('/getcart',fetchUser, async(req, res) => {
    console.log('Get cart');
    let userData = await User.findOne({_id: req.user.id});
    res.json(userData.cartData);
})

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
app.post('/create-checkout-session', fetchUser, async (req, res) => {
    try {
        const { items } = req.body; // Array of cart items

        // Create line items for Stripe
        const lineItems = items.map(item => ({
            price_data: {
                currency: 'lkr', // Sri Lankan Rupees
                product_data: {
                    name: item.name,
                    images: [item.image],
                },
                unit_amount: Math.round(item.new_price * 100), // Convert to cents
            },
            quantity: item.quantity,
        }));

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/cart-page`,
            customer_email: req.body.email,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Verify payment and clear cart
app.post('/verify-payment', fetchUser, async (req, res) => {
    try {
        const { sessionId } = req.body;
        
        console.log('Verifying payment for session:', sessionId); // Debug log
        console.log('User ID:', req.user.id); // Debug log
        
        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        
        console.log('Payment status:', session.payment_status); // Debug log
        
        if (session.payment_status === 'paid') {
            // Clear user's cart - FIXED VERSION
            let cart = {};
            for (let i = 0; i < 301; i++) {  // Changed to 301 to match your initialization
                cart[i] = 0;
            }
            
            // Update user cart in database
            const updateResult = await User.findOneAndUpdate(
                { _id: req.user.id }, 
                { cartData: cart },
                { new: true }  // Return updated document
            );
            
            console.log('Cart cleared for user:', req.user.id); // Debug log
            console.log('Update result:', updateResult ? 'Success' : 'Failed'); // Debug log
            
            res.json({ 
                success: true, 
                message: 'Payment successful and cart cleared',
                customerDetails: session.customer_details
            });
        } else {
            res.json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ error: error.message });
    }
});



app.listen(port, (error) => {
    if (!error) {
        console.log("Server is running on port " + port)
    }else{
        console.log("Error: " + error);
    }
})
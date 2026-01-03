// import React, { useContext } from 'react'
// import { ShopContext } from '../Context/ShopContext';
// import { TbTrash } from 'react-icons/tb';

// const CartItems = () => {

//     const { getTotalCartAmount, all_products, cartItems, removeFromCart } = useContext(ShopContext);
//     return (
//         <section className='max_padd_container pt-28 '>
//             <table className='w-full mx-auto'>
//                 <thead>
//                     <tr className='bg-slate-900/10 regular-18 sm:regular-22 text-start py-12'>
//                         <th className='p-1 py-2'>Products</th>
//                         <th className='p-1 py-2'>Title</th>
//                         <th className='p-1 py-2'>Price</th>
//                         <th className='p-1 py-2'>Quantity</th>
//                         <th className='p-1 py-2'>Total</th>
//                         <th className='p-1 py-2'>Remove</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {all_products.map((e) => {
//                         if (cartItems[e.id] > 0) {
//                             return <tr key={e.id} className='border-b border-slate-900/20 text-gray-30 p-6 medium-14 text-center'>
//                                 <td className='flexCenter '><img src={e.image} alt="prdctImg" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1'/></td>
//                                 <td><div className='line-clamp-3'>{e.name}</div></td>
//                                 <td>Rs.{e.new_price}</td>
//                                 <td className='w-16 h-16 bg-white'>{cartItems[e.id]}</td>
//                                 <td>Rs.{e.new_price * cartItems[e.id]}</td>
//                                 <td>
//                                     <div className='bold-22 pl-14'><TbTrash onClick={() => removeFromCart(e.id)}/></div>
//                                 </td>
//                             </tr>

//                         }
//                         return null;
//                     })}
//                 </tbody>
//             </table>
//             {/* Cart Details */}
//             <div className='flex flex-col gap-20 my-16 p-8 md:flex-row rounded-md bg-white w-full max-w-[666px]'>
//                 <div className='flex flex-col gap-10'>
//                     <h4 className='bold-20'>Summary</h4>
//                     <div>
//                         <div className='flexBetween py-4'>
//                             <h4 className='medium-16'>Subtotal:</h4>
//                             <h4 className='text-gray-30 font-semibold'> Rs.{getTotalCartAmount()}</h4>
//                         </div>
//                         <hr />
//                         <div className='flexBetween py-4'>
//                             <h4 className='medium-16'>Shipping Fee:</h4>
//                             <h4 className='text-gray-30 font-semibold'>Free</h4>
//                         </div>
//                         <hr />
//                         <div className='flexBetween py-4'>
//                             <h4 className='bold-18'>Total:</h4>
//                             <h4 className='bold-18'>Rs.{getTotalCartAmount()}</h4>
//                         </div>
//                     </div>
//                     <button className='btn_dark_rounded w-44'>Checkout</button>
//                     <div className='flex flex-col gap-10'>
//                         <h4 className='bold-20 capitalize'>Enter your Coupon code here:</h4>
//                         <div className='flexBetween pl-5 h-12 bg-primary rounded-full ring-1 ring-slate-900/10'>
//                             <input type="text" placeholder='Coupon code' className='bg-transparent border-none outline-none'/>
//                             <button className='btn_dark_rounded'>Submit</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
    
//   )
// }

// export default CartItems

import React, { useContext, useState } from 'react'
import { ShopContext } from '../Context/ShopContext';
import { TbTrash } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';

const CartItems = () => {
    const { getTotalCartAmount, all_products, cartItems, removeFromCart } = useContext(ShopContext);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCheckout = async () => {
        // Check if user is logged in
        const token = localStorage.getItem('auth-token');
        if (!token) {
            alert('Please login to checkout');
            navigate('/login');
            return;
        }

        // Prepare cart items for Stripe
        const checkoutItems = all_products
            .filter(product => cartItems[product.id] > 0)
            .map(product => ({
                id: product.id,
                name: product.name,
                image: product.image,
                new_price: product.new_price,
                quantity: cartItems[product.id]
            }));

        if (checkoutItems.length === 0) {
            alert('Your cart is empty');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:4000/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                },
                body: JSON.stringify({ 
                    items: checkoutItems,
                    email: 'customer@example.com' // You can get this from user data
                })
            });

            const data = await response.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                alert('Error creating checkout session');
            }
        } catch (error) {
            console.error('Checkout Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className='max_padd_container pt-28 '>
            <table className='w-full mx-auto'>
                <thead>
                    <tr className='bg-slate-900/10 regular-18 sm:regular-22 text-start py-12'>
                        <th className='p-1 py-2'>Products</th>
                        <th className='p-1 py-2'>Title</th>
                        <th className='p-1 py-2'>Price</th>
                        <th className='p-1 py-2'>Quantity</th>
                        <th className='p-1 py-2'>Total</th>
                        <th className='p-1 py-2'>Remove</th>
                    </tr>
                </thead>
                <tbody>
                    {all_products.map((e) => {
                        if (cartItems[e.id] > 0) {
                            return <tr key={e.id} className='border-b border-slate-900/20 text-gray-30 p-6 medium-14 text-center'>
                                <td className='flexCenter '><img src={e.image} alt="prdctImg" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1'/></td>
                                <td><div className='line-clamp-3'>{e.name}</div></td>
                                <td>Rs.{e.new_price}</td>
                                <td className='w-16 h-16 bg-white'>{cartItems[e.id]}</td>
                                <td>Rs.{e.new_price * cartItems[e.id]}</td>
                                <td>
                                    <div className='bold-22 pl-14'><TbTrash onClick={() => removeFromCart(e.id)}/></div>
                                </td>
                            </tr>
                        }
                        return null;
                    })}
                </tbody>
            </table>
            {/* Cart Details */}
            <div className='flex flex-col gap-20 my-16 p-8 md:flex-row rounded-md bg-white w-full max-w-[666px]'>
                <div className='flex flex-col gap-10'>
                    <h4 className='bold-20'>Summary</h4>
                    <div>
                        <div className='flexBetween py-4'>
                            <h4 className='medium-16'>Subtotal:</h4>
                            <h4 className='text-gray-30 font-semibold'> Rs.{getTotalCartAmount()}</h4>
                        </div>
                        <hr />
                        <div className='flexBetween py-4'>
                            <h4 className='medium-16'>Shipping Fee:</h4>
                            <h4 className='text-gray-30 font-semibold'>Free</h4>
                        </div>
                        <hr />
                        <div className='flexBetween py-4'>
                            <h4 className='bold-18'>Total:</h4>
                            <h4 className='bold-18'>Rs.{getTotalCartAmount()}</h4>
                        </div>
                    </div>
                    <button 
                        onClick={handleCheckout} 
                        disabled={loading}
                        className='btn_dark_rounded w-44'
                    >
                        {loading ? 'Processing...' : 'Checkout'}
                    </button>
                    <div className='flex flex-col gap-10'>
                        <h4 className='bold-20 capitalize'>Enter your Coupon code here:</h4>
                        <div className='flexBetween pl-5 h-12 bg-primary rounded-full ring-1 ring-slate-900/10'>
                            <input type="text" placeholder='Coupon code' className='bg-transparent border-none outline-none'/>
                            <button className='btn_dark_rounded'>Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CartItems
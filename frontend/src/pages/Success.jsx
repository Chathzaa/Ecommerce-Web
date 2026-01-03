// import { useEffect, useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const Success = () => {
//     const [searchParams] = useSearchParams();
//     const navigate = useNavigate();
//     const [verifying, setVerifying] = useState(true);
//     const [paymentSuccess, setPaymentSuccess] = useState(false);

//     useEffect(() => {
//         const verifyPayment = async () => {
//             const sessionId = searchParams.get('session_id');
            
//             if (!sessionId) {
//                 navigate('/cart-page');
//                 return;
//             }

//             try {
//                 const token = localStorage.getItem('auth-token');
//                 const response = await fetch('http://localhost:4000/verify-payment', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'auth-token': token
//                     },
//                     body: JSON.stringify({ sessionId })
//                 });

//                 const data = await response.json();
                
//                 if (data.success) {
//                     setPaymentSuccess(true);
//                     // Redirect to home after 3 seconds
//                     setTimeout(() => {
//                         navigate('/');
//                     }, 3000);
//                 } else {
//                     alert('Payment verification failed');
//                     navigate('/cart-page');
//                 }
//             } catch (error) {
//                 console.error('Verification Error:', error);
//                 alert('Something went wrong');
//                 navigate('/cart-page');
//             } finally {
//                 setVerifying(false);
//             }
//         };

//         verifyPayment();
//     }, [searchParams, navigate]);

//     return (
//         <section className='max_padd_container pt-32 min-h-screen flexCenter'>
//             <div className='bg-white p-12 rounded-lg shadow-lg text-center max-w-md'>
//                 {verifying ? (
//                     <>
//                         <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4'></div>
//                         <h2 className='h2'>Verifying Payment...</h2>
//                         <p className='text-gray-30 mt-4'>Please wait while we confirm your payment</p>
//                     </>
//                 ) : paymentSuccess ? (
//                     <>
//                         <div className='text-6xl mb-4'>✅</div>
//                         <h2 className='h2 text-green-600'>Payment Successful!</h2>
//                         <p className='text-gray-30 mt-4'>Thank you for your purchase.</p>
//                         <p className='text-gray-30'>Your order has been placed successfully.</p>
//                         <p className='text-sm text-gray-20 mt-6'>Redirecting to home page...</p>
//                     </>
//                 ) : (
//                     <>
//                         <div className='text-6xl mb-4'>❌</div>
//                         <h2 className='h2 text-red-600'>Payment Failed</h2>
//                         <p className='text-gray-30 mt-4'>Something went wrong with your payment.</p>
//                     </>
//                 )}
//             </div>
//         </section>
//     );
// };

// export default Success;
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';

const Success = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verifying, setVerifying] = useState(true);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const { setCartItems } = useContext(ShopContext); // Add this

    useEffect(() => {
        const verifyPayment = async () => {
            const sessionId = searchParams.get('session_id');
            
            console.log('Session ID:', sessionId);
            console.log('Current URL:', window.location.href);
            
            if (!sessionId) {
                console.log('No session ID found');
                navigate('/cart-page');
                return;
            }

            try {
                const token = localStorage.getItem('auth-token');
                
                if (!token) {
                    alert('Please login first');
                    navigate('/login');
                    return;
                }

                const response = await fetch('http://localhost:4000/verify-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': token
                    },
                    body: JSON.stringify({ sessionId })
                });

                const data = await response.json();
                
                console.log('Verification response:', data);
                
                if (data.success) {
                    setPaymentSuccess(true);
                    
                    // FORCE CLEAR CART IN FRONTEND STATE
                    const emptyCart = {};
                    for (let i = 0; i < 301; i++) {
                        emptyCart[i] = 0;
                    }
                    setCartItems(emptyCart);
                    
                    // Also fetch fresh cart data from backend
                    const cartResponse = await fetch('http://localhost:4000/getcart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'auth-token': token
                        },
                        body: ''
                    });
                    
                    const freshCartData = await cartResponse.json();
                    setCartItems(freshCartData);
                    
                    console.log('Cart cleared successfully');
                    
                    // Redirect to home after 3 seconds
                    setTimeout(() => {
                        navigate('/');
                        window.location.reload(); // Force full page reload to refresh cart
                    }, 3000);
                } else {
                    alert('Payment verification failed: ' + (data.message || 'Unknown error'));
                    navigate('/cart-page');
                }
            } catch (error) {
                console.error('Verification Error:', error);
                alert('Something went wrong during verification');
                navigate('/cart-page');
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [searchParams, navigate, setCartItems]);

    return (
        <section className='max_padd_container pt-32 min-h-screen flexCenter'>
            <div className='bg-white p-12 rounded-lg shadow-lg text-center max-w-md'>
                {verifying ? (
                    <>
                        <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4'></div>
                        <h2 className='h2'>Verifying Payment...</h2>
                        <p className='text-gray-30 mt-4'>Please wait while we confirm your payment</p>
                    </>
                ) : paymentSuccess ? (
                    <>
                        <div className='text-6xl mb-4'>✅</div>
                        <h2 className='h2 text-green-600'>Payment Successful!</h2>
                        <p className='text-gray-30 mt-4'>Thank you for your purchase.</p>
                        <p className='text-gray-30'>Your order has been placed successfully.</p>
                        <p className='text-gray-30 mt-2'>Your cart has been cleared.</p>
                        <p className='text-sm text-gray-20 mt-6'>Redirecting to home page...</p>
                    </>
                ) : (
                    <>
                        <div className='text-6xl mb-4'>❌</div>
                        <h2 className='h2 text-red-600'>Payment Failed</h2>
                        <p className='text-gray-30 mt-4'>Something went wrong with your payment.</p>
                        <button 
                            onClick={() => navigate('/cart-page')}
                            className='btn_dark_rounded mt-6'
                        >
                            Return to Cart
                        </button>
                    </>
                )}
            </div>
        </section>
    );
};

export default Success;
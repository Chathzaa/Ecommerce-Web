// import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
// import Header from "./components/Header";
// import Home from "./pages/Home";
// import Category from "./pages/Category";
// import Cart from "./pages/Cart";
// import Login from "./pages/Login";
// import Product from "./pages/Product";
// import Footer from "./components/Footer";
// /* import images */ 
// import bannermens from "./assets/bannermens.png"
// import bannerwomens from "./assets/bannerwomens.png"
// import bannerkids from "./assets/bannerkids.png"

// export default function App() {
//   return (
//     <main className="bg-primary text-tertiary">
    
//       <BrowserRouter>
//         <Header />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/men" element={<Category category="men" banner={bannermens}/>} />
//           <Route path="/women" element={<Category category="women" banner={bannerwomens}/>} />
//           <Route path="/kids" element={<Category category="kid" banner={bannerkids}/>} />
//           <Route path="/product" element={<Product />}>
//             <Route path=":productId" element={<Product />} />
//           </Route>
//           <Route path="/cart-page" element={<Cart />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//         <Footer />
//       </BrowserRouter>
//     </main>
//   )
// }

import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Footer from "./components/Footer";
import Success from "./pages/Success";
/* import images */ 
import bannermens from "./assets/bannermens.png"
import bannerwomens from "./assets/bannerwomens.png"
import bannerkids from "./assets/bannerkids.png"

function AppContent() {
  const location = useLocation();
  
  // Define paths where header and footer should be hidden
  const hideHeaderFooterPaths = ['/login', '/signup'];
  
  // Check if current path should hide header/footer
  const shouldHideHeaderFooter = hideHeaderFooterPaths.includes(location.pathname);

  return (
    <main className="bg-primary text-tertiary">
      {!shouldHideHeaderFooter && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/men" element={<Category category="men" banner={bannermens}/>} />
        <Route path="/women" element={<Category category="women" banner={bannerwomens}/>} />
        <Route path="/kids" element={<Category category="kid" banner={bannerkids}/>} />
        <Route path="/product" element={<Product />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/cart-page" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        {/* Add signup route here if you have one */}
        {/* <Route path="/signup" element={<Signup />} /> */}
      </Routes>
      {!shouldHideHeaderFooter && <Footer />}
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
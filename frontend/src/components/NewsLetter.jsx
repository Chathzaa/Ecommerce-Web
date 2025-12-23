
const NewsLetter = () => {
  return (
    <section className="max_padd_container py-12 xl:py-28 bg-white">
        <div className="mx-auto xl:w-[80%] flrxCenter flex-col gap-y-8 w-full max-w-[666px]"> 
            <h3 className="h3">Get Exclusive Offers on your Email</h3>
            <h4 className="uppercase bold-18">Subscribe to our newsletter and stay updated.</h4>
            <div className="flexBetwenn rounded-full ring-1 ring-slate-900/5 hover:ring-slate-900/10 bg-primary w-full maax-w-[588px]">
                <input type="email" placeholder="Your email address" className="w-full bg-transparent px-7 py-4 border-none outline-none regular-16"/>
               
            </div>
             <button className="btn_dark_rounded mt-4">Subscribe</button>
        </div>
    </section>
  )
}

export default NewsLetter
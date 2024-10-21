import { NavLink } from 'react-router-dom'
import { MdOutlineLocalOffer } from 'react-icons/md'
import { FaStar } from "react-icons/fa6";


const Hero = () => {
    return (
        <section className='relative bg-hero bg-cover bg-center bg-no-repeat h-screen w-full'>
            <div className='max_padd_container relative top-32 xs:top-52'>
                <h1 className='h2 capitalize max-w-[37rem]'>Exploring Style Through Fashion</h1>
                <p className='text-gray-50 regular-16 mt-6 max-w-[33rem]'>
                    Discover the perfect ensemble to express your personal flair at Sihaya, destination for stylish apparel for men, women, and kids.Explore our diverse collection, meticulously curated to cater to your unique sense of style. From timeless classics to trendy essentials, we offer a wide range of clothing that exudes quality, comfort, and sophistication.
                </p>
                <div className='my-10'>
                <div className='flexStart !items-center gap-x-4 my-10'>
                    <div className='!regualr-24 flexCenter gap-x-3'>
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                    </div>
                    <div className='bold-16 sm:bold-20'>176k <span className='regular-16 sm:regular-20'>Excellent Reviews</span></div>
                    </div>
                </div>
                <div className='max-xs:flex-col flex gap-2'>
                    <NavLink to={''} className={"btn_dark_rounded flexCenter"}> Shop now</NavLink>
                    <NavLink to={''} className={"btn_dark_rounded flexCenter gap-x-2"}>
                        <MdOutlineLocalOffer className='text-2xl' /> Offers
                    </NavLink>
                </div>
            </div>

        </section>
    )
}

export default Hero
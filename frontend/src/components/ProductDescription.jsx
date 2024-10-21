import React from 'react'

const ProductDescription = () => {
  return (
    <div className='mt-20'>
        <div className='flex gap-3 mb-4'>
            <button className='btn_dark_rounded !rounded-none !text-xs !py-[6px] w-36'>Description</button>
            <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Care Guide</button>
            <button className='btn_dark_outline !rounded-none !text-xs !py-[6px] w-36'>Size Guide</button>
        </div>
        <div className='flex flex-col pb-16'> 
            <p className='text-sm'>The Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse features a chic overlap collar, elegant flutter sleeves, and a flattering peplum hem.
                Perfect for both casual and semi-formal occasions, this blouse offers a stylish and comfortable fit with its classic striped pattern.</p>
                <p className='text-sm'>Elevate your wardrobe with our Striped Flutter Sleeve Overlap Collar Peplum Hem Blouse.
                Featuring a sophisticated overlap collar, feminine flutter sleeves, and a flattering peplum hem, it blends classic stripes with modern style effortlessly. 
                Perfect for any occasion, this blouse offers both comfort and elegance in one chic package.</p>
        </div>
    </div>
  )
}

export default ProductDescription
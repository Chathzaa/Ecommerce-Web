// import React from 'react'
// import { useEffect } from 'react';
// import { useState } from 'react';
// import {TbTrash} from 'react-icons/tb'

// const ListProduct = () => {

//     const [allproducts, setAllproducts] = useState([]);
//     const fetchInfo = async () => {
//         await fetch('http://localhost:4000/allproducts').then((res) => res.json()).then((data) => {setAllproducts(data)})
//     }

//     useEffect(()=> {
//         fetchInfo();
//     },[])

//     const remove_product = async (id)=> {
//         await fetch('http://localhost:4000/removeproduct', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body:JSON.stringify({id:id})
//         })
//         await fetchInfo();
//     }

//   return (
//     <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-4 sm:p-4 sm:m-7'>
//         <h4 className='bold-22 p-5 uppercase'>Product List</h4>
//         <div className='max-h-[77vh] overflow-auto px-4 text-center'>
//             <table className='w-full mx-auto'>
//                 <thead>
//                     <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
//                         <th className='p-2'>Products</th>
//                         <th className='p-2'>Title</th>
//                         <th className='p-2'>Old Price</th>
//                         <th className='p-2'>New Price</th>
//                         <th className='p-2'>Category</th>
//                         <th className='p-2'>Remove</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {allproducts.map((product, i) => (
//                         <tr key={i} className='border-b border-slate-900/20 text-gray-20 p-6 medium-14'>
//                             <td className='flexStart sm:flexCenter'>
//                                 <img src={product.image} alt="" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1'/>
//                             </td>
//                             <td><div className='line-clamp-3'>{product.name}</div></td>
//                             <td>Rs.{product.old_price}</td>
//                             <td>Rs.{product.new_price}</td>
//                             <td>{product.category}</td>
//                             <td><div className='bold-22 pl-6 sm:pl-14'><TbTrash onClick={()=> remove_product(product.id)}/></div></td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     </div>
//   )
// }

// export default ListProduct

import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import {TbTrash, TbEdit} from 'react-icons/tb'

const ListProduct = () => {

    const [allproducts, setAllproducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState({
        id: '',
        name: '',
        old_price: '',
        new_price: '',
        category: '',
        image: ''
    });

    const fetchInfo = async () => {
        await fetch('http://localhost:4000/allproducts')
            .then((res) => res.json())
            .then((data) => {setAllproducts(data)})
    }

    useEffect(()=> {
        fetchInfo();
    },[])

    const remove_product = async (id)=> {
        await fetch('http://localhost:4000/removeproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({id:id})
        })
        await fetchInfo();
    }

    // NEW: Start editing
    const startEdit = (product) => {
        setEditingProduct(product.id);
        setEditForm({
            id: product.id,
            name: product.name,
            old_price: product.old_price,
            new_price: product.new_price,
            category: product.category,
            image: product.image
        });
    }

    // NEW: Handle form changes
    const handleEditChange = (e) => {
        setEditForm({
            ...editForm,
            [e.target.name]: e.target.value
        });
    }

    // NEW: Save updated product
    const saveEdit = async () => {
        await fetch('http://localhost:4000/updateproduct', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(editForm)
        })
        .then((res) => res.json())
        .then((data) => {
            if(data.success) {
                alert("Product Updated Successfully");
                setEditingProduct(null);
                fetchInfo();
            }
        });
    }

    // NEW: Cancel editing
    const cancelEdit = () => {
        setEditingProduct(null);
    }

    return (
        <div className='p-2 box-border bg-white mb-0 rounded-sm w-full mt-4 sm:p-4 sm:m-7'>
            <h4 className='bold-22 p-5 uppercase'>Product List</h4>
            <div className='max-h-[77vh] overflow-auto px-4 text-center'>
                <table className='w-full mx-auto'>
                    <thead>
                        <tr className='bg-primary bold-14 sm:regular-22 text-start py-12'>
                            <th className='p-2'>Products</th>
                            <th className='p-2'>Title</th>
                            <th className='p-2'>Old Price</th>
                            <th className='p-2'>New Price</th>
                            <th className='p-2'>Category</th>
                            <th className='p-2'>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allproducts.map((product, i) => (
                            <React.Fragment key={i}>
                                {/* Normal Row */}
                                {editingProduct !== product.id ? (
                                    <tr className='border-b border-slate-900/20 text-gray-20 p-6 medium-14'>
                                        <td className='flexStart sm:flexCenter'>
                                            <img src={product.image} alt="" height={43} width={43} className='rounded-lg ring-1 ring-slate-900/5 my-1'/>
                                        </td>
                                        <td><div className='line-clamp-3'>{product.name}</div></td>
                                        <td>Rs.{product.old_price}</td>
                                        <td>Rs.{product.new_price}</td>
                                        <td>{product.category}</td>
                                        <td>
                                            <div className='flex gap-2 justify-center items-center'>
                                                <TbEdit 
                                                    className='cursor-pointer text-blue-500 text-xl' 
                                                    onClick={() => startEdit(product)}
                                                />
                                                <TbTrash 
                                                    className='cursor-pointer text-red-500 text-xl' 
                                                    onClick={() => remove_product(product.id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    /* Edit Row */
                                    <tr className='border-b border-slate-900/20 bg-blue-50'>
                                        <td className='p-2'>
                                            <img src={editForm.image} alt="" height={43} width={43} className='rounded-lg'/>
                                        </td>
                                        <td className='p-2'>
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={editForm.name}
                                                onChange={handleEditChange}
                                                className='w-full p-1 border rounded'
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <input 
                                                type="number" 
                                                name="old_price"
                                                value={editForm.old_price}
                                                onChange={handleEditChange}
                                                className='w-20 p-1 border rounded'
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <input 
                                                type="number" 
                                                name="new_price"
                                                value={editForm.new_price}
                                                onChange={handleEditChange}
                                                className='w-20 p-1 border rounded'
                                            />
                                        </td>
                                        <td className='p-2'>
                                            <select 
                                                name="category"
                                                value={editForm.category}
                                                onChange={handleEditChange}
                                                className='p-1 border rounded'
                                            >
                                                <option value="women">Women</option>
                                                <option value="men">Men</option>
                                                <option value="kid">Kid</option>
                                            </select>
                                        </td>
                                        <td className='p-2'>
                                            <div className='flex gap-2 justify-center'>
                                                <button 
                                                    onClick={saveEdit}
                                                    className='bg-green-500 text-white px-3 py-1 rounded text-sm'
                                                >
                                                    Save
                                                </button>
                                                <button 
                                                    onClick={cancelEdit}
                                                    className='bg-gray-500 text-white px-3 py-1 rounded text-sm'
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ListProduct
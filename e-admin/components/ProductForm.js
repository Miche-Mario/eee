import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
    _id,
    title: existingTitle,
    description: existingDescription,
    price: existingPrice,
    images: existingImages,
    category: assignedCategory,
    properties: assinedProperties
}) {
    const [title, setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [productProperties, setProductProperties] = useState(assinedProperties || {})
    const [category, setCategory] = useState(assignedCategory || '')
    const [price, setPrice] = useState(existingPrice || '');
    const [goToProducts, setGoToProducts] = useState(false);
    const [images, setImages] = useState(existingImages || []);
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([])

    const router = useRouter()



    useEffect(() => {
        axios.get('/api/categories').then(res => {
            setCategories(res.data)
        })
    },[])
    async function saveProduct(e) {
        e.preventDefault();
        const data = { title, description, price, images, category,properties: productProperties}

        if (_id) {
            //update
            await axios.put('/api/products', { ...data, _id });

        } else {
            //create
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)

    }

    if (goToProducts) {
        router.push('/products')
    }

    async function uploadImages(e) {
        const files = e.target?.files;
        if(files?.length > 0) {
            setIsUploading(true)
            const data = new FormData();

            for(const file of files) {
                data.append('file', file);
            }

            const res = await axios.post('/api/upload',  data);
            setImages(oldImages => {
                return [...oldImages, ...res.data.links];
            })
            setIsUploading(false)
        }
    }

    function updateImagesOrder(images) {
        setImages(images)
    }


    function setProductProp (propName, value) {
        setProductProperties(prev => {
            const newProductProps = {...prev};
            newProductProps[propName] = value;
            return newProductProps;
        })
    }

    const propertiesToFill = [];
    if(categories.length > 0 && category) {
        let catInfo = categories.find(({_id}) => _id === category);
        propertiesToFill.push(...catInfo.properties);

        while (catInfo?.parent?._id) {
            const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
            propertiesToFill.push(...parentCat.properties);
            catInfo = parentCat;
        }
    }

    return (
        <>
            <form onSubmit={saveProduct}>
                <label>Product name</label>
                <input
                    type="text"
                    placeholder="product name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <label>Category</label>
                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">Uncategorized</option>
                    {
                        categories.length > 0 && categories.map((cat) =>  (
                            <option value={cat._id}>{cat.name}</option>
                        ))
                    }
                </select>
                {
                    categories.length > 0  && propertiesToFill.map((p) => (
                        <div className>
                            <label>{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                            <div>
                                <select
                                    onChange={(e) => setProductProp(p.name, e.target.value )}
                                    value={productProperties[p.name]}
                                >
                                    {
                                        p.values.map((v) => (
                                            <option value={v}>{v}</option>
                                        ))
                                    }
                                </select>
                            </div>
                        </div>
                        
                    ))
                }
                <label>
                    Photos
                </label>
                <div className="mb-2 flex flex-wrap gap-1">
                    <ReactSortable 
                        list={images} 
                        setList={updateImagesOrder}
                        className="flex flex-wrap gap-1"
                    >
                        {
                            !!images?.length && images.map((link) => (
                                <div key={link} className="h-24 bg-white p-4 shadow-md rounded-sm border border-gray-200 ">
                                    <img src={link} className="rounded-lg "/>
                                </div>
                            ))
                        }
                    </ReactSortable>
                    {
                        isUploading && (
                            <div className="h-24 flex items-center">
                                <Spinner/>
                            </div>

                        )
                    }
                    <label className="w-24 h-24 flex flex-col text-sm gap-1 cursor-pointer text-center text-primary  items-center justify-center rounded-lg bg-white shadow-md border border-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        <div>
                            Add Images
                        </div>
                        <input
                            className="hidden"
                            type='file'
                            onChange={uploadImages}
                        />
                    </label>
                   
                </div>

                <label>Description</label>
                <textarea
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>

                <label>Price (in FCFA)</label>
                <input
                    type="number"
                    placeholder="0000"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />

                <button
                    className="btn-primary"
                    type="submit"
                >
                    Save
                </button>
            </form>
        </>
    )
}
import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import axios from "axios";
import { useState, useEffect } from "react";
import { styled } from "styled-components";

const CategoryHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    h1{
        font-size: 1.5rem;
    }
`

const FiltersWrapper = styled.div`
    display: flex;
    gap: 15px;
`

const Filter = styled.div`
    background-color: #ddd;
    padding: 5px 10px;
    border-radius: 5px;
    display: flex;
    gap: 5px;
    color: #444;
    select {
        background-color: transparent;
        border: 0;
        font-size: inherit;
        color: #444;

    }
`

export default function CategoryPage({
    category, 
    subCategories, 
    products: originalProducts
}) {

    const [products, setProducts] = useState(originalProducts)
    const [filtersValues, setFilterValues] = useState(category.properties.map(p=> ({name: p.name, value: "all"})))
    
    function handleFilterChange(filterName,filterValue) {
        setFilterValues(prev => {
            return prev.map(p=>({
                name: p.name,
                value: p.name === filterName ? filterName : p.value
            }))
        })
    }

    useEffect(() => {
        const catIds = [category._id, ...(subCategories?.map(c => c._id) || []) ];
        const params = new  URLSearchParams;
        params.set('categories', catIds.join(','))
        filtersValues.forEach(f => {
            if(f.value!== 'all') {
                params.set(f.name, f.value)
            }
        });
        const url = `/api/products?` + params.toString();

        axios.get(url).then( res => {
            setProducts(res.data)
        })
    }, [filtersValues])
    
    return (
        <>
            <Header/>
            <Center>
                <CategoryHeader>
                    <h1>{category.name}</h1>
                    <FiltersWrapper>
                        {category.properties.map((p, index) => (
                            <Filter key={index}>
                                <span>{p.name}</span>
                                <select 
                                    value={filtersValues.find(f => f.name === p.name).val}ue
                                    onChange={(e) => handleFilterChange(p.name, e.target.value) }
                                >
                                    <option valiue="all">All</option>
                                    {
                                        p.values.map((val, index) => (
                                            <option key={index} value={val}>{val}</option>
                                        ))
                                    }
                                </select>
                            </Filter>
                        ))}
                    </FiltersWrapper>
                </CategoryHeader>
                <ProductsGrid products={products}/>
            </Center>
        </>
    )
}

export async function getServerSideProps(context) {
    const category = await Category.findById(context.query.id);
    const subCategories= await Category.find({parent: category._id});
    const catIds = [category._id, ...subCategories.map(c => c._id)];
    const products = await Product.find({category: catIds});


    return {
        props: {
            category: JSON.parse(JSON.stringify(category)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
            products: JSON.parse(JSON.stringify(products))
        }
    }
}
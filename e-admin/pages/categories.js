import Layout from "@/components/layout"
import axios from "axios"
import { useEffect, useState } from "react"
import { withSwal } from "react-sweetalert2"

function Categories({ swal }) {

    const [editedCategory, setEditedCategory] = useState(null)
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [properties, setProperties] = useState([])
    const [parentCategory, setParentCategory] = useState('');


    useEffect(() => {
        fetchCategories()
    }, []);

    function fetchCategories() {
        axios.get('/api/categories').then(res => {
            setCategories(res.data);
        });
    }

    async function saveCategory(e) {
        e.preventDefault();
        const data = { 
            name, 
            parentCategory, 
            properties: properties.map((p => ({name: p.name, values: p.values.split(',')})))
        };

        if (editedCategory) {
            data._id = editedCategory._id
            await axios.put('/api/categories', data);
            setEditedCategory(null);
            setParentCategory('')
            setName('')
        } else {
            await axios.post('/api/categories', data)
        }

        setName('');
        setParentCategory('');
        setProperties([])
        fetchCategories()
    }

    function editCategory(category) {
        setEditedCategory(category);
        setName(category.name);
        setParentCategory(category.parent?._id)
        setProperties(category.properties.map(({name, values}) => ({
            name,
            values: values.join(',')
        })))
    }

    function deleteCategory(category) {
        swal.fire({
            title: "Are you sure ?",
            text: `Do you want to delete ${category.name}?`,
            showCancelButton: true,
            cancelButtontite: 'Cancel',
            confirmButtonText: 'Yes delete!',
            reverseButtons: true,
            confirmButtonColor: '#d55'
        }).then(async res => {
            if (res.isConfirmed) {
                const { _id } = category
                await axios.delete('/api/categories?_id=' + _id);
                fetchCategories();
            }
        })
    }

    function addProperty() {
        setProperties(prev => {
            return [...prev, { name: '', values: '' }];
        })
    }

    function hendlePropertyNameChange(index, property, newName) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].name = newName;
            return properties;
        })
    }

    function hendlePropertyValueChange(index, property, newValues) {
        setProperties(prev => {
            const properties = [...prev];
            properties[index].values = newValues;
            return properties;
        })
    }

    function removeProperty(indexToRemove) {
        setProperties(prev => {
            return [...prev].filter((p, pIndex) => {
                return pIndex !== indexToRemove
            })
        })
    }
    return (
        <Layout>
            <h1>Categories</h1>
            <label>{editedCategory ?
                `Edit category ${editedCategory.name}`
                :
                "New category name"}
            </label>
            <form onSubmit={saveCategory}>

                <div className="flex gap-1">
                    <input
                        onChange={e => setName(e.target.value)}

                        type="text"
                        placeholder={"Category name"}
                        value={name}
                    />
                    <select

                        value={parentCategory}
                        onChange={e => setParentCategory(e.target.value)}
                    >
                        <option value="">No parent category</option>
                        {
                            categories.length > 0 && categories.map((category) => (
                                <option value={category._id}>{category.name}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="mb-2">
                    <label className="block ">Properties</label>
                    <button
                        type="button"
                        className="btn-default py-0 text-sm mb-2"
                        onClick={addProperty}
                    >
                        Add new property
                    </button>
                    {
                        properties.length > 0 && properties.map((property, index) => (
                            <div className="flex gap-1 mb-2">
                                <input
                                    type="text"
                                    className="mb-0"
                                    value={property.name}
                                    placeholder="property name (example: color)"
                                    onChange={(e) => hendlePropertyNameChange(index, property, e.target.value)}
                                />
                                <input
                                    type="text"
                                    className="mb-0"
                                    value={property.values}
                                    placeholder="values, comma seperated"
                                    onChange={(e) => hendlePropertyValueChange(index, property, e.target.value)}
                                />
                                <button
                                    className="btn-default"
                                    onClick={() => removeProperty(index)}
                                    type="button"
                                >
                                    Remove
                                </button>
                            </div>

                        ))
                    }
                </div>
                <div className="flex gap-1">
                {
                    editedCategory && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null); 
                                setName('');
                                setParentCategory('')
                                setProperties([])
                            }}
                            className="btn-default py-1"
                        >
                            Cancel
                        </button>
                    )
                }


                <button

                    type="submit"
                    className="btn-primary py-1"
                >
                    Save
                </button>
                </div>
              

            </form>
            {
                !editedCategory && (
                    <table className="basic mt-4">
                        <thead>
                            <tr>
                                <td>Category name</td>
                                <td>Parent Category</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                categories.length > 0 && categories.map((category) => (
                                    <tr>
                                        <td>
                                            {category.name}
                                        </td>
                                        <td>
                                            {category?.parent?.name}
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => editCategory(category)}
                                                className="btn-default mr-1"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn-red"
                                                onClick={() => deleteCategory(category)}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
            }

        </Layout>
    )

}
export default withSwal(({ swal }, ref) => (
    <Categories swal={swal} />
));
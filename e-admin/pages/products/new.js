import Layout from "@/components/layout";
import ProductForm from "@/components/ProductForm";


export default function NewProduct() {

    return (
        <Layout>
            <h1 className="text-blue-900 mb-2">New Product</h1>
            <ProductForm />
        </Layout>
    )
}
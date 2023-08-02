import Featured from "@/components/Featured";
import Header from "@/components/Header";
import Newproduct from "@/components/NewProduct";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function Home({product}) {
  return (
    <>
        <Header/>
        <Featured product={product}/>
        <Newproduct/>
    </>
    )
}

export async function getServerSideProps() {
  const featuredProduct = '64c8c22d3a0652d18528767d';
  await mongooseConnect();
   const product = await Product.findById(featuredProduct)

   return{
    props: { product : JSON.parse(JSON.stringify(product))}
   }
}

import Featured from "@/components/Featured";
import Header from "@/components/Header";
import Newproduct from "@/components/NewProduct";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function Home({featuredProduct, Newproducts}) {
  return (
    <>
        <Header/>
        <Featured product={featuredProduct}/>
        <Newproduct products= {Newproducts}/>
    </>
    )
}

export async function getServerSideProps() {
  const featuredProductId = '64cab6120e3e6caae23413b3';
  await mongooseConnect();
  
  const featuredProduct = await Product.findById(featuredProductId)
  const NewProducts = await Product.find({}, null, {sort: {'_id' : -1}, limit: 10})
   return{
    props: { 
      featuredProduct : JSON.parse(JSON.stringify(featuredProduct)),
      NewProducts: JSON.parse(JSON.stringify(NewProducts))
  }
   }
}

import Link from "next/link";
import styled from "styled-components";
import Center from "./Center";
import { useContext } from "react";
import { CartContext } from "./CartContext";
import BarsIcon from "./icons/Bars";


const Stylesheader = styled.header`
    background-color: #222;
`;

const Logo = styled(Link)`
    color: #fff;
    text-decoration: none;
`;

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px 0;
`;

const StyledNav = styled.nav`
    display: block;
    gap: 15px;
    position: fixed;
    top:50px;
    @media screen and (min-width: 768px){
        display: flex;
    }
`;

const NavLink = styled(Link)`
    display: block;
    color: #aaa;
    text-decoration: none;
`;

const NavButton = styled.button`
   background-color: transparent;
   width: 30px;
   height: 30px;
   border: 0;
   color: white;
   cursor: pointer;
`;
export default function Header() {

    const {cartProducts} = useContext(CartContext)

    return (
        <Stylesheader>
            <Center>
                <Wrapper>
                    <Logo
                        href={'/'}
                    >
                        Ecommerce
                    </Logo>
                    <StyledNav>
                        <NavLink
                            href={'/'}
                        >
                            Home
                        </NavLink>
                        <NavLink
                            href={'/products'}
                        >
                            All products
                        </NavLink>
                        <NavLink
                            href={'/categories'}
                        >
                            Categories
                        </NavLink>
                        <NavLink
                            href={'/account'}
                        >
                            Account
                        </NavLink>
                        <NavLink
                            href={'/cart'}
                        >
                            Cart ({cartProducts.length})
                        </NavLink>
                    </StyledNav>
                    <NavButton>
                        <BarsIcon/>
                    </NavButton>
                </Wrapper>
            </Center>
        </Stylesheader>
    )
}
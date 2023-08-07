import { useState } from "react";
import styled from "styled-components"
const Image = styled.img`
    max-width: 100%;
    max-height: 100%;
`;
const BigImage = styled.img`
    max-width: 200px;
    max-height: 200px;
`;

const ImageButtons = styled.div`
    display: flex;
    gap: 10;
    flex-grow: 0;
    margin-top: 10px;
`;

const ImageButton = styled.div`
    border: 1px solid #ccc;
    margin: 2px;
    height: 40px;
    padding: 1px;
    cursor: pointer;
    border-radius: 5px;
    ${props => props.active ? `
            border-color: #ccc;
            `
            : 
            ` 
                border-color: transparent;
                opacity: .7
            `
    }
`;

const BigImageWrapper= styled.div`
    text-align: center;
`
export default function ProductImages({ images }) {

    const [activeImage, setActiveImage] = useState(images?.[0])
    return (
        <>
            <BigImageWrapper>
                <BigImage src={activeImage} alt="image" />
            </BigImageWrapper>
            <ImageButtons>
                {
                    images?.map((image, index) => (
                        <ImageButton 
                            key={index}
                            active={image === activeImage}
                            onClick={() => setActiveImage(image)}
                        >
                            <Image src={image} alt=''/>
                        </ImageButton>
                    )) 
                }
            </ImageButtons>
        </>
    )
}
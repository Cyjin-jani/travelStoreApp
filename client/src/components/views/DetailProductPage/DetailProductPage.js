import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';
import {Row, Col} from 'antd'

function DetailProductPage(props) {

    const productId = props.match.params.productId;

    const [Product, setProduct] = useState({});

    useEffect(() => {
        Axios.get(`/api/product/products_by_id?id=${productId}&type=single`)
        .then(response => {
            if(response.data.success) {
                // console.log('결과물', response.data);
                setProduct(response.data.product[0]);
            }else {
                alert('상세정보 가져오기 실패');
            }
        })
    }, [])


    return (
        <div style={{width: '100%', padding:'3rem 4rem'}}>
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <h1> {Product.title}</h1>
            </div>

            <br />


            <Row gutter={[16, 16]} >
                <Col lg={12} sm={24}>
                    {/* product Image */}
                    <ProductImage detail={Product} />

                </Col>
                <Col lg={12} sm={24}>
                    {/* Product Info  */}
                    <ProductInfo detail={Product} />
                </Col>
            </Row>



            



        </div>
    )
}

export default DetailProductPage

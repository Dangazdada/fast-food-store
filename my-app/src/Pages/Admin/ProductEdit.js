import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../Component/axiosClient";
import { baseURL } from "../Component/axiosClient";

const ProductEdit = () => {
    const navigate = useNavigate();

    var { id } = useParams();

    const [product, setProduct] =useState(null);
    const [productTypes, setProductType] =useState([]);
    const [files, setFiles] = useState(null);
    const [imageURL, setImageUR] = useState(null);
    const [typeName, setTypeName] = useState(null);
    const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked;
        setProduct(prev => ({ ...prev, [name]: value }));
    }
    useEffect(() =>{
        axiosClient.get(`/Products/${id}`)
             .then(res =>setProduct(res.data));
    },[]);
    useEffect(() =>{
        axiosClient.get(`/ProductTypes`)
             .then(res =>setProductType(res.data));
    },[]);
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setProduct(prev => ({ ...prev, [name]: value }));
    }
    const handleChangeSelect = (event) => {
        let selectedValue = event.target.value;
        let selectedName = event.target.options[event.target.selectedIndex].dataset.name;
        setTypeName(selectedName);
        // const selectedType = productTypes.find(type => type.id === selectedValue);
        setProduct(prev => ({ ...prev, productTypeId: selectedValue }));
        console.log('name',selectedName);
      };
      const handlePriceChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        // Kiểm tra xem giá trị nhập vào có phải là số nguyên dương không
        if (/^\d*$/.test(value)) {
            // Nếu là số nguyên dương cập nhật state
           
        setProduct(prev => ({ ...prev, [name]: value }));
        }
    };
 
    
      const handleFileChange = (e) => {
        const image = e.target.files;
        setFiles(image);
        if (image.length > 0) {
            console.log("File size:", image[0].size);
            console.log('File name', image[0].name);
            setFiles(image);
            // Sử dụng FileReader để đọc nội dung của file và chuyển đổi thành data URL
            const reader = new FileReader();
            // khi dữ liệu đã được đọc vào bộ nhớ(onload)  thì thực hiện lấy đường dẫn ảnh
            reader.onload = () => {
              console.log("FileReader result:", reader.result);
              //gán kết quả lấy được từ hàm reader cho imageURL
              setImageUR(reader.result);
            };
            // đọc và chuyển file thành dữ liệu url
            reader.readAsDataURL(image[0]);
          }
      };


    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        const imageId = product.images.id;
        const productData  = new FormData();
        productData.append("SKU", product.sku);
        productData.append("Name", product.name);
        productData.append("Description",product.description);
        productData.append("Price",product.price);
         productData.append("ProductTypeId",product.productTypeId);
         if(files === null)
         {
        productData.append("ImageFile", null);

         }
         else
         {
            productData.append("ImageFile", files[0]);
         }
        
        productData.append("Status", product.status);
        
        axiosClient.put(`/Products/${id}?imageId=${imageId}`, productData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(() => navigate('/admin/product'));
            productData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
              });
    }
    console.log('produtc', product)
   if(product == null )
   {
    return (<p>loading...</p>);
   }
   else{
    return ( 
        <>
            <div className=" form-container  align-items-center  mt-3">
                <h3 className="ml-3 ">Sửa thông tin sản phẩm</h3>
                <Form className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm:</Form.Label>
                        <Form.Control type="text" name="name" value={product.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control type="number" name="price" value={product.price} onChange={handlePriceChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mã sản phẩm:</Form.Label>
                        <Form.Control type="text" name="sku" value={product.sku} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                    <Form.Label>Sự lựa chọn:</Form.Label>
                        <Form.Select value={product.productTypeId} onChange={handleChangeSelect}>
                            <option value={product.productTypeId}>{typeName === null ? product.productType.name : typeName}</option>
                            {
                                productTypes.map((type) => (
                                    <option key={type.id} value={type.id} data-name ={type.name} >{type.name}</option>
                                ))
                            }
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Mô tả:</Form.Label>
                        <Form.Control as="textarea" name="description" value={product.description} onChange={handleChange} />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Ảnh </Form.Label>
                     </Form.Group>
                
                    {files === null? <img src={`${baseURL}/Images/${product.images.img}`} alt="" style={{width:"70px", marginBottom:"10px", marginTop:'-12px'}}/> : <img src={`${imageURL}`} alt="" style={{width:"50px"}}/>}
                     <Form.Group className="mb-3">
                        <Form.Label>Chọn ảnh :</Form.Label>
                        <Form.Control type="file" name="Images" multiple accept="image/*" onChange={handleFileChange} />
               
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check type="switch" label="Còn hoạt động" name="status" onChange={handleCheck} checked={product.status} />
                    </Form.Group>
                    <Button type="submit" variant="success" onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faCheck} /> Cập nhật
                    </Button>
                </Form>
            </div>
            
        </> );
   }
    
}
 
export default ProductEdit;
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { baseURL } from "../Component/axiosClient";
import axiosClient from "../Component/axiosClient";

const ComboEdit = () => {
    const navigate = useNavigate();

    var { id } = useParams();

    const [combo, setCombo] =useState(null);
    const [productTypes, setProductType] =useState([]);
    const [files, setFiles] = useState(null);
    const [imageURL, setImageUR] = useState(null);
    
    useEffect(() =>{
        const url = `/Comboes/${id}?productTypeId=6`
        console.log('url',url)
        axiosClient.get(url)
             .then(res =>setCombo(res.data));
    },[id]);
    useEffect(() =>{
        axiosClient.get(`/ProductTypes`)
             .then(res =>setProductType(res.data));
    },[]);
    const handleChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setCombo(prev => ({ ...prev, [name]: value }));
    };
    const handlePriceChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        // Kiểm tra xem giá trị nhập vào có phải là số nguyên dương không
        if (/^\d*$/.test(value)) {
            // Nếu là số nguyên dương cập nhật state
           
        setCombo(prev => ({ ...prev, [name]: value }));
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
      const handleCheck = (e) => {
        let name = e.target.name;
        let value = e.target.checked;
        setCombo(prev => ({ ...prev, [name]: value }));
    }
 


    const handleSubmit = (e) => {
        e.preventDefault();
        const imgaeId = combo.images.id;
        const  comboData = new FormData();
        comboData.append("ProductTypeId", 6);
        comboData.append("Name", combo.name);
        if(files === null)
        {
        comboData.append("ImageFile", null); 

        }
        else
        {
        comboData.append("ImageFile", files[0]); 
        }
        comboData.append("Price", combo.price);
        comboData.append("Status", combo.status);
        const token = localStorage.getItem('token');
        axiosClient.put(`/Comboes/${id}?imgaeId=${imgaeId}`, comboData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(() => navigate('/admin/combo'));
            comboData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
              });
    }
    console.log('combo',combo);
    console.log('id',id);
    console.log('urlimage', imageURL)
  
        if(combo === null)
        {  return ( 
            <p>loading...</p>
        );
        }
        else
        {   return ( 
            <>
        
            <div className=" form-container  align-items-center  mt-3">
                <h3 className="ml-3 ">Sửa thông tin sản phẩm</h3>
                <Form className="col-md-6">
                    <Form.Group className="mb-3">
                        <Form.Label>Tên sản phẩm:</Form.Label>
                        <Form.Control type="text" name="name" value={combo.name} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Giá</Form.Label>
                        <Form.Control type="number" name="price" value={combo.price} onChange={handlePriceChange} />
                    </Form.Group>
                   
                    <Form.Group className="mb-3">
                        <Form.Label>Ảnh cũ</Form.Label>
                    </Form.Group>
                    
                    {files === null? <img src={`${baseURL}/Images/${combo.images.img}`} alt="" style={{width:"70px", marginBottom:"10px", marginTop:'-12px'}}/> : <img src={`${imageURL}`} alt="" style={{width:"50px"}}/>}
                    <Form.Group className="mb-3">
                        <Form.Label>Chọn ảnh :</Form.Label>
                        <Form.Control type="file" name="Images" multiple accept="image/*" onChange={handleFileChange} />
                       
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Check type="switch" label="Còn hoạt động" name="status" onChange={handleCheck} checked={combo.status} />
                    </Form.Group>
                    <Button type="submit" variant="success" onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faCheck} /> Cập nhật
                    </Button>
                </Form>
            </div>
           
            
        </>
        );
        }
      

}
 
export default ComboEdit;
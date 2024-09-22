import { faCheck, faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../Component/axiosClient";
const ComBoAdd = () => {
    const navigate = useNavigate();

 
   const [Name, setName] = useState('');
   const [Price, setPrice] = useState(0);
   const [Status, setStatus] = useState(true);
   const [files, setFiles] = useState([]);
   const [fileError, setFileError] = useState('');
 
   
     const handleFileChange = (e) => {
       const image = e.target.files;
       setFiles(image);
       if (image.length > 0) {
           console.log("File size:", image[0].size);
           setFiles(image);
       }
     };

     const handlePriceChange = (e) => {
      const inputPrice = e.target.value;
      // Kiểm tra xem giá trị nhập vào có phải là số nguyên dương không
      if (/^\d*$/.test(inputPrice) || inputPrice === '') {
          // Nếu là số nguyên dương hoặc rỗng, cập nhật state
          setPrice(inputPrice);
      }
  };
    
   const handleCheck = (e) => {
       let value = e.target.checked;
       setStatus(value);
   }
 
   const handleSubmit =  (e) => {
     e.preventDefault();
    if(files === undefined || files.length <= 0)
    {
      setFileError("Vui lòng chọn ít nhất một tập tin.");
            return;
    }
    else
    {
      const token = localStorage.getItem('token');
     const comboData = new FormData();
     comboData.append("ProductTypeId", 6);
     comboData.append("Name", Name);
     comboData.append("ImageFile", files[0]); // Assuming only one file is selected
     comboData.append("Price", Price);
     comboData.append("Status", Status);

     axiosClient.post(`/Comboes`, comboData, {
       headers: {
           'Authorization': `Bearer ${token}`,
           'Content-Type': 'multipart/form-data',
       }
   })
   .then(() => navigate('/admin/combo'))
   .catch(error => console.error("Lỗi khi thêm sản phẩm: ", error));
   comboData.forEach((value, key) => {
     console.log(`${key}: ${value}`);
    });
    };

     };
     console.log(('file',files));
     console.log('length', files.length);
    
   return ( 
   <>
           <div className="form-container align-items-center mt-3">
           <h3 className="ml-3">Thêm Combo</h3>
           <Form className="col-md-6" encType="multipart/form-data">
               
               <Form.Group className="mb-3">
                   <Form.Label>Tên Combo:</Form.Label>
                   <Form.Control type="text" name="Name" value={Name} onChange={(e) => {setName(e.target.value)}} />
               </Form.Group>
               <Form.Group className="mb-3">
                   <Form.Label>Giá</Form.Label>
                   <Form.Control type="number" name="Price" value={Price} onChange={handlePriceChange} />
               </Form.Group>
              
               <Form.Group className="mb-3">
                   <Form.Label>Ảnh đại diện:</Form.Label>
                   <Form.Control type="file" name="Images" multiple accept="image/*" onChange={handleFileChange} />
                   {fileError && <Alert variant="danger">{fileError}</Alert>}
               </Form.Group>
               <Form.Group className="mb-3">
                   <Form.Check type="switch" label="Còn hoạt động" name="Status" onChange={handleCheck} checked={Status} />
               </Form.Group>
               <Button type="submit" variant="success" onClick={handleSubmit}>
                   <FontAwesomeIcon icon={faCheck} /> Cập nhật
               </Button>
           </Form>
       </div>

       </>
    );
}
 
export default ComBoAdd;
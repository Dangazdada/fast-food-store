import { useEffect,useState } from "react";
import axiosClient from "../Component/axiosClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form } from "react-bootstrap";
import {   useNavigate, useParams } from "react-router-dom";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const InvoiceEdit = () => {
    const navigate =  useNavigate();
    var { id } = useParams();

    const [invoice, setInvoice] = useState(null);
    const [orderStatus, setOrderStatus] = useState([]);
    const [status, setStatus] = useState(null);
    useEffect(() =>{
        axiosClient.get(`/Invoices/${id}`)
             .then(res =>setInvoice(res.data));
    },[]);
    useEffect(() =>{
        axiosClient.get(`/OrderStatus`)
             .then(res =>setOrderStatus(res.data));
    },[]);

    const handleChangeSelect = (event) => {
        let selectedValue = event.target.value;
        let selectedName = event.target.options[event.target.selectedIndex].dataset.name;
        setStatus(selectedName);
        // const selectedType = productTypes.find(type => type.id === selectedValue);
        setInvoice(prev => ({ ...prev, orderStatusId: selectedValue }));
        console.log('name',selectedName);
      };
      const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

       
        axiosClient.put(`/Invoices/${id}?orderStatus=${invoice.orderStatusId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
        })
            .then(() => navigate('/admin/invoice'));
            
    }

    console.log('invoice',invoice)
    if( invoice === null)
    {
        return (<p>loading ...</p>)
    }
    else
    {
        return ( <>
            <div className=" form-container  align-items-center  mt-3">
                <h3 className="ml-3 ">Sửa thông hóa đơn</h3>
                <Form className="col-md-6">
                    
                    <Form.Group className="mb-3">
                    <Form.Label>Sự lựa chọn:</Form.Label>
                        <Form.Select value={invoice.orderStatusId} onChange={handleChangeSelect}>
                            <option value={invoice.orderStatusId}>{status === null ? invoice.orderStatus.name : status}</option>
                            {
                                orderStatus.map((type) => (
                                    <option key={type.id} value={type.id} data-name ={type.name} >{type.name}</option>
                                ))
                            }
                        </Form.Select>
                        </Form.Group>
                  
                   
                    <Button type="submit" variant="success" onClick={handleSubmit}>
                        <FontAwesomeIcon icon={faCheck} /> Cập nhật
                    </Button>
                </Form>
            </div>
            
        </>  );
    }
    
}
 
export default InvoiceEdit;
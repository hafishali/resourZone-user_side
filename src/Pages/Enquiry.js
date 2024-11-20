import React, { useEffect, useState } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPhone, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faXTwitter } from '@fortawesome/free-brands-svg-icons';
import { Link, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Enquiry.css';
import enquiry from '../images/enquiry.jpeg';
import { Registerenquiry } from '../services/allApi';

function Enquiry() {
  const [email, setEmail] = useState('');
  const [First_Name, setFirstName] = useState('');
  const [Last_Name, setLastName] = useState('');
  const [Phone_number, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data with correct field names
    const enquiryData = {
      First_Name,
      Last_Name,
      Phone_number,
      email,
      message,
    };
    
    try {
      const response = await Registerenquiry(enquiryData);
      if (response.status === 201) {
        toast.success("Enquiry submitted successfully!");
        // Clear form fields after successful submission
        setFirstName('');
        setLastName('');
        setPhone('');
        setEmail('');
        setMessage('');
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      toast.error("Failed to submit enquiry. Please try again.");
    }
  };

  return (
    <div className="enquiry-container">
      <ToastContainer />
      <Row>
        <Col md={4} className="image-col">
          <div className="image-bg">
            <img 
              src={enquiry}
              alt="Enquiry" 
              className="img-fluid enquiry-image"
            />
            <div className="overlay-content">
            <p className="image-description">
   Reach out to learn more about our offerings and discover how we can assist you with Qatar's latest developments and opportunities.
</p>
              <div className="social-icons">
               <Link to="https://www.linkedin.com/company/resource-zone/"> <FontAwesomeIcon icon={faLinkedin} className="social-icon" /></Link>
                <FontAwesomeIcon icon={faFacebook} className="social-icon" />
<Link to="https://www.instagram.com/resourzone?igsh=MTNqZGQ3dHc2MDN4OA==">
                  <FontAwesomeIcon icon={faInstagram} className="social-icon" />
  
</Link>                <FontAwesomeIcon icon={faXTwitter} className="social-icon" />
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column for Enquiry Form */}
        <Col md={8} className="enquiry-form-container">
          <p className='enquiryhead'>Interact With Our Team</p>
          <p className='enquirysubhead'>Get personalized advice and responses to your questions</p>
          <Form className='forme' onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formName" className="input-with-icon">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <Form.Control 
                    type="text" 
                    placeholder="First name" 
                    className="icon-input"
                    value={First_Name}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName" className="input-with-icon">
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                  <Form.Control 
                    type="text" 
                    placeholder="Last name" 
                    className="icon-input"
                    value={Last_Name}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formPhone" className="input-with-icon mt-3">
              <FontAwesomeIcon icon={faPhone} className="input-icon" />
              <Form.Control 
                type="tel" 
                placeholder="Phone number" 
                className="icon-input"
                value={Phone_number}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formEmail" className="input-with-icon mt-3">
              <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
              <Form.Control
                type="email"
                placeholder="Email"
                className="icon-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formMessage" className="input-with-icon mt-3">
              <Form.Control 
                as="textarea" 
                rows={4} 
                placeholder="Your Message" 
                className="icon-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </Form.Group>

            <button type="submit" className="mt-4 enquirybutton">
              Submit
            </button>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default Enquiry;

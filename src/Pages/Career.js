import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Career.css';
import { Card, Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { getAlljobs } from '../services/allApi';
import { Commet } from 'react-loading-indicators';
import Application from './Application';

function Career() {
  const [jobData, setJobData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCards, setVisibleCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAlljobs();
        console.log("Fetched jobs:", response);
  
        const sortedJobs = (response.jobs || response || []).sort((a, b) => 
          (a.jobRole || "").localeCompare(b.jobRole || "", undefined, { sensitivity: 'base' })
        );
  
        setJobData(sortedJobs);
        setVisibleCards(new Array(sortedJobs.length).fill(false));
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchJobs();
  }, []);

  const [showModal, setShowModal] = useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.indexOf(entry.target);
          if (index !== -1 && !visibleCards[index]) {
            setVisibleCards((prev) => {
              const updated = [...prev];
              updated[index] = true;
              return updated;
            });
            observer.unobserve(entry.target);
          }
        }
      });
    }, { threshold: 0.1 });

    const currentRefs = cardRefs.current;
    currentRefs.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      currentRefs.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, [jobData, visibleCards]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredJobs = jobData.filter((job) => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      job.jobRole?.toLowerCase().includes(searchTermLower) ||
      job.reqId?.toLowerCase().includes(searchTermLower) ||
      job.country?.toLowerCase().includes(searchTermLower) ||
      job.location?.toLowerCase().includes(searchTermLower) ||
      (job.deadline_date && formatDate(job.deadline_date).toLowerCase().includes(searchTermLower))
    );
  });
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Commet color="#22CC9D" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="career-page">
      <div className="career-header">
        <motion.p className='careerheading'>
          Explore Exciting Career <br /> Opportunities with Us
        </motion.p>

      </div>

      <Container fluid className="card-section">
        <Row className="g-3 careercards">
          <Row>
            <Col>
            
              <p className='cardsecondhead'>
                <motion.span>Open Positions</motion.span>
              </p>
            </Col>
            <Col xs={12} md={6} className="mt-3 mt-md-0">
              <Container className="search-bar">
                <InputGroup className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Search ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      borderRadius: '8px',
                      padding: '10px 20px',
                      fontSize: '1rem',
                    }}
                  />
                </InputGroup>
              </Container>
            </Col>
          </Row>

          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <Col md={6} sm={12} key={job._id || index} ref={el => cardRefs.current[index] = el}>
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  animate={{ opacity: visibleCards[index] ? 1 : 0, x: visibleCards[index] ? 0 : (index % 2 === 0 ? -100 : 100) }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className="career-card"
                    style={{
                      opacity: job.status ? 0.5 : 1,
                      filter: job.status ? 'grayscale(70%)' : 'none',
                    }}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <p className='job'>{job.jobRole || "N/A"}</p>
                        {job.status && <span className="expired-badge">Expired</span>}
                        <button onClick={openModal} className='careerbutton'>Apply Now</button>
                      </div>
                      <div className="job-details">
                        <Row className="job-detail-headers g-1">
                          <Col>Req ID</Col>
                          <Col>Country</Col>
                          <Col>Location</Col>
                          <Col>Deadline</Col>
                        </Row>
                        <Row className="job-detail-values g-1">
                          <Col>{job.reqId || "N/A"}</Col>
                          <Col>{job.country || "N/A"}</Col>
                          <Col>{job.location || "N/A"}</Col>
                          <Col>{formatDate(job.deadline_date) || "N/A"}</Col>
                        </Row>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))
          ) : (
            <p className="no-results">No job positions match your search criteria.</p>
          )}
        </Row>
      </Container>
      <Application show={showModal} onClose={closeModal} />
    </div>
  );
}

export default Career;

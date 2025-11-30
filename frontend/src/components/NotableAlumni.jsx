import { useState, useEffect } from 'react';
import './NotableAlumni.css';

const notableAlumni = [
  {
    id: 1,
    name: "Rajnish Kumar",
    company: "Media Monk Sr. Director",
    image: "https://media.licdn.com/dms/image/v2/C5103AQGsLd9vQR4cyg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1570002463795?e=1757548800&v=beta&t=sT7eNjJ_oFnMJ4HdDab2uxZzyv2ezQlYJgCFvzRIJak",
    linkedin: "https://www.linkedin.com/in/rajnishk2310"
  },
  {
    id: 2,
    name: "Niraj Singh",
    company: "Samsung SDS",
    image: "https://media.licdn.com/dms/image/v2/D5635AQHxBK5f-o5GgQ/profile-framedphoto-shrink_200_200/profile-framedphoto-shrink_200_200/0/1733776604073?e=1750557600&v=beta&t=-u2trXTsEQDQd05hyE018pluhxz8Ti30JzZpbSbvGxM",
    linkedin: "https://www.linkedin.com/in/niraj-ivar"
  }
];

const NotableAlumni = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === notableAlumni.length - 1 ? 0 : prevIndex + 1
      );
      setIsTransitioning(false);
    }, 300);
  };

  const handleDotClick = (index) => {
    if (index !== currentIndex) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex(index);
        setIsTransitioning(false);
      }, 300);
    }
  };

  const currentAlumni = notableAlumni[currentIndex];

  return (
    <div className="notable-alumni-section">
      <div className="notable-alumni-container">
        <h2 className="section-title">Notable Alumni</h2>
        <p className="section-subtitle">
          Celebrating the success stories of our distinguished alumni
        </p>

        <div className="alumni-carousel">
          <div className={`alumni-card ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
            <div className="alumni-image-wrapper">
              <img
                src={currentAlumni.image}
                alt={currentAlumni.name}
                className="alumni-image"
              />
            </div>

            <div className="alumni-info">
              <h3 className="alumni-name">{currentAlumni.name}</h3>
              <p className="alumni-company">{currentAlumni.company}</p>
              
              <a
                href={currentAlumni.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="linkedin-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="linkedin-icon"
                >
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                View LinkedIn Profile
              </a>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="carousel-dots">
            {notableAlumni.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => handleDotClick(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotableAlumni;

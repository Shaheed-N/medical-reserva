import React from 'react';
import { IonPage, IonContent, IonSearchbar } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Button, Card } from '@/components/ui';
import './Home.css';

const featuredSpecialties = [
    { icon: '🩺', name: 'Primary Care', slug: 'primary-care' },
    { icon: '🦷', name: 'Dentistry', slug: 'dentistry' },
    { icon: '👁️', name: 'Ophthalmology', slug: 'ophthalmology' },
    { icon: '❤️', name: 'Cardiology', slug: 'cardiology' },
    { icon: '🧠', name: 'Neurology', slug: 'neurology' },
    { icon: '🦴', name: 'Orthopedics', slug: 'orthopedics' },
    { icon: '👶', name: 'Pediatrics', slug: 'pediatrics' },
    { icon: '🩻', name: 'Radiology', slug: 'radiology' },
];

const featuredHospitals = [
    {
        id: '1',
        name: 'City Medical Center',
        type: 'General Hospital',
        rating: 4.8,
        reviewCount: 2340,
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400',
        address: 'Downtown, Medical District',
    },
    {
        id: '2',
        name: 'HealthFirst Clinic',
        type: 'Multi-Specialty Clinic',
        rating: 4.6,
        reviewCount: 1890,
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400',
        address: 'Westside, Health Avenue',
    },
    {
        id: '3',
        name: 'Premier Dental Care',
        type: 'Dental Clinic',
        rating: 4.9,
        reviewCount: 856,
        image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400',
        address: 'Northgate, Smile Street',
    },
];

const Home: React.FC = () => {
    const history = useHistory();
    const [searchQuery, setSearchQuery] = React.useState('');

    const handleSearch = () => {
        if (searchQuery.trim()) {
            history.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <IonPage>
            <IonContent className="home-content">
                {/* Hero Section */}
                <section className="hero-section">
                    <div className="hero-bg" />
                    <div className="hero-content">
                        <h1 className="hero-title">
                            Find and Book
                            <span className="hero-title-gradient"> Medical Care </span>
                            Instantly
                        </h1>
                        <p className="hero-subtitle">
                            Connect with top-rated doctors and hospitals. Book appointments in seconds.
                        </p>

                        <div className="search-container glass-card">
                            <IonSearchbar
                                className="hero-search"
                                placeholder="Search doctors, specialties, or hospitals..."
                                value={searchQuery}
                                onIonInput={(e) => setSearchQuery(e.detail.value || '')}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button variant="primary" size="lg" onClick={handleSearch}>
                                Search
                            </Button>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-value">500+</span>
                                <span className="stat-label">Hospitals</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">10,000+</span>
                                <span className="stat-label">Doctors</span>
                            </div>
                            <div className="stat-divider" />
                            <div className="stat-item">
                                <span className="stat-value">1M+</span>
                                <span className="stat-label">Patients</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Specialties Section */}
                <section className="section specialties-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Popular Specialties</h2>
                            <a href="/specialties" className="see-all-link">
                                See all →
                            </a>
                        </div>

                        <div className="specialties-grid">
                            {featuredSpecialties.map((specialty) => (
                                <a
                                    key={specialty.slug}
                                    href={`/search?specialty=${specialty.slug}`}
                                    className="specialty-card"
                                >
                                    <span className="specialty-icon">{specialty.icon}</span>
                                    <span className="specialty-name">{specialty.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Hospitals Section */}
                <section className="section hospitals-section">
                    <div className="container">
                        <div className="section-header">
                            <h2 className="section-title">Top-Rated Hospitals</h2>
                            <a href="/hospitals" className="see-all-link">
                                See all →
                            </a>
                        </div>

                        <div className="hospitals-grid">
                            {featuredHospitals.map((hospital) => (
                                <Card key={hospital.id} variant="elevated" padding="none" hoverable className="hospital-card">
                                    <div className="hospital-image">
                                        <img src={hospital.image} alt={hospital.name} loading="lazy" />
                                    </div>
                                    <div className="hospital-info">
                                        <span className="hospital-type">{hospital.type}</span>
                                        <h3 className="hospital-name">{hospital.name}</h3>
                                        <p className="hospital-address">{hospital.address}</p>
                                        <div className="hospital-rating">
                                            <span className="rating-star">⭐</span>
                                            <span className="rating-value">{hospital.rating}</span>
                                            <span className="rating-count">({hospital.reviewCount.toLocaleString()} reviews)</span>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="section cta-section">
                    <div className="container">
                        <Card variant="glass" padding="lg" className="cta-card">
                            <div className="cta-content">
                                <h2 className="cta-title">Are you a healthcare provider?</h2>
                                <p className="cta-description">
                                    Join MedPlus to reach thousands of patients and manage your practice efficiently.
                                </p>
                                <div className="cta-buttons">
                                    <Button variant="primary" size="lg">
                                        Register Your Practice
                                    </Button>
                                    <Button variant="secondary" size="lg">
                                        Learn More
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </section>

                {/* Footer */}
                <footer className="footer">
                    <div className="container">
                        <div className="footer-content">
                            <div className="footer-brand">
                                <span className="footer-logo">🏥</span>
                                <span className="footer-name">MedPlus</span>
                            </div>
                            <p className="footer-copyright">
                                © 2026 MedPlus. All rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </IonContent>
        </IonPage>
    );
};

export default Home;

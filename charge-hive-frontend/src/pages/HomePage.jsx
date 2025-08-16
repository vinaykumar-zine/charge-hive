import React from "react";
import { FaChargingStation, FaMapMarkedAlt, FaChartLine, FaUsers, FaShieldAlt, FaMobileAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HomePage() {
    const features = [
        {
            icon: <FaChargingStation className="text-4xl text-green-500" />,
            title: "Smart Station Management",
            description: "Efficiently manage and monitor all your EV charging stations from a centralized dashboard."
        },
        {
            icon: <FaMapMarkedAlt className="text-4xl text-green-500" />,
            title: "Real-time Location Tracking",
            description: "Track station locations and status in real-time with interactive maps and GPS integration."
        },
        {
            icon: <FaChartLine className="text-4xl text-green-500" />,
            title: "Advanced Analytics",
            description: "Comprehensive analytics and reporting to optimize your charging network performance."
        },
        {
            icon: <FaUsers className="text-4xl text-green-500" />,
            title: "User Management",
            description: "Manage user accounts, bookings, and access control with ease."
        },
        {
            icon: <FaShieldAlt className="text-4xl text-green-500" />,
            title: "Secure & Reliable",
            description: "Enterprise-grade security with 24/7 monitoring and backup systems."
        },
        {
            icon: <FaMobileAlt className="text-4xl text-green-500" />,
            title: "Mobile Responsive",
            description: "Access your dashboard from any device with our mobile-optimized interface."
        }
    ];

    const stats = [
        { number: "500+", label: "Charging Stations" },
        { number: "10K+", label: "Happy Users" },
        { number: "99.9%", label: "Uptime" },
        { number: "24/7", label: "Support" }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-900 via-green-700 to-lime-500 text-white py-20">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            EV Charging Station
                            <span className="block text-lime-200">Management System</span>
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 text-lime-100 max-w-3xl mx-auto">
                            Streamline your electric vehicle charging network with our comprehensive management platform.
                            Monitor, manage, and optimize your stations with real-time insights.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-lime-500 hover:bg-lime-400 text-green-900 font-bold py-3 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                                Get Started
                            </button>
                            <button className="border-2 border-lime-300 hover:bg-lime-300 hover:text-green-900 text-lime-300 font-bold py-3 px-8 rounded-full transition duration-300">
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
                                    {stat.number}
                                </div>
                                <div className="text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
                            Powerful Features for Modern EV Management
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Our platform provides everything you need to efficiently manage your electric vehicle charging network.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
                                <div className="text-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 text-center">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-700 to-green-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">
                        Ready to Transform Your EV Charging Network?
                    </h2>
                    <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
                        Join thousands of businesses already using our platform to manage their EV charging infrastructure.
                    </p>
                    <button className="bg-lime-500 hover:bg-lime-400 text-green-900 font-bold py-4 px-8 rounded-full transition duration-300 transform hover:scale-105 shadow-lg">
                        Start Your Free Trial
                    </button>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default HomePage;

// data.js
import {
    FaMobileAlt,
    FaLaptop,
    FaHeadphones,
    FaCamera,
    FaGamepad,
    FaWatchmanMonitoring,
    FaHome,
    FaMicrochip,
    FaNetworkWired,
  } from "react-icons/fa";
  import { FaMobileScreenButton } from "react-icons/fa6";
  
  export const categories = [
    {
      name: "Smartphones & Accessories",
      icon: <FaMobileScreenButton className="w-6 h-6" />,
      subcategories: [
        "Smartphones",
        "Phone Cases",
        "Screen Protectors",
        "Chargers & Cables",
        "Power Banks",
      ],
    },
    {
      name: "Laptops & Computers",
      icon: <FaLaptop className="w-6 h-6" />,
      subcategories: [
        "Laptops",
        "Desktops",
        "Monitors",
        "Keyboards & Mice",
        "Printers & Scanners",
      ],
    },
    {
      name: "Audio & Headphones",
      icon: <FaHeadphones className="w-6 h-6" />,
      subcategories: [
        "Headphones",
        "Earbuds",
        "Speakers",
        "Microphones",
        "Soundbars",
      ],
    },
    {
      name: "Cameras & Photography",
      icon: <FaCamera className="w-6 h-6" />,
      subcategories: [
        "DSLR Cameras",
        "Mirrorless Cameras",
        "Action Cameras",
        "Camera Lenses",
        "Tripods & Accessories",
      ],
    },
    {
      name: "Gaming",
      icon: <FaGamepad className="w-6 h-6" />,
      subcategories: [
        "Gaming Consoles",
        "Gaming Laptops",
        "Gaming Accessories",
        "VR Headsets",
        "Gaming Chairs",
      ],
    },
    {
      name: "Wearable Technology",
      icon: <FaWatchmanMonitoring className="w-6 h-6" />,
      subcategories: [
        "Smartwatches",
        "Fitness Trackers",
        "Smart Glasses",
        "VR Headsets",
        "Wearable Cameras",
      ],
    },
    {
      name: "Home Electronics",
      icon: <FaHome className="w-6 h-6" />,
      subcategories: [
        "Smart Home Devices",
        "Televisions",
        "Streaming Devices",
        "Home Theater Systems",
        "Robot Vacuums",
      ],
    },
    {
      name: "Computer Components",
      icon: <FaMicrochip className="w-6 h-6" />,
      subcategories: [
        "Processors (CPUs)",
        "Graphics Cards (GPUs)",
        "Motherboards",
        "RAM",
        "Storage (SSD & HDD)",
      ],
    },
    {
      name: "Networking",
      icon: <FaNetworkWired className="w-6 h-6" />,
      subcategories: [
        "Routers",
        "Modems",
        "Network Switches",
        "Wi-Fi Extenders",
        "Network Cables",
      ],
    },
  ];
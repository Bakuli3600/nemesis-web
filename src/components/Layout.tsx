import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import CardNav from './CardNav';
import TargetCursor from './TargetCursor';
import logo from '../assets/logo.png';

export default function Layout() {
  const navItems = [
    {
      label: "SYSTEM",
      accentColor: "#f3d36b",
      bgColor: "rgba(243, 211, 107, 0.05)",
      textColor: "#fff",
      links: [
        { label: "Command", href: "/dashboard", ariaLabel: "Strategic Oversight Hub" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col relative selection:bg-[#f3d36b] selection:text-black">
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      
      {/* React-style Background Glows */}
      <div className="bg-glow-blue" />
      <div className="bg-glow-gold" />
      
      <CardNav 
        logo={logo} 
        items={navItems}
        buttonBgColor="#f3d36b"
        buttonTextColor="#000"
      />
      
      <main className="flex-1 p-4 md:p-8 relative flex flex-col max-w-[1600px] mx-auto w-full">
        <div className="flex-1 mt-24">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}

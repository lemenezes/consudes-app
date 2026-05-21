import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './Header';

import Footer from './Footer';
import ScrollToTop from './ui/ScrollToTop';
import AnalyticsTracker from './AnalyticsTracker';
import ClarityTracker from './ClarityTracker';

function RouteChangeScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0d1624] transition-colors duration-200">
      <RouteChangeScrollToTop />
      <AnalyticsTracker />
      <ClarityTracker />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <ScrollToTop />
      <Footer />
    </div>
  );
}

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { toggleSidebar } from "@/redux/slices/appSlice";
import { usePathname } from "next/navigation";
import Layout from "@/components/Layout";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchLeadStatuses } from "@/redux/slices/leadStatusSlice";
import PremiumLoader from "@/components/ui/PremiumLoader";
import Loader from "@/components/Loader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-poppins",
});

export default function App({ Component, pageProps, router }: AppProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <AppContent Component={Component} pageProps={pageProps} router={router} />
      </Provider>
    </QueryClientProvider>
  );
}

function AppContent({ Component, pageProps }: AppProps) {
  const globalLoading = useAppSelector((state) => state.app.globalLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathName = usePathname();
  const isLoginPage = pathName === "/login" || pathName === "/register";
  const is404Page = router.pathname === "/404";
  const hideLayout = isLoginPage || is404Page;
  const leadStatusStatus = useAppSelector((state) => state.leadStatus.status);
  const hasDispatched = useRef(false);

  useEffect(() => {
    if (!isLoginPage && !hasDispatched.current) {
      hasDispatched.current = true;
      if (leadStatusStatus === 'idle') dispatch(fetchLeadStatuses());
    }
  }, [leadStatusStatus, dispatch, isLoginPage]);

  const [mounted, setMounted] = useState(false);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      setShowInitialLoader(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Page transition loader state
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsNavigating(true);
    const handleComplete = () => setIsNavigating(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const getLabel = () => {
    if (pathName === "/") return "Dashboard";
    if (pathName === "/leads") return "Leads";
    if (pathName === "/leads/list") return "Leads List";
    if (pathName === "/leads/kanban") return "Leads Kanban";
    if (pathName === "/setup") return "Setup";
    if (pathName === "/tasks") return "Tasks";
    return "";
  };

  return (
    <div className={`${poppins.variable} ${poppins.className}`}>
      {showInitialLoader && <Loader />}
      <div className="flex flex-col min-h-screen bg-white">
        <div className={`flex-1 min-w-0 ${mounted ? 'transition-all duration-300 ease-in-out' : ''}`}>
          <main className="animate-in fade-in duration-300">
            {!hideLayout ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </main>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}


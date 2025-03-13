// app/clicker/page.tsx

"use client";

import React, { ReactNode, useCallback, useEffect, useState } from "react";
import Mine from "@/components/Mine";
import Friends from "@/components/Friends";
import Quests from "@/components/Quests";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/Loading";
import Upgrades from "@/components/Upgrades";
import Settings from "@/components/Settings";
import MyJOK from "@/components/MyJOK";
import Shop from "@/components/Shop";
import Boost from "@/components/Boost";
import AutoIncrementYieldPerHour from "@/components/UpgradeYieldPerHour";
import DailyRewards from "@/components/DailyRewards";
import Profile from "@/components/Profile";
import AirdropPage from "@/components/AirdropPage";
import Giveaway from "@/components/Giveaway";
import { CheckTokenHoldings } from "@/components/CheckTokenHoldings";
import { Intro1 } from "@/components/Intro1";
import { Intro2 } from "@/components/Intro2";

function ClickerPage() {
  const [currentView, setCurrentViewState] = useState<string>("loading");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initWebApp = async () => {
      if (typeof window !== "undefined") {
        try {
          const WebApp = (await import("@twa-dev/sdk")).default;
          WebApp.ready();
          WebApp.setBottomBarColor("#1d2025");
          WebApp.setHeaderColor("#000000");
          WebApp.disableVerticalSwipes();
          WebApp.requestFullscreen();
          WebApp.expand();
          WebApp.enableClosingConfirmation();
        } catch (error) {
          console.error("Error initializing TG Webapp:", error);
        }
      }
    };

    initWebApp();
  }, []);

  const setCurrentView = (newView: string) => {
    setCurrentViewState(newView);
  };

  const renderCurrentView = useCallback(() => {
    if (!isInitialized) {
      return (
        <LoadingScreen
          setIsInitialized={setIsInitialized}
          setCurrentView={setCurrentView}
        />
      );
    }

    switch (currentView) {
      case "intro1":
        return (
          <Intro1 currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "intro2":
        return (
          <Intro2 currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "myjok":
        return (
          <MyJOK currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "upgrades":
        return (
          <Upgrades currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "boost":
        return (
          <Boost currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "settings":
        return <Settings setCurrentView={setCurrentView} />;
      case "mine":
        return <Mine setCurrentView={setCurrentView} />;
      case "friends":
        return <Friends />;
      case "quests":
        return (
          <Quests currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "shop":
        return (
          <Shop currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "reward":
        return (
          <DailyRewards
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        );
      case "profile":
        return (
          <Profile currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "giveaway":
        return (
          <Giveaway currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "airdrop":
        return (
          <AirdropPage
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <MyJOK currentView={currentView} setCurrentView={setCurrentView} />
        );
    }
  }, [currentView, isInitialized]);

  return (
    <div className="bg-black min-h-screen text-white safe-area-top safe-area-bottom">
      {isInitialized && (
        <>
          <AutoIncrementYieldPerHour
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
          <CheckTokenHoldings />
        </>
      )}
      {renderCurrentView()}
      {isInitialized && currentView !== "loading" && (
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
      )}
    </div>
  );
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default function ClickerPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ClickerPage />
    </ErrorBoundary>
  );
}

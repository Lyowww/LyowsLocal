"use client";

import { useCallback, useState } from "react";
import { JokDuelLoading } from "@/src/app/games/jok-duel/components/JokDuelLoading";

import { Luckiest_Guy } from "next/font/google";
import { JokDuelOnboarding } from "@/src/app/games/jok-duel/components/JokDuelOnboarding";
import { OpponentSelection } from "@/src/app/games/jok-duel/components/OpponentSelection";
import { SelectedOpponent } from "./components/SelectedOpponent";
import { Versus } from "@/src/app/games/jok-duel/components/Versus";
import { Game } from "@/src/app/games/jok-duel/components/Game";
import { Finish } from "./components/Finish";
import { Win } from "./components/Win";
import { RecoverEnergy } from "./components/RecoverEnergy";

const luckiestGuyFont = Luckiest_Guy({ subsets: ["latin"], weight: ["400"] });

export default function JokDuelPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentViewState] = useState<string>("onboarding");

  const setCurrentView = (newView: string) => {
    setCurrentViewState(newView);
  };

  const renderCurrentView = useCallback(() => {
    if (isLoading) {
      return (
        <JokDuelLoading
          setIsLoading={setIsLoading}
          setCurrentView={setCurrentView}
        />
      );
    }

    switch (currentView) {
      case "onboarding":
        return (
          <JokDuelOnboarding
            setCurrentView={setCurrentView}
            currentView={currentView}
          />
        );
      case "opponent-selection":
        return (
          <OpponentSelection
            setCurrentView={setCurrentView}
            currentView={currentView}
          />
        );
      case "selectedOpponent":
        return (
          <SelectedOpponent
            setCurrentView={setCurrentView}
            currentView={currentView}
          />
        );
      case "versus":
        return (
          <Versus setCurrentView={setCurrentView} currentView={currentView} />
        );
      case "game":
        return (
          <Game currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "finish":
        return (
          <Finish currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "win":
        return (
          <Win currentView={currentView} setCurrentView={setCurrentView} />
        );
      case "recover":
        return (
          <RecoverEnergy
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        );
      default:
        return (
          <JokDuelOnboarding
            setCurrentView={setCurrentView}
            currentView={currentView}
          />
        );
    }
  }, [currentView, isLoading]);

  return (
    <div
      className={`bg-black flex justify-center min-h-screen ${luckiestGuyFont.className}`}
    >
      <div className="w-full bg-black text-white font-bold flex flex-col max-w-xl">
        {renderCurrentView()}
      </div>
    </div>
  );
}

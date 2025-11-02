import type ControllerConnector from "@cartridge/connector/controller";
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowToLineIcon, ControllerIcon } from "./icons";
import { Blocks } from "lucide-react";
import { TrophyIcon } from "./icons";

interface HeaderProps {
  onShowPieceShapes?: () => void;
  onShowLeaderboard?: () => void;
}

export const Header = ({ onShowPieceShapes, onShowLeaderboard }: HeaderProps) => {
  const { address } = useAccount();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <div className="w-full min-h-24 max-h-24 px-8 flex items-center justify-between border-b border-[rgba(0,0,0,0.24)] bg-[linear-gradient(0deg,rgba(0,0,0,0.24)_0%,rgba(0,0,0,0.16)_100%)]">
      <div
        className="flex items-center justify-start gap-2 cursor-pointer select-none"
        onClick={handleClick}
      >
        <h1
          className="text-6xl uppercase text-white translate-y-1"
          style={{ textShadow: "4px 4px 0px rgba(0, 0, 0, 1)" }}
        >
          GRIM BLOCK
        </h1>
      </div>
      <div className="flex items-center justify-start gap-4">
        {onShowLeaderboard && (
          <Button
            variant="default"
            className="h-12 px-2 py-2 [&_svg]:size-8"
            onClick={onShowLeaderboard}
            title="Leaderboard"
          >
            <TrophyIcon size="lg" className="size-8" />
          </Button>
        )}
        {onShowPieceShapes && (
          <Button
            variant="default"
            className="h-12 px-2 py-2 [&_svg]:size-8"
            onClick={onShowPieceShapes}
            title="Show Piece Shapes"
          >
            <Blocks className="size-8" />
          </Button>
        )}
        {address ? <Profile /> : <Connect />}
        {address && <Disconnect />}
      </div>
    </div>
  );
};

export const Profile = () => {
  const { address, connector } = useAccount();
  const [username, setUsername] = useState<string | null>(null);

  const controllerConnector = connector as never as ControllerConnector;

  useEffect(() => {
    if (controllerConnector) {
      controllerConnector.username()?.then((username) => {
        setUsername(username);
      });
    }
  }, [controllerConnector]);

  return (
    <Button
      variant="default"
      className="h-12 px-4 py-2 font-[PixelGame] tracking-wide flex items-center justify-center gap-2 [&_svg]:size-6"
      onClick={async () => {
        (connector as ControllerConnector)?.controller.openProfile(
          "inventory",
        );
      }}
    >
      {address && <ControllerIcon />}
      <p
        className="text-2xl font-light tracking-widest"
        style={{ textShadow: "2px 2px 0px rgba(0, 0, 0, 1)" }}
      >
        {username}
      </p>
    </Button>
  );
};

export const Connect = () => {
  const { connectAsync, connectors } = useConnect();
  return (
    <Button
      className="h-12 px-4 py-2 font-[PixelGame] tracking-wide text-2xl"
      variant="default"
      onClick={async () => {
        await connectAsync({ connector: connectors[0] });
      }}
    >
      <p
        className="translate-y-0.5"
        style={{ textShadow: "2px 2px 0px rgba(0, 0, 0, 0.24)" }}
      >
        Connect
      </p>
    </Button>
  );
};

export const Disconnect = () => {
  const { disconnect } = useDisconnect();

  return (
    <Button
      variant="default"
      className="h-12 px-2 py-2 [&_svg]:size-8"
      onClick={() => disconnect()}
    >
      <ArrowToLineIcon variant="right" size="lg" className="size-8" />
    </Button>
  );
};

export const ClaimIcon = () => {
  return (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_d_987_2695)">
    <path d="M9.95312 6.15L11.0406 8H11H8.75C8.05937 8 7.5 7.44062 7.5 6.75C7.5 6.05938 8.05937 5.5 8.75 5.5H8.81875C9.28437 5.5 9.71875 5.74688 9.95312 6.15ZM6 6.75C6 7.2 6.10938 7.625 6.3 8H5C4.44687 8 4 8.44688 4 9V11C4 11.5531 4.44687 12 5 12H19C19.5531 12 20 11.5531 20 11V9C20 8.44688 19.5531 8 19 8H17.7C17.8906 7.625 18 7.2 18 6.75C18 5.23125 16.7688 4 15.25 4H15.1812C14.1844 4 13.2594 4.52813 12.7531 5.3875L12 6.67188L11.2469 5.39062C10.7406 4.52812 9.81562 4 8.81875 4H8.75C7.23125 4 6 5.23125 6 6.75ZM16.5 6.75C16.5 7.44062 15.9406 8 15.25 8H13H12.9594L14.0469 6.15C14.2844 5.74688 14.7156 5.5 15.1812 5.5H15.25C15.9406 5.5 16.5 6.05938 16.5 6.75ZM5 13V18.5C5 19.3281 5.67188 20 6.5 20H11V13H5ZM13 20H17.5C18.3281 20 19 19.3281 19 18.5V13H13V20Z" fill="currentColor"/>
    </g>
    <defs>
    <filter id="filter0_d_987_2695" x="4" y="4" width="18" height="18" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dx="2" dy="2"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.95 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_987_2695"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_987_2695" result="shape"/>
    </filter>
    </defs>
    </svg>
    
  );
};
import React from "react";

type SpaceProps = {
  children: React.ReactNode;
  className?: string;
};

export const Space = ({ children, className }: SpaceProps) => {
  return (
    <div className={`w-full my-10 sm:my-20 mx-auto ${className}`}>
      {children}
    </div>
  );
};

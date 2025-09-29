import React from "react";

type TabProps = {
  title: string;
  onClick?: () => void;
};

export const Tab = ({ title, onClick }: TabProps) => {
  return (
    <div
      onClick={onClick}
      className="border px-4 py-2 rounded-md bg-primary text-center text-white"
    >
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
  );
};

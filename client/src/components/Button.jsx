import React from "react";
import classNames from "classnames";

export function Button({ children, className, variant = "default", ...props }) {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition";
  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
  };
  return (
    <button className={classNames(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LinkProps } from "next/link";
import type { ReactNode } from "react";

type ActiveLinkProps = LinkProps & {
  children: ReactNode;
};

export default function ActiveLink({ href, children, ...rest }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href.toString();

  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
        isActive ? "bg-primary text-white font-semibold" : "hover:bg-base-200"
      }`}
      {...rest}
    >
      {children}
    </Link>
  );
}

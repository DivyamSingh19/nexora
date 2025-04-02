"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

import { useRouter } from "next/navigation";

const Navbar = () => {
  const [userRole, setUserRole] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    setUserRole(localStorage.getItem("role"));
  }, []);

  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Cart",
      link: "/cart",
    },
    {
      name: "Create",
      link: "/create-nft",
    },

    {
      name: "Marketplace",
      link: "/marketplace",
    },
  ];

  return (
    <>
      <header className="fixed w-full top-0 flex items-center gap-8 py-3 px-6 shadow bg-transparent z-50 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="rounded-full flex items-center gap-2">
            <span className="font-bold text-white text-xl">
              Nft-marketplace
            </span>
          </Link>
          <nav className="flex items-center gap-4 rounded-full">
            {navItems.map((item, index) => {
              return (
                <Link
                  key={index}
                  href={item.link}
                  className="p-2 text-gray-100 hover:text-foreground"
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center">
            {userRole ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button className="rounded-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;

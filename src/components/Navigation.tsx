import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { GITHUB_ICON } from "@/helpers/constants";
import { Roboto_Slab } from "next/font/google";

const bungee = Roboto_Slab({
  weight: "800",
  subsets: ["latin"],
});

const navigation = [
  { name: "Cauldron Top-up", href: "#", current: true },
  {
    name: "Github",
    href: "https://github.com/0xidkfa/gringotts",
    current: false,
    icon: GITHUB_ICON,
  },
];

//@ts-ignore
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navigation() {
  return (
    <Disclosure as="nav">
      {({ open }) => (
        <>
          <div className="container mx-auto p-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1">
                <div className="flex flex-shrink-0 items-center">
                  <img
                    className="mr-3 h-8 w-8"
                    src="/logo.svg"
                    alt="Gringotts"
                  />
                  <span
                    className={`text-3xl font-bold uppercase text-zinc-100 ${bungee.className}`}
                  >
                    Gringotts
                  </span>
                </div>
              </div>
              <div className="flex flex-1">
                <div className="hidden rounded-2xl bg-zinc-800 px-4 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.current
                            ? "text-blue-500"
                            : "text-gray-300 hover:text-zinc-100",
                          "rounded-md px-3 py-2 text-sm font-medium",
                        )}
                        aria-current={item.current ? "page" : undefined}
                        target={item.href.startsWith("http") ? "_blank" : ""}
                      >
                        <span className="flex flex-row items-center">
                          {item.icon && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="mr-2 h-5 w-5"
                              viewBox="0 0 24 24"
                            >
                              <path d={item.icon} fill="currentColor" />
                            </svg>
                          )}

                          {item.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-1 justify-end">&nbsp;</div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-zinc-100"
                      : "text-gray-300 hover:bg-gray-700 hover:text-zinc-100",
                    "block rounded-md px-3 py-2 text-base font-medium",
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  <span className="flex flex-row items-center">
                    {item.icon && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                      >
                        <path d={item.icon} />
                      </svg>
                    )}

                    {item.name}
                  </span>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

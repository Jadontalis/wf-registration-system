import { title } from "process";

export const navigationLinks = [
  {
    href: "/registration-cart",
    label: "Registration Cart",
  },

  {
    img: "/icons/user.svg",
    selectedImg: "/icons/user-fill.svg",
    href: "/my-profile",
    label: "My Profile",
  },
];

export const adminSideBarLinks = [
  {
    img: "/icons/admin/home.svg",
    route: "/admin",
    text: "Home",
  },
  {
    img: "/icons/admin/users.svg",
    route: "/admin/users",
    text: "All Users",
  },
  {
    img: "/icons/admin/book.svg",
    route: "/admin/books",
    text: "All Books",
  },
  {
    img: "/icons/admin/bookmark.svg",
    route: "/admin/book-requests",
    text: "Borrow Requests",
  },
  {
    img: "/icons/admin/user.svg",
    route: "/admin/account-requests",
    text: "Account Requests",
  },
];

export const FIELD_NAMES = {
  fullName: "Full Name",
  email: "Email",
  password: "Password",
};

export const FIELD_TYPES = {
  fullName: "text",
  email: "email",
  password: "password",
};


export const sampleEvents = [
    {
        id: 1,
        title: "Whitefish Skijoring Event 2026",
        date: "2-14-2026",
        location: "Whitefish, MT",
        description: "Join us for the 20th Anniversary of the Whitefish Skijoring Event!",
        color: "#84abcc",
        cover: "/images/2025_WFS.jpg",
        summary: "Be one with the action and register now for an unforgettable event!",
        available_events: 100
    },

];
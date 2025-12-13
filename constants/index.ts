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

export const WAIVER_TEXT = `By agreeing to this waiver and release form for the Whitefish Skijoring Event, PARTICIPANT(S) (undersigned participant(s) or undersigned parent(s) or guardian(s)) agree(s) and fully understand(s) the following:

I have read and understand the official rules.
 I fully understand that my entry fee is non-refundable other than under the circumstances noted in the official rules.
 I fully understand that engaging in the sport of skijoring is a hazardous, dangerous and unpredictable activity, which could result in personal injury and/or death. I am voluntarily participating in this event with knowledge of the danger involved and hereby agree to accept any and all risks of injury and/or death, and I agree that I am solely responsible for any injury to myself or any other person due to my participation in this event.  I agree that I am solely responsible for my own safety while participating in this event, and I am free to refuse to participate in this event for any reason.
I hereby certify that I am physically fit and have trained to participate in this event.  I agree that all decisions I make and actions I take are my own.  I further agree that I will pay for any and all medical or other expenses incurred as a result of injury to myself by participating in this event, and that I will not seek indemnification from Whitefish Winter Carnival Skijoring, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers. 
I understand that horseback riding, racing and skiing and/or snowboarding behind a horse will expose me to extreme health risks.  I agree to assume and accept the risks that occur in the activity of horseback riding, skiing, snowboarding, racing and/or skiing and/or snowboarding behind a horse. 
I hereby waive and release for myself, my heirs or assigns, executors and administrators all rights  or claims for damage which I may have now or in the future against the Whitefish Winter Carnival Skijoring Association, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers from any and all claims relating to or pertaining to personal injuries, including death, or damages to property, real or personal, caused by or arising out of my involvement in this event. 
I fully understand that I am responsible for the health and safety of the horse.  I waive and release all rights or claims against Whitefish Winter Carnival Skijoring Association, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers in case of injury and/or death of the horse.  I also understand I am fully responsible and personally liable for any expenses incurred if the horse is injured or for any actions the horse may take causing injury or damage to humans, livestock or property, and I agree that I will not seek indemnification for any such injuries from the Whitefish Winter Carnival Skijoring Association, its Board Members, Sponsors, Land Owners, Race Directors, Volunteers, Spectators, or insurers, or from any Municipalities, the State of Montana, Flathead County, or any City, County and State Agencies, Partners, Employees, or Agents or their insurers. 
I agree to allow Whitefish Winter Carnival Skijoring Association Officials, Race Organizers and Media representatives the use of my name, photos, video recordings, comments or commentaries to help publicize and promote Whitefish Winter Carnival Skijoring Association and the sport of Skijoring.
Good sportsmanship is required at Whitefish Skijoring Races.  I acknowledge that the Whitefish Skijoring officials may disqualify any person or team they deem is acting in an unsportsmanlike manner at any time including, but not limited to registration, Calcutta, and awards ceremonies.  If I am disqualified, I understand and agree that I will surrender my entry fees as well as forfeit event and Calcutta winnings.`;

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
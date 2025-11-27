import Image from "next/image";
import { Button } from "@/components/ui/button";
import RegistrationOverview from "@/components/RegistrationOverview";
import { sampleEvents } from "@/constants";
import { db } from "@/database/drizzle";
import { usersTable } from "@/database/schema";

interface RegistrationPortalViewerProps {
  title: string;
  events: Array<{
    id: number;
    title: string;
    date: string;
    location: string;
    description: string;
    color: string;
    cover: string;
    summary: string;
    available_events: number;
  }>;
  containerClassName?: string;
}

const RegistrationPortalViewer = ({ title, events, containerClassName }: RegistrationPortalViewerProps) => {
  return (
    <div className={containerClassName}>
      <h2>{title}</h2>
      <div>
        {events.map((event) => (
          <div key={event.id}>
            <h3>{event.title}</h3>
            <p>{event.date}</p>
            <p>{event.location}</p>
            <p>{event.description}</p>
            <p>{event.color}</p>
            <p>{event.cover}</p>
            <p>{event.summary}</p>
            <p>{event.available_events}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = async () => {
  return (
    <>
      <RegistrationOverview {...sampleEvents[0]} />  
    </>
  )
}

export default Home;
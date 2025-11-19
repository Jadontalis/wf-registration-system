import Image from "next/image";
import { Button } from "@/components/ui/button";
import RegistrationOverview from "@/components/RegistrationOverview";
import RegistrationPortalViewer from "@/components/RegistrationPortalViewer";
import { sampleEvents } from "@/constants";

const Home = () =><>
  <RegistrationOverview {... sampleEvents[0]} />

  <RegistrationPortalViewer 
      title="Event Registration Portal"
      events={sampleEvents}
      containerClassName="mt-28"
  />
</>

export default Home;
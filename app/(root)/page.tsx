import RegistrationOverview from "@/components/RegistrationOverview";
import { sampleEvents } from "@/constants";
import { auth } from "@/auth";

const Home = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  return (
    <>
      <RegistrationOverview {...sampleEvents[0]} userId={userId} />  
    </>
  )
}

export default Home;
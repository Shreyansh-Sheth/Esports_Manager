/**
Dataset Needed:
    -User
    
Views 
  -show user bio
  -show all ingame names (private / public as user decide)
  -show clan
  -show solo participants in clan
  -show portfolio //for future
  -show profile picture // for future (for email auth have to use storege and that takes time)

Interacrtion:
    -Add new ingame Name
    -Remove Ingame Name
    -Update Ingame Name
    -Edit  
    -Edit Portfolio //For future 

 */
import { useEffect, useState } from "react";
import { auth } from "../../src/config/firebaseConfig";
import { useRouter } from "next/router";
import ProfileView from "../../src/components/ProfileView";
export default function Profile() {
  const router = useRouter();
  const [userId, setUserId] = useState<string>();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user?.isAnonymous) {
        router.push("/");
      }
      if (user) {
        setUserId(user.uid);
      } else {
        router.push("/");
      }
    });
  }, []);
  return (
    <div>
      <ProfileView userId={userId}></ProfileView>
    </div>
  );
}

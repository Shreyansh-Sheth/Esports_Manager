import { useRouter } from "next/router";
import { useEffect } from "react";
import ProfileView from "../../src/components/ProfileView";
import { auth } from "../../src/config/firebaseConfig";
export default function OtherUserProfile() {
  const router = useRouter();
  const { userId } = router.query;

  useEffect(() => {
    if (userId === auth.currentUser?.uid) {
      router.push("/profile");
    }
  }, [userId, auth.currentUser]);
  return (
    <div>
      {typeof userId == "string" && <ProfileView userId={userId}></ProfileView>}
    </div>
  );
}

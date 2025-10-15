"use client";

import { useRouter } from "next/navigation";
import DeleteButton from "./DeleteButton"; // Import the generic button

type Props = {
  userId: number;
  username: string;
};

export default function UserDeleteAction({ userId, username }: Props) {
  const router = useRouter();

  // This function will be called by DeleteButton on a successful API call
  const handleSuccess = () => {
    // Redirect the user back to the main list
    router.push("/radius-users");
    router.refresh(); // Ensure the user list is updated
  };

  return (
    <DeleteButton
      itemId={userId}
      itemName={username}
      entityType="user"
      apiEndpoint="/api/radius-users"
      onSuccess={handleSuccess} // Pass the redirect function as a prop
    />
  );
}
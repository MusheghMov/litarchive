import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignInButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignUpSuggestionModal() {
  return (
    <DialogContent
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="w-max p-8"
    >
      <DialogHeader>
        <DialogTitle>Want to save favorite books?</DialogTitle>
        <DialogDescription>
          Sing in to add books to your collection
        </DialogDescription>
      </DialogHeader>
      <SignInButton>
        <Button className="text-background">Sign In</Button>
      </SignInButton>
    </DialogContent>
  );
}

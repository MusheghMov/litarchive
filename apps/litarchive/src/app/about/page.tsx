export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">About Litarchive</h1>
      <p className="text-lg mb-4">
        Litarchive is an online library where users can find and read books in a comfortable reading experience.
      </p>
      <h2 className="text-2xl font-bold mb-2">Features</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Optimized for a comfortable reading experience.</li>
        <li>Users can create their own books and publish them in the app.</li>
        <li>Collaboration feature: invite collaborators for your books and work together in a collaborative editor.</li>
      </ul>
      <h2 className="text-2xl font-bold mb-2">How to Use</h2>
      <p className="text-lg">
        Simply browse the library, find a book you like, and start reading. If you want to create your own book, you can use our intuitive editor and publish your work for others to enjoy. To collaborate on a book, invite other users to join your project and work together in real-time.
      </p>
    </div>
  );
}

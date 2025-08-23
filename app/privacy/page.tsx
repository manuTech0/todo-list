// app/privacy/page.jsx
export default function PrivacyPolicy() {
  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-2">Last updated: August 23, 2025</p>
      <p className="mb-4">
        We are committed to protecting your privacy. This policy explains what data we collect and how we use it.
      </p>
      <h2 className="text-xl font-semibold mt-4 mb-2">Data We Collect</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Name and email (if provided)</li>
        <li>Usage data (pages visited, time spent)</li>
      </ul>
      <h2 className="text-xl font-semibold mt-4 mb-2">How We Use It</h2>
      <ul className="list-disc list-inside mb-4">
        <li>Improve user experience</li>
        <li>Send updates (with consent)</li>
      </ul>
      <p>
        You may request deletion or review of your data at any time.
      </p>
    </main>
  );
}

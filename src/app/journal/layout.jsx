// Journal-level layout. Track now lives directly in journal/page.jsx so it
// shares state with the content area without needing context. This layout is
// kept as a thin wrapper in case journal-specific chrome is added later.
export default function JournalLayout({ children }) {
  return <>{children}</>;
}

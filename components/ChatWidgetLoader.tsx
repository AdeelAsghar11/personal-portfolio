"use client";

import dynamic from "next/dynamic";

// Lazy, client-only mount. `ssr: false` keeps the ChatWidget (and its
// framer-motion / lucide usage + the meta import) in a SEPARATE client chunk
// that is never part of the server render or the main first-load JS; it is
// fetched by the browser after hydration rather than inlined into the page
// bundle.
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

export default function ChatWidgetLoader() {
  return <ChatWidget />;
}

"use client";

import { use } from "react";
import { ChatRoom } from "@/components/discussions";

interface Props {
  params: Promise<{ groupeId: string }>;
}

export default function GroupeDiscussionPage({ params }: Props) {
  const { groupeId } = use(params);

  return <ChatRoom groupeId={groupeId} />;
}

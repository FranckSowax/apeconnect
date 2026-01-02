import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { getWhapiClient } from "@/lib/whapi/client";
import { templates, formatPhoneNumber } from "@/lib/whapi/templates";
import crypto from "crypto";

// Store for conversation states (in production, use Redis)
const conversationStates = new Map<string, {
  step: string;
  data: Record<string, unknown>;
  timestamp: number;
}>();

// Verify webhook signature
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.WHAPI_WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret configured

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text();
    const signature = request.headers.get("x-whapi-signature") || "";

    // Verify signature
    if (!verifyWebhookSignature(payload, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const data = JSON.parse(payload);

    // Handle different webhook events
    switch (data.event) {
      case "messages":
        await handleIncomingMessage(data.data);
        break;
      case "message.status":
        await handleMessageStatus(data.data);
        break;
      default:
        console.log("Unhandled webhook event:", data.event);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handleIncomingMessage(message: {
  id: string;
  from: string;
  body?: string;
  type: string;
  media?: { url: string; mimetype: string };
}) {
  const supabase = await createServiceClient();
  const whapi = getWhapiClient();
  const phoneNumber = formatPhoneNumber(message.from);

  // Store incoming message
  await supabase.from("whatsapp_messages").insert({
    direction: "inbound",
    phone_number: phoneNumber,
    message_id: message.id,
    payload: message,
    status: "received",
  });

  // Find user by phone number
  const { data: user } = await supabase
    .from("users")
    .select("*, students(*)")
    .eq("phone", phoneNumber)
    .single();

  if (!user) {
    // User not found - send registration message
    await whapi.sendMessage({
      to: message.from,
      body: "Bonjour! Votre numero n'est pas encore enregistre sur APE Connect. Veuillez vous inscrire sur notre plateforme web.",
    });
    return;
  }

  const text = message.body?.toLowerCase().trim() || "";

  // Handle commands
  if (text === "aide" || text === "help") {
    await whapi.sendMessage({
      to: message.from,
      body: templates.help(),
    });
    return;
  }

  if (text === "absence") {
    await startAbsenceFlow(message.from, user);
    return;
  }

  if (text === "mes absences") {
    await sendAbsenceHistory(message.from, user);
    return;
  }

  // Check if user is in a conversation flow
  const state = conversationStates.get(message.from);
  if (state) {
    await handleConversationFlow(message, user, state);
    return;
  }

  // Default response
  await whapi.sendMessage({
    to: message.from,
    body: "Je n'ai pas compris votre message. Tapez *aide* pour voir les commandes disponibles.",
  });
}

async function startAbsenceFlow(phone: string, user: { id: string; students?: Array<{ id: string; full_name: string }> }) {
  const whapi = getWhapiClient();

  if (!user.students || user.students.length === 0) {
    await whapi.sendMessage({
      to: phone,
      body: "Vous n'avez pas encore enregistre d'enfants. Veuillez ajouter vos enfants sur la plateforme web.",
    });
    return;
  }

  // Store conversation state
  conversationStates.set(phone, {
    step: "select_student",
    data: { students: user.students },
    timestamp: Date.now(),
  });

  await whapi.sendMessage({
    to: phone,
    body: templates.absenceBot.askStudent(user.students.map((s) => s.full_name)),
  });
}

async function handleConversationFlow(
  message: { from: string; body?: string; type: string; media?: { url: string; mimetype: string } },
  user: { id: string },
  state: { step: string; data: Record<string, unknown> }
) {
  const whapi = getWhapiClient();
  const supabase = await createServiceClient();
  const text = message.body?.toLowerCase().trim() || "";

  switch (state.step) {
    case "select_student": {
      const students = state.data.students as Array<{ id: string; full_name: string }>;
      const selection = parseInt(text);

      if (isNaN(selection) || selection < 1 || selection > students.length) {
        await whapi.sendMessage({
          to: message.from,
          body: "Choix invalide. Veuillez repondre avec le numero correspondant a l'eleve.",
        });
        return;
      }

      const selectedStudent = students[selection - 1];
      conversationStates.set(message.from, {
        step: "enter_date",
        data: { ...state.data, student: selectedStudent },
        timestamp: Date.now(),
      });

      await whapi.sendMessage({
        to: message.from,
        body: templates.absenceBot.askDate(),
      });
      break;
    }

    case "enter_date": {
      let date: string;

      if (text === "aujourd'hui" || text === "aujourdhui") {
        date = new Date().toLocaleDateString("fr-FR");
      } else {
        // Validate date format DD/MM/YYYY
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        const match = text.match(dateRegex);

        if (!match) {
          await whapi.sendMessage({
            to: message.from,
            body: "Format de date invalide. Utilisez le format JJ/MM/AAAA (ex: 15/01/2024)",
          });
          return;
        }

        date = text;
      }

      conversationStates.set(message.from, {
        step: "enter_reason",
        data: { ...state.data, date },
        timestamp: Date.now(),
      });

      await whapi.sendMessage({
        to: message.from,
        body: templates.absenceBot.askReason(),
      });
      break;
    }

    case "enter_reason": {
      conversationStates.set(message.from, {
        step: "upload_justification",
        data: { ...state.data, reason: message.body },
        timestamp: Date.now(),
      });

      await whapi.sendMessage({
        to: message.from,
        body: templates.absenceBot.askJustification(),
      });
      break;
    }

    case "upload_justification": {
      let justification: { url: string; mimetype: string } | null = null;

      if (text !== "non" && message.type !== "text" && message.media) {
        justification = message.media;
      }

      const student = state.data.student as { id: string; full_name: string };

      conversationStates.set(message.from, {
        step: "confirm",
        data: { ...state.data, justification },
        timestamp: Date.now(),
      });

      await whapi.sendMessage({
        to: message.from,
        body: templates.absenceBot.confirm(
          student.full_name,
          state.data.date as string,
          state.data.reason as string
        ),
      });
      break;
    }

    case "confirm": {
      if (text === "oui" || text === "yes") {
        const student = state.data.student as { id: string; full_name: string };

        // Parse date from DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = (state.data.date as string).split("/");
        const isoDate = `${year}-${month}-${day}`;

        // Create absence in database
        const { data: absence, error } = await supabase
          .from("absences")
          .insert({
            user_id: user.id,
            student_id: student.id,
            date: isoDate,
            reason_text: state.data.reason,
            status: "pending",
          })
          .select()
          .single();

        if (error) {
          console.error("Error creating absence:", error);
          await whapi.sendMessage({
            to: message.from,
            body: "Une erreur est survenue. Veuillez reessayer plus tard.",
          });
        } else {
          // Handle justification upload if provided
          if (state.data.justification) {
            // TODO: Download and store the file in Supabase storage
          }

          await whapi.sendMessage({
            to: message.from,
            body: templates.absenceBot.success(),
          });

          // Notify admins
          // TODO: Send notification to establishment admins
        }

        conversationStates.delete(message.from);
      } else if (text === "non" || text === "no") {
        conversationStates.delete(message.from);
        await whapi.sendMessage({
          to: message.from,
          body: templates.absenceBot.cancelled(),
        });
      } else {
        await whapi.sendMessage({
          to: message.from,
          body: "Repondez *oui* pour confirmer ou *non* pour annuler.",
        });
      }
      break;
    }
  }
}

async function sendAbsenceHistory(phone: string, user: { id: string }) {
  const whapi = getWhapiClient();
  const supabase = await createServiceClient();

  const { data: absences } = await supabase
    .from("absences")
    .select("*, student:students(full_name)")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(5);

  if (!absences || absences.length === 0) {
    await whapi.sendMessage({
      to: phone,
      body: "Vous n'avez pas encore signale d'absence.",
    });
    return;
  }

  const statusEmoji = {
    pending: "⏳",
    approved: "✅",
    rejected: "❌",
  };

  const statusText = {
    pending: "En attente",
    approved: "Approuvee",
    rejected: "Refusee",
  };

  let message = "*Vos dernieres absences:*\n\n";

  for (const absence of absences) {
    const date = new Date(absence.date).toLocaleDateString("fr-FR");
    const emoji = statusEmoji[absence.status as keyof typeof statusEmoji];
    const status = statusText[absence.status as keyof typeof statusText];

    message += `${emoji} *${absence.student?.full_name}* - ${date}\n`;
    message += `   Status: ${status}\n\n`;
  }

  await whapi.sendMessage({
    to: phone,
    body: message,
  });
}

async function handleMessageStatus(data: {
  id: string;
  status: string;
  chat_id: string;
}) {
  const supabase = await createServiceClient();

  // Update message status
  await supabase
    .from("whatsapp_messages")
    .update({ status: data.status })
    .eq("message_id", data.id);
}

// Clean up old conversation states periodically
setInterval(() => {
  const now = Date.now();
  const timeout = 30 * 60 * 1000; // 30 minutes

  for (const [phone, state] of conversationStates.entries()) {
    if (now - state.timestamp > timeout) {
      conversationStates.delete(phone);
    }
  }
}, 5 * 60 * 1000); // Check every 5 minutes

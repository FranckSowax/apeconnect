// Edge Function: Envoi de notifications WhatsApp via Whapi
// Appelée quand un message est marqué comme "annonce"

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationPayload {
  message_id: string;
  groupe_id: string;
  contenu: string;
  auteur_id: string;
}

interface GroupeMember {
  user_id: string;
  full_name: string;
  phone: string;
  notif_whatsapp: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const whapiToken = Deno.env.get("WHAPI_TOKEN");

    if (!whapiToken) {
      console.error("WHAPI_TOKEN not configured");
      return new Response(
        JSON.stringify({ error: "WhatsApp integration not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const payload: NotificationPayload = await req.json();
    const { message_id, groupe_id, contenu, auteur_id } = payload;

    console.log("Processing WhatsApp notification for message:", message_id);

    // Récupérer les infos du groupe et de l'auteur
    const { data: groupeData, error: groupeError } = await supabase
      .from("groupes_discussion")
      .select(`
        nom,
        classe:classes(nom, niveau)
      `)
      .eq("id", groupe_id)
      .single();

    if (groupeError) {
      console.error("Error fetching groupe:", groupeError);
      throw groupeError;
    }

    const { data: auteurData } = await supabase
      .from("users")
      .select("full_name")
      .eq("id", auteur_id)
      .single();

    const groupeNom = groupeData?.nom || "Groupe";
    const auteurNom = auteurData?.full_name || "Un membre";

    // Récupérer tous les membres du groupe avec leurs numéros WhatsApp
    const { data: members, error: membersError } = await supabase.rpc(
      "get_groupe_members",
      { p_groupe_id: groupe_id }
    );

    if (membersError) {
      console.error("Error fetching members:", membersError);
      throw membersError;
    }

    // Pour chaque membre (sauf l'auteur), envoyer un WhatsApp si activé
    const sendPromises = [];

    for (const member of members || []) {
      if (member.user_id === auteur_id) continue;

      // Récupérer les préférences et numéro de l'utilisateur
      const { data: userData } = await supabase
        .from("users")
        .select("phone, notif_whatsapp")
        .eq("id", member.user_id)
        .single();

      if (!userData?.phone || !userData?.notif_whatsapp) {
        console.log(`Skipping user ${member.user_id}: no phone or notifications disabled`);
        continue;
      }

      // Formater le numéro (ajouter le code pays si nécessaire)
      let phoneNumber = userData.phone.replace(/\D/g, "");
      if (!phoneNumber.startsWith("241") && phoneNumber.length === 8) {
        phoneNumber = "241" + phoneNumber;
      }

      // Construire le message WhatsApp
      const whatsappMessage = `📢 *Annonce - ${groupeNom}*

${auteurNom}:
${contenu.substring(0, 500)}${contenu.length > 500 ? "..." : ""}

_Consultez l'app APE Connect pour plus de détails._`;

      // Envoyer via Whapi
      sendPromises.push(
        sendWhatsAppMessage(whapiToken, phoneNumber, whatsappMessage)
          .then(async (success) => {
            // Mettre à jour la notification comme envoyée par WhatsApp
            if (success) {
              await supabase
                .from("notifications_discussion")
                .update({ sent_whatsapp: true })
                .eq("message_id", message_id)
                .eq("user_id", member.user_id);
            }
            return { user_id: member.user_id, success };
          })
          .catch((error) => {
            console.error(`Error sending to ${member.user_id}:`, error);
            return { user_id: member.user_id, success: false, error: error.message };
          })
      );
    }

    const results = await Promise.all(sendPromises);

    console.log("WhatsApp notifications sent:", results);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Sent ${results.filter((r) => r.success).length}/${results.length} WhatsApp messages`,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in send-whatsapp-notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

async function sendWhatsAppMessage(
  token: string,
  phoneNumber: string,
  message: string
): Promise<boolean> {
  try {
    const response = await fetch("https://gate.whapi.cloud/messages/text", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: phoneNumber + "@s.whatsapp.net",
        body: message,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Whapi error:", errorData);
      return false;
    }

    const data = await response.json();
    console.log("Whapi response:", data);
    return true;
  } catch (error) {
    console.error("Error calling Whapi:", error);
    return false;
  }
}

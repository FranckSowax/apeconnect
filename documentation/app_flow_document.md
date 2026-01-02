# Application Flow Document

## Onboarding and Sign-In/Sign-Up

When a new user arrives, they land on the welcome page of the Progressive Web App or open the mobile application. The first step is to choose their school from a dropdown that lists all partnered establishments. Once the user selects their institution, they are presented with the secure Supabase authentication screen, where they can either enter their email address and choose a password or opt for a social login using Google or Apple. After entering credentials, the user receives a confirmation link by email and an automated WhatsApp message via Whapi.cloud to verify their phone number. Clicking the link in the email and replying to the WhatsApp prompt completes the account activation. If the password is forgotten, the user clicks “Forgot Password,” enters their email, and receives a reset link. All users, whether parents, teachers, censeurs, or super-admins, follow the same signup path; their roles are assigned automatically through Supabase RLS after the first successful login. Signing out is as simple as tapping the logout button in the profile menu, which clears the session and returns the user to the welcome page.

## Main Dashboard or Home Page

After logging in, the user arrives at the main dashboard tailored to their role. Parents see two prominent cards labeled “Connect” for school life and absences, and “Shop” for buying or selling textbooks. Teachers view a similar layout but with an additional section showing their classes and recent incident reports. Censeurs access an interface that highlights pending absence requests, announcements awaiting moderation, and global statistics. Super-admins have a full navigation menu including user management, module configuration, and integration settings. A fixed sidebar on desktop or a bottom nav bar on mobile allows the user to switch between modules, view notifications, or access their profile settings. The header displays the user’s name and role, along with a search bar that filters recent records across both modules.

## Detailed Feature Flows and Page Transitions

### Module Connect – Absence Submission by Parents or Teachers

When a parent or teacher clicks into the Connect module, they land on an absence overview page that lists recent reports. To submit a new absence, they tap the “New Report” button, which opens a form asking for the date of absence, reason, and an upload field for a JPEG or PDF justification. As soon as they submit, the report is saved as a draft in Supabase and an immediate WhatsApp notification confirms receipt. If they choose to use WhatsApp directly, they send a message to the school’s bot. The Node.js backend receives the webhook, initiates a conversational flow to collect the same details, and then stores the draft report on the platform. Regardless of entry point, the user sees their new draft appear in their history list.

### Module Connect – Administrative Validation

Censeurs and the life-school team access the admin side of the Connect module where pending absence reports await review. Each item displays the child’s name, class, date, reason, and attached document. The reviewer can accept or reject with a single tap. When a decision is made, a webhook triggers a WhatsApp message back to the parent confirming approval or requesting a corrected document. In case of rejection, the parent is guided to edit and resubmit the report. The super-admin can override decisions, adjust notification templates, and view a full audit trail that logs every status change.

### Module Shop – Browsing and Purchase Flow

Clicking on Shop presents parents with a catalog of textbook listings displayed in a grid or list view. Users can filter by subject, grade level, or school. Tapping an item brings up the details page showing book images, description, price, and seller name. A prominent “Buy via WhatsApp” button uses a preformatted link from Whapi.cloud to open a chat with the seller, preserving the context of the listing. The platform does not process payments; it simply hands off the conversation to WhatsApp for negotiation and transaction.

### Module Shop – Publication and Moderation Workflow

To create a listing, a parent opens the publish form in the Shop module and enters the title, price, description, and uploads a photo. Alternatively, they can message the bot on WhatsApp with the photo, price, and a brief description. The Node.js webhook captures the details and saves them as a draft announcement in Supabase. GPT-4o runs an automated content check to flag missing fields or inappropriate terms. Listings that pass automated checks then appear in the censeur’s moderation queue. The reviewer inspects each entry, edits details if needed, and approves or rejects. Upon approval, the listing goes live, and a WhatsApp confirmation is sent to the seller. Rejected drafts are returned to the author with comments.

### WhatsApp Integration and Webhook Flow

All incoming and outgoing WhatsApp messages flow through Whapi.cloud. The backend Node.js service listens for webhooks marking new messages or attachments. Each webhook triggers the appropriate workflow—absence report intake or listing creation—and persists data in Supabase. Outgoing notifications such as approval confirmations or reminders are sent via Whapi.cloud API calls. The integration ensures that parents receive real-time updates without opening the web or mobile app. Future extensions for mobile money notifications will leverage the same webhook and messaging pattern.

## Settings and Account Management

Users access settings by opening their profile menu from the sidebar or bottom nav. In the Settings section, they can update personal information like name, email, and phone number. A separate tab allows them to configure notification preferences, specifying whether they wish to receive WhatsApp alerts for every update or only critical messages. Although there is no billing or subscription module at launch, the super-admin may later enable mobile money integration or class-level messaging options. After saving changes, the user is returned to their previous location in the app. Password changes and two-factor authentication settings are also managed here, with Supabase handling secure credential storage.

## Error States and Alternate Paths

If a user submits a form with missing or invalid data, the system displays a clear inline error message next to each field and highlights the input in red. If the uploaded file exceeds size limits or is in an unsupported format, a message explains the allowed types and sizes. In case of network issues, the PWA shows a “You’re offline” banner and allows the user to continue browsing cached data. Any form submissions made offline queue locally and synchronize automatically when connectivity returns. If a user attempts to access a restricted page, such as a parent trying to view moderation settings, they receive an access denied page with a suggestion to contact the administrator. Should the WhatsApp gateway be unavailable, the app retries sending messages and shows a warning indicator until service is restored.

## Conclusion and Overall App Journey

From the first moment a parent selects their school and creates their account, to sending absence notifications and browsing textbooks, each step in the platform is seamless and unified across web, mobile, and WhatsApp. Parents and teachers declare absences either in the app or via chat, censeurs validate requests and moderate listings, and GPT-4o assists with quality control. The PWA ensures that critical information stays available even when offline, while Supabase RLS safeguards data by role. Every notification flows through Whapi.cloud so that users remain informed in real time. At the end of the day, this cohesive experience empowers families and school staff to communicate efficiently, manage student absences, and handle textbook exchanges without friction.
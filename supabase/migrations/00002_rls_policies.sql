-- APE Connect Row-Level Security Policies
-- Second migration

-- Enable RLS on all tables
ALTER TABLE establishments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE absences ENABLE ROW LEVEL SECURITY;
ALTER TABLE absence_justifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM users WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get user establishment
CREATE OR REPLACE FUNCTION get_user_establishment(user_id UUID)
RETURNS UUID AS $$
  SELECT establishment_id FROM users WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is admin or super_admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT role IN ('admin', 'super_admin') FROM users WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT role = 'super_admin' FROM users WHERE id = user_id;
$$ LANGUAGE sql SECURITY DEFINER;

-- ESTABLISHMENTS POLICIES
-- Everyone can read establishments (for signup dropdown)
CREATE POLICY "Anyone can view establishments"
  ON establishments FOR SELECT
  USING (true);

-- Only super_admins can manage establishments
CREATE POLICY "Super admins can manage establishments"
  ON establishments FOR ALL
  USING (is_super_admin(auth.uid()));

-- USERS POLICIES
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (id = auth.uid());

-- Admins can view users in their establishment
CREATE POLICY "Admins can view establishment users"
  ON users FOR SELECT
  USING (
    is_admin(auth.uid()) AND
    establishment_id = get_user_establishment(auth.uid())
  );

-- Super admins can view all users
CREATE POLICY "Super admins can view all users"
  ON users FOR SELECT
  USING (is_super_admin(auth.uid()));

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM users WHERE id = auth.uid()));

-- Admins can update user roles in their establishment (except super_admin)
CREATE POLICY "Admins can update establishment users"
  ON users FOR UPDATE
  USING (
    is_admin(auth.uid()) AND
    establishment_id = get_user_establishment(auth.uid()) AND
    role != 'super_admin'
  );

-- Super admins can manage all users
CREATE POLICY "Super admins can manage users"
  ON users FOR ALL
  USING (is_super_admin(auth.uid()));

-- STUDENTS POLICIES
-- Parents can view their own students
CREATE POLICY "Parents can view own students"
  ON students FOR SELECT
  USING (parent_id = auth.uid());

-- Admins can view students in their establishment
CREATE POLICY "Admins can view establishment students"
  ON students FOR SELECT
  USING (
    is_admin(auth.uid()) AND
    establishment_id = get_user_establishment(auth.uid())
  );

-- Parents can create students
CREATE POLICY "Parents can create students"
  ON students FOR INSERT
  WITH CHECK (
    parent_id = auth.uid() AND
    establishment_id = get_user_establishment(auth.uid())
  );

-- Parents can update their own students
CREATE POLICY "Parents can update own students"
  ON students FOR UPDATE
  USING (parent_id = auth.uid());

-- Parents can delete their own students
CREATE POLICY "Parents can delete own students"
  ON students FOR DELETE
  USING (parent_id = auth.uid());

-- ABSENCES POLICIES
-- Users can view their own absences
CREATE POLICY "Users can view own absences"
  ON absences FOR SELECT
  USING (user_id = auth.uid());

-- Admins/Censeurs can view absences in their establishment
CREATE POLICY "Staff can view establishment absences"
  ON absences FOR SELECT
  USING (
    get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin') AND
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = absences.student_id
      AND students.establishment_id = get_user_establishment(auth.uid())
    )
  );

-- Parents can create absences for their students
CREATE POLICY "Parents can create absences"
  ON absences FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = student_id
      AND students.parent_id = auth.uid()
    )
  );

-- Parents can update pending absences
CREATE POLICY "Parents can update pending absences"
  ON absences FOR UPDATE
  USING (user_id = auth.uid() AND status = 'pending');

-- Admins/Censeurs can update absences (approve/reject)
CREATE POLICY "Staff can update absences"
  ON absences FOR UPDATE
  USING (
    get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin') AND
    EXISTS (
      SELECT 1 FROM students
      WHERE students.id = absences.student_id
      AND students.establishment_id = get_user_establishment(auth.uid())
    )
  );

-- ABSENCE JUSTIFICATIONS POLICIES
-- Users can view justifications for their absences
CREATE POLICY "Users can view own justifications"
  ON absence_justifications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM absences
      WHERE absences.id = absence_id
      AND absences.user_id = auth.uid()
    )
  );

-- Staff can view justifications
CREATE POLICY "Staff can view justifications"
  ON absence_justifications FOR SELECT
  USING (
    get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin')
  );

-- Users can upload justifications for their absences
CREATE POLICY "Users can upload justifications"
  ON absence_justifications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM absences
      WHERE absences.id = absence_id
      AND absences.user_id = auth.uid()
    )
  );

-- ADS POLICIES
-- Everyone can view published ads
CREATE POLICY "Anyone can view published ads"
  ON ads FOR SELECT
  USING (status = 'published');

-- Users can view their own ads
CREATE POLICY "Users can view own ads"
  ON ads FOR SELECT
  USING (user_id = auth.uid());

-- Staff can view all ads in establishment
CREATE POLICY "Staff can view establishment ads"
  ON ads FOR SELECT
  USING (
    get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin') AND
    establishment_id = get_user_establishment(auth.uid())
  );

-- Users can create ads
CREATE POLICY "Users can create ads"
  ON ads FOR INSERT
  WITH CHECK (
    user_id = auth.uid() AND
    establishment_id = get_user_establishment(auth.uid())
  );

-- Users can update their own ads
CREATE POLICY "Users can update own ads"
  ON ads FOR UPDATE
  USING (user_id = auth.uid() AND status IN ('draft', 'rejected'));

-- Staff can update ads (moderate)
CREATE POLICY "Staff can moderate ads"
  ON ads FOR UPDATE
  USING (
    get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin') AND
    establishment_id = get_user_establishment(auth.uid())
  );

-- Users can delete their own ads
CREATE POLICY "Users can delete own ads"
  ON ads FOR DELETE
  USING (user_id = auth.uid());

-- AD PHOTOS POLICIES
-- Anyone can view photos of published ads
CREATE POLICY "Anyone can view published ad photos"
  ON ad_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ads
      WHERE ads.id = ad_id
      AND ads.status = 'published'
    )
  );

-- Users can view their own ad photos
CREATE POLICY "Users can view own ad photos"
  ON ad_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM ads
      WHERE ads.id = ad_id
      AND ads.user_id = auth.uid()
    )
  );

-- Staff can view all photos
CREATE POLICY "Staff can view ad photos"
  ON ad_photos FOR SELECT
  USING (
    get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin')
  );

-- Users can upload photos to their ads
CREATE POLICY "Users can upload ad photos"
  ON ad_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ads
      WHERE ads.id = ad_id
      AND ads.user_id = auth.uid()
    )
  );

-- Users can delete their ad photos
CREATE POLICY "Users can delete own ad photos"
  ON ad_photos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM ads
      WHERE ads.id = ad_id
      AND ads.user_id = auth.uid()
    )
  );

-- MODERATION LOGS POLICIES
-- Staff can view moderation logs
CREATE POLICY "Staff can view moderation logs"
  ON moderation_logs FOR SELECT
  USING (get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin'));

-- Staff can create moderation logs
CREATE POLICY "Staff can create moderation logs"
  ON moderation_logs FOR INSERT
  WITH CHECK (get_user_role(auth.uid()) IN ('censeur', 'admin', 'super_admin'));

-- WHATSAPP MESSAGES POLICIES
-- Users can view their own messages
CREATE POLICY "Users can view own messages"
  ON whatsapp_messages FOR SELECT
  USING (user_id = auth.uid());

-- Staff can view messages
CREATE POLICY "Staff can view messages"
  ON whatsapp_messages FOR SELECT
  USING (get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- Service role can insert messages (for webhooks)
CREATE POLICY "Service can insert messages"
  ON whatsapp_messages FOR INSERT
  WITH CHECK (true);

-- NOTIFICATIONS POLICIES
-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

-- Service can create notifications
CREATE POLICY "Service can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

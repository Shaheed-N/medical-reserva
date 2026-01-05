# MedPlus - Role-Based Dashboard Links

## Quick Access Links by Role

### 🏥 Super Administrator
**Dashboard:** `/admin/dashboard`
- System overview and analytics
- All hospitals management
- User management across platform
- Audit logs and system settings

**Key Pages:**
- `/admin/hospitals` - All hospitals directory
- `/admin/users` - User management
- `/admin/analytics` - Platform-wide metrics
- `/admin/settings` - System configuration

---

### 👔 Hospital Owner
**Dashboard:** `/owner/dashboard`
- Multi-branch overview
- Revenue and performance metrics
- Staff management

**Key Pages:**
- `/owner/branches` - Manage all branches
- `/owner/staff` - Invite and assign staff
- `/owner/analytics` - Financial reports
- `/owner/settings` - Hospital profile

---

### 📊 Hospital Manager
**Dashboard:** `/manager/dashboard`
- Branch operations overview
- Today's appointments
- Staff scheduling

**Key Pages:**
- `/manager/doctors` - Doctor management
- `/manager/services` - Service catalog
- `/manager/schedule` - All doctors' calendars
- `/manager/forms` - Form builder
- `/manager/reports` - Branch analytics

---

### 👨‍⚕️ Doctor / Specialist
**Dashboard:** `/doctor/dashboard`
- Today's schedule
- Upcoming appointments
- Patient queue

**Key Pages:**
- `/doctor/schedule` - My availability
- `/doctor/appointments` - All appointments
- `/doctor/patients` - Patient list
- `/doctor/profile` - My profile settings

---

### 📋 Admin Staff
**Dashboard:** `/staff/dashboard`
- Check-in queue
- Today's appointments
- Quick booking

**Key Pages:**
- `/staff/check-in` - Patient check-in
- `/staff/book` - Book appointment
- `/staff/search` - Find patients
- `/staff/appointments` - Appointment list

---

### 👤 Patient (Public)
**Dashboard:** `/patient/dashboard`
- Upcoming appointments
- Medical history
- Saved hospitals

**Key Pages:**
- `/` - Home (search & browse)
- `/hospitals` - Hospital search
- `/hospital/:slug` - Hospital profile
- `/doctor/:id` - Doctor profile
- `/book/:serviceId` - Booking flow
- `/patient/appointments` - My appointments
- `/patient/profile` - My profile & medical history

---

## Implementation Status

- [x] Patient Home (`/`)
- [x] Login (`/login`)
- [ ] Hospital Search
- [ ] Doctor Profiles
- [ ] Booking Flow
- [ ] Role-based Dashboards
- [ ] Admin Panels

## Next Steps

1. Implement hospital search and filtering
2. Create doctor profile pages with booking
3. Build appointment booking flow
4. Develop role-specific dashboards
5. Add admin management interfaces

# MedPlus Premium Mobile App - Implementation Plan

## Design System: Dopamine Blue
- Primary: #0055FF (Electric Blue)
- Secondary: #00DDFF (Vibrant Cyan)
- Accent: #002060 (Deep Cobalt)
- Background: #f0f7ff (Soft Blue Mist)

## Architecture
- React Native + Expo Router
- Zustand for state management
- React Query for data fetching
- Supabase backend
- Ionicons for all icons

---

## Phase 1: Core Experience ✅
- [x] Home Screen (Dopamine Blue design)
- [x] Search Screen
- [x] Appointments Screen
- [x] Profile Screen
- [x] Tab Navigation

## Phase 2: Onboarding & Auth
- [ ] Splash Screen (animated medical logo)
- [ ] Onboarding (3 slides with animations)
- [ ] Welcome Screen (redesign)
- [ ] Login/Register (biometric support)

## Phase 3: Doctor Discovery
- [ ] Doctor Profile Screen (full gallery, reviews)
- [ ] Advanced Filters (specialty, price, rating, availability)
- [ ] Map View (nearby doctors)
- [ ] Compare Doctors

## Phase 4: Booking Flow
- [ ] Service Selection
- [ ] Date/Time Picker (calendar view)
- [ ] Confirmation Screen
- [ ] Payment Integration
- [ ] Booking Success Animation

## Phase 5: Communication
- [ ] Chat with Doctor (WhatsApp-style)
- [ ] Video Call Screen
- [ ] Voice Call Screen
- [ ] Call History

## Phase 6: Premium Features
- [ ] VIP Membership Screen
- [ ] Health Reels (TikTok-style)
- [ ] Blogs/Articles Section
- [ ] Emergency SOS Button

## Phase 7: Settings & Profile
- [ ] Edit Profile Screen
- [ ] Medical History
- [ ] Family Profiles
- [ ] Notification Settings
- [ ] Privacy & Security
- [ ] Help Center

## Phase 8: Polish
- [ ] Micro-animations everywhere
- [ ] Haptic feedback
- [ ] Loading skeletons
- [ ] Error states
- [ ] Empty states
- [ ] Pull-to-refresh animations

---

## Screen List (Total: 25+ screens)

### Auth Flow
1. SplashScreen
2. OnboardingScreen (3 slides)
3. WelcomeScreen
4. LoginScreen
5. RegisterScreen
6. ForgotPasswordScreen
7. OTPVerificationScreen

### Main Tabs
8. HomeScreen ✅
9. SearchScreen ✅
10. AppointmentsScreen ✅
11. ProfileScreen ✅

### Doctor Flow
12. DoctorDetailScreen
13. DoctorGalleryScreen
14. DoctorReviewsScreen
15. BookingScreen
16. DateTimePickerScreen
17. ConfirmBookingScreen
18. BookingSuccessScreen

### Communication
19. ChatScreen
20. VideoCallScreen
21. VoiceCallScreen

### Content
22. ReelsScreen
23. BlogListScreen
24. BlogDetailScreen

### Profile & Settings
25. EditProfileScreen
26. MedicalHistoryScreen
27. FamilyProfilesScreen
28. NotificationSettingsScreen
29. VIPMembershipScreen
30. HelpCenterScreen

---

## Animation Guidelines
- Use React Native Reanimated 2
- Shared element transitions between screens
- Micro-interactions on all buttons (scale 0.95)
- Skeleton loaders for all lists
- Pull-to-refresh with custom animation
- Tab bar spring animations
- Card press animations
- Page transitions (slide + fade)

import { apiRequest } from "./api-client";

export type PageResult<T> = {
  rows?: T[];
  records?: T[];
  total?: number;
};

export type MemberProfile = {
  id?: number;
  userId?: number;
  username?: string;
  nickname?: string;
  name?: string;
  phone?: string;
  gender?: 0 | 1;
  status?: string;
  balance?: number;
  createTime?: string;
};

export type HealthData = {
  id?: number;
  userId?: number;
  gender?: 0 | 1;
  birthDate?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  bodyFatRate?: number;
  measureTime?: string;
};

export type DietGap = {
  caloriesTarget?: number;
  caloriesActual?: number;
  caloriesGap?: number;
  proteinTarget?: number;
  proteinActual?: number;
  proteinGap?: number;
  fatTarget?: number;
  fatActual?: number;
  fatGap?: number;
  carbohydrateTarget?: number;
  carbohydrateActual?: number;
  carbohydrateGap?: number;
};

export type DietSummary = {
  date?: string;
  totalCalories?: number;
  totalProtein?: number;
  totalFat?: number;
  totalCarb?: number;
  recommendCalories?: number;
  recommendProtein?: number;
  recommendFat?: number;
  recommendCarb?: number;
  suggestions?: string[];
  details?: DietDetail[];
};

export type DietTarget = {
  caloriesTarget?: number;
  proteinTarget?: number;
  fatTarget?: number;
  carbohydrateTarget?: number;
};

export type Food = {
  id?: number;
  name?: string;
  emoji?: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrate?: number;
};

export type DietDetail = {
  id?: number;
  foodName?: string;
  amount?: number;
  calories?: number;
  protein?: number;
  fat?: number;
  carbohydrate?: number;
  mealType?: number;
};

export type DietRecordPayload = {
  foodId: number;
  amount: number;
  mealType: number;
  eatDate: string;
};

export type FoodAnalysis = {
  name?: string;
  estimatedWeight?: number;
  caloriesPer100g?: number;
  proteinPer100g?: number;
  fatPer100g?: number;
  carbPer100g?: number;
  analysis?: string;
};

export type BodyImage = {
  id?: number;
  imageUrl?: string;
  recordTime?: string;
  createTime?: string;
};

export type TrainingLog = {
  id?: number;
  memberId?: number;
  planId?: number;
  trainingDate?: string;
  durationMinutes?: number;
  intensity?: number;
  caloriesBurned?: number;
  feeling?: string;
  remark?: string;
};

export type TrainingCheckin = {
  id?: number;
  memberId?: number;
  planId?: number;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  status?: "0" | "1" | string;
};

export type TrainingReview = {
  memberId?: number;
  todayMinutes?: number;
  todayCalories?: number;
  todaySessions?: number;
  weeklyMinutes?: number;
  weeklyCalories?: number;
  weeklySessions?: number;
  totalSessions?: number;
  streakDays?: number;
  xpEarned?: number;
  level?: number;
  progressPercent?: number;
  badgeTitle?: string;
  mood?: string;
  review?: string;
  nextAction?: string;
  suggestions?: string[];
};

export type TrainingGrowth = {
  memberId?: number;
  totalXp?: number;
  level?: number;
  currentLevelXp?: number;
  nextLevelXp?: number;
  progressPercent?: number;
  streakDays?: number;
  totalSessions?: number;
  weeklyMinutes?: number;
  weeklySessions?: number;
  lastTrainingDate?: string;
  petMood?: string;
  badgeTitle?: string;
  lastRewardXp?: number;
  lastRewardReason?: string;
};

export type TrainingPlan = {
  id?: number;
  name?: string;
  goal?: string;
  status?: string;
  weeklyFrequency?: number;
  startDate?: string;
  endDate?: string;
};

export type TrainingPlanPayload = {
  goal: string;
  weeklyFrequency: number;
};

export type Course = {
  id?: number;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  difficulty?: string;
  calories?: number;
};

export type CourseSchedule = {
  id?: number;
  courseId?: number;
  coachId?: number;
  courseName?: string;
  coachName?: string;
  startTime?: string;
  endTime?: string;
  capacity?: number;
  enrolledCount?: number;
  isEnrolled?: boolean;
  dayOfWeek?: number;
  startDate?: string;
  endDate?: string;
};

export type Enrollment = {
  id?: number;
  scheduleId?: number;
  memberId?: number;
  memberName?: string;
  courseName?: string;
  coachName?: string;
  classTime?: string;
  duration?: number;
  price?: number;
  status?: string;
  createTime?: string;
};

export type Coach = {
  id?: number;
  name?: string;
  phone?: string;
  gender?: number;
  specialty?: string;
  specialties?: string;
  bio?: string;
  experienceYears?: number;
  certification?: string;
  hourlyRate?: number;
  description?: string;
  avatar?: string;
  status?: string;
};

export type PersonalTrainingSlot = {
  id?: number;
  coachId?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: number | string;
  statusText?: string;
};

export type PersonalTrainingBooking = {
  id?: number;
  coachId?: number;
  coachName?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  status?: number | string;
  statusText?: string;
  remark?: string;
};

export type TrafficSnapshot = {
  id?: number;
  areaId?: number;
  areaName?: string;
  currentCount?: number;
  capacity?: number;
  heatLevel?: number;
  snapshotTime?: string;
};

export type TrafficRecommendation = {
  areaId?: number;
  areaName?: string;
  location?: string;
  currentCount?: number;
  capacity?: number;
  occupancyPercent?: number;
  score?: number;
  priority?: number;
  statusLabel?: string;
  bestFor?: string;
  reason?: string;
  action?: string;
  snapshotTime?: string;
};

export type MemberCard = {
  id?: number;
  memberId?: number;
  cardNo?: string;
  cardType?: string;
  expireDate?: string;
  remainingTimes?: number;
  status?: string;
};

export type WalletBalance = {
  memberId?: number;
  balance?: number;
};

export type WalletTransaction = {
  id?: number;
  memberId?: number;
  transactionType?: string;
  amount?: number;
  remark?: string;
  createTime?: string;
};

export type RepairLog = {
  id?: number;
  equipmentId?: number;
  equipmentName?: string;
  faultDesc?: string;
  status?: number;
  statusDesc?: string;
  remark?: string;
  createTime?: string;
};

export type Equipment = {
  id?: number;
  name?: string;
  code?: string;
  location?: string;
  status?: number;
  statusDesc?: string;
};

export type ChatContact = {
  id: number;
  name?: string;
  avatar?: string;
  role?: string;
  unreadCount?: number;
  latestMessage?: string;
  latestMessageTime?: string;
};

export type ChatMessage = {
  id?: number;
  senderId?: number;
  senderRole?: string;
  senderName?: string;
  content?: string;
  createTime?: string;
  isSelf?: boolean;
  status?: string;
};

export function getMemberProfile() {
  return apiRequest<MemberProfile | null>("/member/profile");
}

export function getLatestHealthData() {
  return apiRequest<HealthData | null>("/health/data/latest");
}

export function saveHealthData(data: HealthData) {
  return apiRequest<void>("/health/data", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getDietGap(date: string) {
  return apiRequest<DietGap>(`/health/diet/gap?date=${encodeURIComponent(date)}`);
}

export function getDietSummary(date: string) {
  return apiRequest<DietSummary>(`/health/diet/summary?date=${encodeURIComponent(date)}`);
}

export function getDietTarget() {
  return apiRequest<DietTarget | null>("/health/diet/target");
}

export function saveDietTarget(target: DietTarget) {
  return apiRequest<void>("/health/diet/target", {
    method: "PUT",
    body: JSON.stringify(target)
  });
}

export function getFoodList(keyword = "") {
  return apiRequest<Food[]>(`/health/food/list?keyword=${encodeURIComponent(keyword)}`);
}

export function addCustomFood(food: Food) {
  return apiRequest<Food>("/health/food", {
    method: "POST",
    body: JSON.stringify(food)
  });
}

export function recordDiet(payload: DietRecordPayload) {
  return apiRequest<void>("/health/diet", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function deleteDietLog(id: number) {
  return apiRequest<void>(`/health/diet/${id}`, {
    method: "DELETE"
  });
}

export function analyzeFoodImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<FoodAnalysis>("/health/diet/analyze", {
    method: "POST",
    body
  });
}

export function getHealthDataHistory() {
  return apiRequest<HealthData[]>("/health/data/history");
}

export function uploadBodyImage(file: File) {
  const body = new FormData();
  body.append("file", file);
  return apiRequest<string>("/health/image/upload", {
    method: "POST",
    body
  });
}

export function saveBodyImageRecord(payload: { imageUrl: string; recordTime: string }) {
  return apiRequest<void>("/health/image/record", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getBodyImageHistory() {
  return apiRequest<BodyImage[]>("/health/image/history");
}

export function deleteBodyImage(id: number) {
  return apiRequest<void>(`/health/image/${id}`, {
    method: "DELETE"
  });
}

export function getTrainingLogs() {
  return apiRequest<TrainingLog[]>("/training/logs");
}

export function getTrainingReview() {
  return apiRequest<TrainingReview>("/training/review");
}

export function getTrainingGrowth() {
  return apiRequest<TrainingGrowth>("/training/growth");
}

export function getCurrentTrainingPlan() {
  return apiRequest<TrainingPlan | null>("/training/plans/current");
}

export function generateTrainingPlan(payload: TrainingPlanPayload) {
  return apiRequest<TrainingPlan>("/training/plans/generate", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getActiveTrainingCheckin() {
  return apiRequest<TrainingCheckin | null>("/training/checkin/active");
}

export function startTrainingCheckin(planId?: number) {
  const suffix = planId ? `?planId=${encodeURIComponent(String(planId))}` : "";
  return apiRequest<TrainingCheckin>(`/training/checkin/start${suffix}`, {
    method: "POST"
  });
}

export function endTrainingCheckin(checkinId: number) {
  return apiRequest<TrainingCheckin>(`/training/checkin/end?checkinId=${encodeURIComponent(String(checkinId))}`, {
    method: "POST"
  });
}

export function addTrainingLog(log: TrainingLog) {
  return apiRequest<void>("/training/logs", {
    method: "POST",
    body: JSON.stringify(log)
  });
}

export function getMemberCourses() {
  return apiRequest<Course[]>("/member/course/list");
}

export function getMemberCourseSchedules(params: { courseId?: number; coachId?: number } = {}) {
  const query = new URLSearchParams();
  if (params.courseId) query.set("courseId", String(params.courseId));
  if (params.coachId) query.set("coachId", String(params.coachId));
  const suffix = query.toString() ? `?${query.toString()}` : "";
  return apiRequest<CourseSchedule[]>(`/member/course/schedules${suffix}`);
}

export function getMemberEnrollments() {
  return apiRequest<PageResult<Enrollment> | Enrollment[]>("/member/course/my-enrollments");
}

export function getMemberCoachList() {
  return apiRequest<Coach[]>("/member/coach/list");
}

export function enrollCourse(scheduleId: number) {
  return apiRequest<void>("/member/course/enroll", {
    method: "POST",
    body: JSON.stringify({ scheduleId })
  });
}

export function cancelCourseEnrollment(enrollmentId: number) {
  return apiRequest<void>(`/member/course/cancel/${enrollmentId}`, {
    method: "POST"
  });
}

export function getCoachSlots(coachId: number, date?: string) {
  const suffix = date ? `?date=${encodeURIComponent(date)}` : "";
  return apiRequest<PersonalTrainingSlot[]>(`/member/coach/${coachId}/slots${suffix}`);
}

export function bookPersonalTraining(payload: {
  coachId: number;
  slotId?: number;
  date: string;
  startTime: string;
  endTime: string;
  remark?: string;
}) {
  return apiRequest<void>("/member/personal-training/book", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getPersonalTrainingBookings() {
  return apiRequest<PersonalTrainingBooking[]>("/member/personal-training/bookings");
}

export function cancelPersonalTrainingBooking(bookingId: number) {
  return apiRequest<void>(`/member/personal-training/bookings/${bookingId}/cancel`, {
    method: "PUT"
  });
}

export function getCurrentTraffic() {
  return apiRequest<TrafficSnapshot[]>("/gym/traffic/current");
}

export function getTrafficHeatmap() {
  return apiRequest<TrafficSnapshot[]>("/gym/traffic/heatmap");
}

export function getTrafficRecommendations(goal = "", limit = 5) {
  const query = new URLSearchParams();
  if (goal) query.set("goal", goal);
  query.set("limit", String(limit));
  return apiRequest<TrafficRecommendation[]>(`/gym/traffic/recommendations?${query.toString()}`);
}

export function getValidMemberCard(memberId: number) {
  return apiRequest<MemberCard | null>(`/member/card/valid/${memberId}`);
}

export function getWalletBalance(memberId: number) {
  return apiRequest<number | WalletBalance>(`/member/wallet/balance/${memberId}`);
}


export function buyMemberCard(payload: { memberId: number; cardType: string; amount: number; duration: number; remark?: string }) {
  return apiRequest<void>("/member/card/buy", { method: "POST", body: JSON.stringify(payload) });
}
export function rechargeWallet(memberId: number, amount: number, remark = "会员端充值") {
  return apiRequest<void>(
    `/member/wallet/recharge?memberId=${encodeURIComponent(String(memberId))}&amount=${encodeURIComponent(String(amount))}&remark=${encodeURIComponent(remark)}`,
    { method: "POST" }
  );
}

export function getWalletTransactions(memberId: number, pageNum = 1, pageSize = 10) {
  return apiRequest<PageResult<WalletTransaction>>(
    `/member/wallet/transactions?memberId=${encodeURIComponent(String(memberId))}&pageNum=${pageNum}&pageSize=${pageSize}`
  );
}

export function getEquipmentPage() {
  return apiRequest<PageResult<Equipment>>("/equipment/member-options?pageNum=1&pageSize=50");
}

export function getMyRepairLogs() {
  return apiRequest<PageResult<RepairLog> | RepairLog[]>("/equipment/repair/my?pageNum=1&pageSize=20");
}

export function createRepairLog(payload: { equipmentId: number; faultDesc: string; remark?: string }) {
  return apiRequest<void>("/equipment/repair/create", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function getChatUnreadCount() {
  return apiRequest<number>("/chat/unread-count");
}

export function getChatContacts() {
  return apiRequest<ChatContact[]>("/chat/contacts");
}

export function getChatMessages(contactId: number, contactRole: string) {
  return apiRequest<ChatMessage[]>(`/chat/list?contactId=${encodeURIComponent(String(contactId))}&contactRole=${encodeURIComponent(contactRole)}`);
}

export function sendChatMessage(payload: { receiverId: number; receiverRole: string; content: string }) {
  return apiRequest<ChatMessage>("/chat/send", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function pageRows<T>(value: PageResult<T> | T[] | null | undefined) {
  if (Array.isArray(value)) return value;
  return value?.rows ?? value?.records ?? [];
}

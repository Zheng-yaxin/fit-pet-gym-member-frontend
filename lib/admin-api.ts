import { apiRequest } from "./api-client";

export type PageResult<T> = { rows?: T[]; records?: T[]; total?: number };
export function rowsOf<T>(r: PageResult<T> | T[] | null | undefined): T[] {
  if (!r) return [];
  if (Array.isArray(r)) return r;
  return r.rows ?? r.records ?? [];
}

// ---- Dashboard ----
export function getDashboardOverview() {
  return apiRequest<Record<string, unknown>>("/dashboard/overview");
}

// ---- Members ----
export type Member = {
  id?: number; name?: string; phone?: string; gender?: number;
  cardNo?: string; cardType?: string; balance?: number;
  status?: string; expireDate?: string; createTime?: string;
};
export type MemberAddDto = {
  name: string; phone: string; password: string; gender: number;
};
export function getMemberList(params: { pageNum?: number; pageSize?: number; keyword?: string } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.keyword) q.set("keyword", params.keyword);
  return apiRequest<PageResult<Member>>(`/member/list?${q}`);
}
export function getMemberById(id: number) { return apiRequest<Member>(`/member/${id}`); }
export function addMember(data: MemberAddDto) { return apiRequest<void>("/member", { method: "POST", body: JSON.stringify(data) }); }
export function updateMember(data: Member) { return apiRequest<void>("/member", { method: "PUT", body: JSON.stringify(data) }); }
export function deleteMember(id: number) { return apiRequest<void>(`/member/${id}`, { method: "DELETE" }); }

// ---- Member Cards ----
export type MemberCard = {
  id?: number; memberId?: number; cardNo?: string; cardType?: string;
  issueDate?: string; expireDate?: string; remainingTimes?: number;
  status?: string; memberName?: string; createTime?: string;
};
export function getCardList(params: { pageNum?: number; pageSize?: number; keyword?: string; status?: string } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.keyword) q.set("keyword", params.keyword);
  if (params.status) q.set("status", params.status);
  return apiRequest<PageResult<MemberCard>>(`/member/card/list?${q}`);
}

// ---- Equipment ----
export type EquipmentVO = {
  id?: number; name?: string; categoryId?: number; categoryName?: string;
  brand?: string; model?: string; status?: number; location?: string;
  buyDate?: string; price?: number; remark?: string; createTime?: string;
};
export function getEquipmentPage(params: { pageNum?: number; pageSize?: number; keyword?: string } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.keyword) q.set("keyword", params.keyword);
  return apiRequest<PageResult<EquipmentVO>>(`/equipment/page?${q}`);
}

// ---- Repairs ----
export type RepairLog = {
  id?: number; equipmentId?: number; equipmentName?: string;
  faultDesc?: string; status?: string; handlerName?: string;
  handleResult?: string; createTime?: string; handleTime?: string;
  reporterName?: string;
};
export function getRepairPage(params: { pageNum?: number; pageSize?: number } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  return apiRequest<PageResult<RepairLog>>(`/equipment/repair/page?${q}`);
}
export function handleRepair(data: { id: number; handleResult: string; status: string }) {
  return apiRequest<void>("/equipment/repair/handle", { method: "POST", body: JSON.stringify(data) });
}

// ---- Courses ----
export type CourseVO = {
  id?: number; name?: string; description?: string; duration?: number;
  price?: number; difficulty?: string; calories?: number; categoryId?: number;
  status?: string; createTime?: string;
};
export function getCourseList(params: { pageNum?: number; pageSize?: number } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  return apiRequest<PageResult<CourseVO>>(`/course/list?${q}`);
}

// ---- Exercises ----
export type ExerciseVO = {
  id?: number; name?: string; primaryMuscle?: string; secondaryMuscles?: string;
  movementPattern?: string; equipment?: string; difficulty?: string;
  steps?: string; tips?: string; status?: string; createTime?: string;
};
export function getExerciseList() {
  return apiRequest<PageResult<ExerciseVO>>("/exercise/list?pageSize=200");
}
export function addExercise(data: ExerciseVO) {
  return apiRequest<void>("/admin/exercise", { method: "POST", body: JSON.stringify(data) });
}
export function updateExercise(id: number, data: ExerciseVO) {
  return apiRequest<void>(`/admin/exercise/${id}`, { method: "PUT", body: JSON.stringify(data) });
}
export function deleteExercise(id: number) {
  return apiRequest<void>(`/admin/exercise/${id}`, { method: "DELETE" });
}

// ---- Admin Member Cards ----
export function getCardPage(params: { pageNum?: number; pageSize?: number; keyword?: string; status?: string } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.keyword) q.set("keyword", params.keyword);
  if (params.status) q.set("status", params.status);
  return apiRequest<PageResult<MemberCard>>(`/member/card/list?${q}`);
}
export function suspendCard(cardId: number, months: number) {
  return apiRequest<void>(`/member/card/suspend?cardId=${cardId}&months=${months}`, { method: "POST" });
}
export function reportLossCard(cardId: number) {
  return apiRequest<void>(`/member/card/loss/${cardId}`, { method: "POST" });
}

// ---- Training Logs ----
export type TrainingLog = {
  id?: number; memberId?: number; memberName?: string;
  trainingDate?: string; durationMinutes?: number; caloriesBurned?: number;
  feeling?: string; remark?: string; createTime?: string;
};
export function getAllTrainingLogs() {
  return apiRequest<TrainingLog[]>("/admin/training/logs");
}
// ---- Admin Enrollments ----
export type EnrollmentDetail = {
  id?: number;
  memberName?: string;
  courseName?: string;
  coachName?: string;
  classTime?: string;
  status?: string;
  createTime?: string;
};
export function getEnrollmentList(params: { pageNum?: number; pageSize?: number; status?: string } = {}) {
  const q = new URLSearchParams();
  if (params.pageNum) q.set("pageNum", String(params.pageNum));
  if (params.pageSize) q.set("pageSize", String(params.pageSize));
  if (params.status) q.set("status", params.status);
  return apiRequest<PageResult<EnrollmentDetail>>(`/admin/course/enrollment/list?${q}`);
}
export function updateEnrollmentStatus(id: number, status: string) {
  return apiRequest<void>(`/admin/course/enrollment/${id}/status?status=${status}`, { method: "PUT" });
}
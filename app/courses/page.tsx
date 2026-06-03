"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, CalendarCheck, UserRound } from "lucide-react";
import { FeatureMotionDirector } from "@/components/motion/feature-motion-director";
import {
  bookPersonalTraining,
  cancelCourseEnrollment,
  cancelPersonalTrainingBooking,
  enrollCourse,
  getCoachSlots,
  getMemberCoachList,
  getMemberCourseSchedules,
  getMemberCourses,
  getMemberEnrollments,
  getPersonalTrainingBookings,
  pageRows,
  type Coach,
  type Course,
  type CourseSchedule,
  type Enrollment,
  type PersonalTrainingBooking,
  type PersonalTrainingSlot
} from "@/lib/member-api";
import { todayDateString } from "@/lib/home-model";
import "../feature-placeholder.css";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [slots, setSlots] = useState<PersonalTrainingSlot[]>([]);
  const [bookings, setBookings] = useState<PersonalTrainingBooking[]>([]);
  const [selectedCoach, setSelectedCoach] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayDateString());
  const [remark, setRemark] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [nextCourses, nextSchedules, nextEnrollments, nextCoaches, nextBookings] = await Promise.all([
        getMemberCourses(),
        getMemberCourseSchedules(),
        getMemberEnrollments(),
        getMemberCoachList(),
        getPersonalTrainingBookings()
      ]);
      setCourses(nextCourses ?? []);
      setSchedules(nextSchedules ?? []);
      setEnrollments(pageRows(nextEnrollments));
      setCoaches(nextCoaches ?? []);
      setBookings(nextBookings ?? []);
      const coachId = selectedCoach || String(nextCoaches?.[0]?.id ?? "");
      setSelectedCoach(coachId);
      if (coachId) setSlots(await getCoachSlots(Number(coachId), selectedDate));
    } catch (err) {
      setError(err instanceof Error ? err.message : "课程数据加载失败。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshSlots = async () => {
    if (!selectedCoach) return;
    setSlots(await getCoachSlots(Number(selectedCoach), selectedDate));
  };

  const handleEnroll = async (scheduleId?: number) => {
    if (!scheduleId) return;
    setBusy(true);
    try {
      await enrollCourse(scheduleId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "团课预约失败。");
    } finally {
      setBusy(false);
    }
  };

  const handleBookSlot = async (slot: PersonalTrainingSlot) => {
    if (!selectedCoach || !slot.startTime || !slot.endTime) return;
    if (Number(slot.status) !== 0) {
      setError(slot.statusText ?? "该时间段当前不可预约。");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await bookPersonalTraining({
        coachId: Number(selectedCoach),
        slotId: slot.id,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        remark
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "私教预约失败。");
    } finally {
      setBusy(false);
    }
  };

  const handleCoachForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await refreshSlots();
  };

  const activeEnrollments = enrollments.filter((enrollment) => enrollment.status === "0");
  const activeBookings = bookings.filter((booking) => {
    const status = Number(booking.status);
    return status === 0 || status === 1;
  });
  const activeBookingCount = activeEnrollments.length + activeBookings.length;

  const handleCancelEnrollment = async (enrollmentId?: number) => {
    if (!enrollmentId) return;
    setBusy(true);
    setError("");
    try {
      await cancelCourseEnrollment(enrollmentId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "团课取消失败。");
    } finally {
      setBusy(false);
    }
  };

  const handleCancelBooking = async (bookingId?: number) => {
    if (!bookingId) return;
    setBusy(true);
    setError("");
    try {
      await cancelPersonalTrainingBooking(bookingId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "私教预约取消失败。");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="feature-page feature-motion-page feature-motion-booking" aria-label="课程预约">
      <FeatureMotionDirector variant="booking" />
      <div className="feature-shell wide">
        <Link className="feature-back" href="/">
          <ArrowLeft size={18} />
          返回首页
        </Link>
        <section className="feature-panel">
          <div className="feature-heading">
            <span>Booking</span>
            <h1>课程预约</h1>
            <p>团课预约和私教预约共用一个入口，所有状态来自后端。</p>
          </div>

          {error ? <p className="feature-error">{error}</p> : null}
          {loading ? <p className="feature-muted">正在加载课程和教练...</p> : null}

          <div className="feature-grid three">
            <article className="feature-data"><span>可选课程</span><h2>{courses.length}</h2><p>数据源：/member/course/list</p></article>
            <article className="feature-data"><span>可约团课</span><h2>{schedules.length}</h2><p>数据源：/member/course/schedules</p></article>
            <article className="feature-data"><span>我的预约</span><h2>{activeBookingCount}</h2><p>仅显示未取消的团课和私教。</p></article>
          </div>

          <div className="feature-grid two">
            <article className="feature-list">
              <span>
                <CalendarCheck size={16} />
                团课时间
              </span>
              {schedules.slice(0, 8).map((schedule) => (
                <div className="feature-row" key={schedule.id}>
                  <div>
                    <h3>{schedule.courseName ?? `课程 ${schedule.courseId}`}</h3>
                    <p>{schedule.coachName ?? "待定教练"} · {schedule.startTime ?? "--"} - {schedule.endTime ?? "--"} · {schedule.enrolledCount ?? 0}/{schedule.capacity ?? "--"}</p>
                  </div>
                  <button type="button" disabled={busy} onClick={() => handleEnroll(schedule.id)}>预约</button>
                </div>
              ))}
              {!schedules.length ? <p>暂无可预约团课。</p> : null}
            </article>

            <article className="feature-list">
              <span>我的团课</span>
              {activeEnrollments.map((item) => (
                <div className="feature-row" key={item.id}>
                  <div>
                    <h3>{item.courseName ?? "团课预约"}</h3>
                    <p>{item.coachName ?? "教练待定"} · {item.classTime ?? item.createTime ?? "--"} · 状态 {item.status ?? "--"}</p>
                  </div>
                  <button type="button" disabled={busy || !item.id} onClick={() => handleCancelEnrollment(item.id)}>取消</button>
                </div>
              ))}
              {!activeEnrollments.length ? <p>暂无团课预约。</p> : null}
            </article>
          </div>

          <div className="feature-grid two">
            <form className="feature-form" onSubmit={handleCoachForm}>
              <h2>
                <UserRound size={20} />
                私教时间段
              </h2>
              <label>教练<select value={selectedCoach} onChange={(event) => setSelectedCoach(event.target.value)}>{coaches.map((coach) => <option key={coach.id} value={coach.id}>{coach.name}</option>)}</select></label>
              <label>日期<input type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} /></label>
              <label>备注<input value={remark} onChange={(event) => setRemark(event.target.value)} placeholder="训练目标或注意事项" /></label>
              <button type="submit">查询时间段</button>
              <div className="feature-chip-row">
                {slots.slice(0, 8).map((slot) => (
                  <button type="button" key={slot.id ?? `${slot.startTime}-${slot.endTime}`} onClick={() => handleBookSlot(slot)} disabled={busy || Number(slot.status) !== 0}>
                    {slot.startTime} - {slot.endTime}{slot.statusText ? ` · ${slot.statusText}` : ""}
                  </button>
                ))}
              </div>
            </form>

            <article className="feature-list">
              <span>我的私教</span>
              {activeBookings.slice(0, 6).map((booking) => (
                <div className="feature-row" key={booking.id}>
                  <div>
                    <h3>{booking.coachName ?? "私教预约"}</h3>
                    <p>{booking.date ?? "--"} · {booking.startTime ?? "--"} - {booking.endTime ?? "--"} · {booking.statusText ?? booking.status ?? "--"}</p>
                  </div>
                  <button type="button" disabled={busy || !booking.id} onClick={() => handleCancelBooking(booking.id)}>取消</button>
                </div>
              ))}
              {!activeBookings.length ? <p>暂无私教预约。</p> : null}
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

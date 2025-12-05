import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { BASE_API_URL } from "../../common/constants";
import './CalendarPage.css'

function CalendarPage() {
  // react-calendar에서 range 선택을 위해 배열로 관리
  const [range, setRange] = useState([new Date(), new Date()]);
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const startDate = range?.[0] ?? null;
  const endDate = range?.[1] ?? null;
  const token = localStorage.getItem("token");
  // 선택한 월의 일정 불러오기
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BASE_API_URL}/api/schedules`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res.data);
        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
        const data = Array.isArray(res.data) ? res.data : [];
        setSchedules(data);
      } catch (err) {
        console.error(err);
        setSchedules([]);
      }
    };
    fetchSchedules();
  }, [startDate]);

  // 일정 등록
  const handleRegister = async () => {
    setError("");

    // 검증
    if (!startDate || !endDate) {
      setError("시작 날짜와 끝나는 날짜를 모두 선택해 주세요.");
      return;
    }
    if (startDate > endDate) {
      setError("시작 날짜가 끝나는 날짜보다 늦을 수 없습니다.");
      return;
    }
    if (!title.trim()) {
      setError("일정 제목을 입력해 주세요.");
      return;
    }

    try {
      const username = localStorage.getItem("username");
      console.log(username,token)
      await axios.post(
        BASE_API_URL+"/api/schedules",
        {
          username: username,
          title,
          description,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("일정 등록 완료");
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err);
      alert("등록 실패");
    }
  };

  // const isSameDay = (d1, d2) =>
  //   d1.getFullYear() === d2.getFullYear() &&
  //   d1.getMonth() === d2.getMonth() &&
  //   d1.getDate() === d2.getDate();


const toDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isSameDay = (a, b) => toDay(a).getTime() === toDay(b).getTime();

const inRange = (date, s) => {
  const d = toDay(date);
  const start = toDay(new Date(s.startDate));
  const end = toDay(new Date(s.endDate));
  return d >= start && d <= end;
};

const isStart = (date, s) => isSameDay(toDay(date), toDay(new Date(s.startDate)));
const isEnd   = (date, s) => isSameDay(toDay(date), toDay(new Date(s.endDate)));




  return (
    <div className="container">
      <h2>상세 일정 캘린더</h2>

      {/* range 선택 활성화 */}
      {/* <Calendar
      selectRange
      onChange={(value) => {
        setRange(value);
      }}
      value={range}
      tileContent={({ date, view }) => {
        if (view === "month") {
          const daySchedules = schedules.filter((s) =>
            isSameDay(new Date(s.startDate), date)
          );
          
          return (
            <div className="tile-container">
              {daySchedules.slice(0, 2).map((s, idx) => (
                <div className="tile-text"
                  key={idx}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  • {s.title}
                </div>
              ))}
              {daySchedules.length > 2 && (
                <div>+{daySchedules.length - 2} more</div>
              )}
            </div>
          );
        }
      }}
    /> */}

<Calendar
  selectRange
  onChange={(value) => setRange(value)}
  value={range}
  tileContent={({ date, view }) => {
    if (view !== "month") return null;

    // 해당 날짜에 걸친 모든 일정
    const rangeSchedules = schedules.filter((s) => inRange(date, s));
    
    
    return (
      <div className="tile-container">
        {/* 기간 하이라이트 바: 겹칠 경우 여러 줄로 쌓이게 */}
        {rangeSchedules.map((s) => {
          const start = isStart(date, s);
          const end = isEnd(date, s);

          let barClass = "range-bar";
          if (start) barClass += " start";
          else if (end) barClass += " end";
          else barClass += " middle";

          return (
            <div key={`bar-${s.id ?? s.title}-${s.startDate}`} className={barClass} title={s.title}>
              {start && <span className="range-text">• {s.title}</span>}
            </div>
          );
        })}


        {/* 시작일인데 range-bar 위에 텍스트가 너무 좁다면 별도 텍스트 라인을 덧붙일 수 있음
            지금은 range-bar 안에 range-text로 처리하므로 불필요 */}
      </div>
    );
  }}
/>


      <h3>
        선택한 범위:{" "}
        {startDate ? startDate.toLocaleDateString() : "-"} ~{" "}
        {endDate ? endDate.toLocaleDateString() : "-"}
      </h3>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
        <input
          type="text"
          placeholder="일정 제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="일정 설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleRegister}>일정 등록</button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>이번 달 일정 목록</h3>
        {Array.isArray(schedules) && schedules.length > 0 ? (
          <ul>
            {schedules.map((s) => (
              <li key={s.id}>
                {new Date(s.startDate).toLocaleDateString()} ~{" "}
                {new Date(s.endDate).toLocaleDateString()} : {s.title}
              </li>
            ))}
          </ul>
        ) : (
          <p>등록된 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default CalendarPage;

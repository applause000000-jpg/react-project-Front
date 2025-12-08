import React, { useState, useEffect, useMemo } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import "react-calendar/dist/Calendar.css";
import { BASE_API_URL } from "../../common/constants";
import './CalendarPage.css'
import assignTracks from "./track";

function CalendarPage() {
  // react-calendar에서 range 선택을 위해 배열로 관리
  const [range, setRange] = useState([new Date(), new Date()]);
  const [schedules, setSchedules] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [startTime, setStartTime] = useState(""); 
  const [endTime, setEndTime] = useState(""); 
  const [mode, setMode] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [daySchedules, setDaySchedules] = useState("");

  const startDate = range?.[0] ?? null;
  const endDate = range?.[1] ?? null;
  const startDateTime = new Date(startDate);
  if (startTime) {
    const [h, m] = startTime.split(":");
    startDateTime.setHours(h, m);
  }

  const endDateTime = new Date(endDate);
  if (endTime) {
    const [h, m] = endTime.split(":");
    endDateTime.setHours(h, m);
  }


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

  function openModalForDate(date) {
    setSelectedDate(date);
    const selectedDay = new Date(date);
    selectedDay.setHours(0, 0, 0, 0);

    const daySchedules = schedules.filter((s) => {
      const start = new Date(s.startDate);
      const end = new Date(s.endDate);

      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);

      return selectedDay >= start && selectedDay <= end;
    });

    setDaySchedules(daySchedules);
    setShowDetailModal(true);
  }

  function getColorFromId(id) {
    const colors = ["#ee8b8bff","#72baf5ff", "#64c4bdff", "#dde47dff", "#eeaa4bff"];
    return colors[id % colors.length]; // id를 기준으로 색상 고정
  }



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
      // console.log(username,token)
      await axios.post(
        BASE_API_URL+"/api/schedules",
        {
          username: username,
          title,
          description,
          startDate: startDateTime.toISOString(),
          endDate: endDateTime.toISOString(),
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

  const { tracks, maxTrackCount } = useMemo(() => assignTracks(schedules), [schedules]);


  return (
    <div className="container">
      <h2>상세 일정 캘린더</h2>
      <button onClick={() => {setMode(!mode); setRange(null)}}>
        {mode ? "상세보기 모드로 전환" : "등록 모드로 전환"}
      </button> 
      <Calendar
        selectRange={mode}
        value={range}
        onChange={(value) => {
          if (mode) {
            // 등록 모드 → 날짜 범위 선택
            setRange(value);
            setShowRegisterModal(true);
          } else {
            // 기본 모드 → 단일 날짜 클릭 시 모달 띄우기
            if (Array.isArray(value)) {
              openModalForDate(value[0]);
            } else {
              openModalForDate(value);
            }
          }
        }}

        // onChange={(value) => setRange(value)}
        
        tileContent={({ date, view }) => {
          if (view !== "month") return null;

          // 날짜별 전체 일정 개수 (화살표 표시용)
          const totalCountForDate = tracks
            .flatMap((track) => track.filter((item) => inRange(date, item))).length;

          // 트랙 고정: 항상 maxTrackCount 줄을 만들되, 출력은 최대 3줄까지만
          const rows = Array.from({ length: maxTrackCount }, (_, trackIdx) => {
            const s = tracks[trackIdx]?.find((item) => inRange(date, item));
            if (!s) {
              return (
                <div className="track-row" key={`row-${trackIdx}`}>
                  <div className="range-bar empty" />
                </div>
              );
            }

            const start = isStart(date, s);
            const end = isEnd(date, s);

            // 당일 일정의 경우 1칸짜리 일정만들기 위해서 작성
            const startDate = new Date(s.startDate);
            const endDate = new Date(s.endDate);
            startDate.setHours(0,0,0,0);
            endDate.setHours(0,0,0,0);
            const isSingleDay = startDate.getTime() === endDate.getTime();

            let barClass = "range-bar";
            if (isSingleDay) {
              barClass += " single";
            } else if (start) {
              barClass += " start";
            } else if (end) {
              barClass += " end";
            } else {
              barClass += " middle";
            }


            return (
              <div className="track-row" key={`row-${trackIdx}`}>
                <div className={barClass}  title={s.title} style={{ backgroundColor: getColorFromId(s.id) }}>
                  {start && <span className="range-text" style={{ color: getColorFromId(s.id) }}>• {s.title}</span>}
                </div>
              </div>
            );
          }).slice(0, 3);

          return (
            <div className="tile-container">
              {rows}
              {totalCountForDate > 3 && (
                <div className="track-row">
                  <span className="more-indicator">▼</span>
                </div>
              )}
            </div>
          );
        }}




      />

      {/* 모달창 제작 */}
      {showDetailModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>선택된 날짜</h3>
            <p>{selectedDate?.toLocaleDateString()}</p>
            {daySchedules.length > 0 ? (
              <ul>
                {daySchedules.map((s) => (
                  // <li key={s.id}>
                  //   <strong>{s.title}</strong> ({new Date(s.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  //   ~ {new Date(s.endDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})
                  //   <p>{s.description}</p>
                  // </li>
                  <li key={s.id}>
                    <strong>{s.title}</strong>
                    {barClass.includes("single") && (
                      <> ({new Date(s.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                      ~ {new Date(s.endDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})})</>
                    )}
                    {barClass.includes("start") && (
                      <> ({new Date(s.startDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} 시작)</>
                    )}
                    {barClass.includes("middle") && (
                      <> (종일)</>
                    )}
                    {barClass.includes("end") && (
                      <> ({new Date(s.endDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} 종료)</>
                    )}
                    <p>{s.description}</p>
                  </li>

                ))}
              </ul>
            ) : (
              <p>등록된 일정이 없습니다.</p>
            )}

            <button onClick={() => {setShowDetailModal(false); setRange(null)}}>닫기</button>
          </div>
        </div>
      )}
      {showRegisterModal &&(
      <div className="modal">
        <div className="modal-content">
          <h3>
            선택한 범위:{" "}
            {startDate ? startDate.toLocaleDateString() : "-"} ~{" "}
            {endDate ? endDate.toLocaleDateString() : "-"}
          </h3>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {startDate && endDate && (
            <div className="time-inputs">
              <label>
                시작 시간:
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </label>
              <label>
                종료 시간:
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
              </label>
            </div>
          )}

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
          <button onClick={() => {setShowRegisterModal(false); setRange(null)}}>닫기</button>
        </div>
       </div>
      )}

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

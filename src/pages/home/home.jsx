import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_API_URL } from "../../common/constants";
import useUserStore from '../../store/useUserStore';
function Home(){
  const [schedules, setSchedules] = useState([]);
  const currentUser=useUserStore((state)=>state.user);
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
  }, []);
  return(
    
    <div className="home">
      <h3 className="hometitle">{currentUser.name} 님의 오늘의 일정</h3>
      {Array.isArray(schedules) && schedules.length > 0 ? (
        <ul className="list-group">
          {schedules
            .filter((s) => {
              const today = new Date();
              const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
              const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
              const start = new Date(s.startDate);
              const end = new Date(s.endDate);

              return start <= todayEnd && end >= todayStart;
            })
            .map((s) => (
              <li className="list-group-item" key={s.id}>
                {new Date(s.startDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} ~{" "}
                {new Date(s.endDate).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} : {s.title}
              </li>
            ))}
        </ul>
      ) : (
        <p>오늘 등록된 일정이 없습니다.</p>
      )}
    </div>

  )
}

export default Home;
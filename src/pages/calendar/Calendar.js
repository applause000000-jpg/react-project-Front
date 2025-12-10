import { BASE_API_URL } from "../../common/constants";

function toDateOnly(d) {
  const date = new Date(d);
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()); 
}


export default function assignTracks(schedules) {
  // 길이가 긴 일정부터 배치하면 안정적으로 겹침을 최소화
  const sorted = [...schedules].sort((a, b) =>
    new Date(b.endDate) - new Date(b.startDate)
  );

  const tracks = []; // 각 트랙: 일정 배열
  sorted.forEach((s) => {
    let placed = false;
    for (let i = 0; i < tracks.length; i++) {
      const track = tracks[i];
      // 이 트랙에 있는 어떤 일정과도 겹치지 않으면 배치
      const overlaps = track.some((t) => {
        const sStart = toDateOnly(s.startDate);
        const sEnd = toDateOnly(s.endDate);
        const tStart = toDateOnly(t.startDate);
        const tEnd = toDateOnly(t.endDate);
        // 겹침 조건: sStart <= tEnd && sEnd >= tStart
        return sStart <= tEnd && sEnd >= tStart;
      });
      if (!overlaps) {
        track.push(s);
        s.trackIndex = i; // 트랙 번호 "영구" 기록
        placed = true;
        break;
      }
    }
    if (!placed) {
      const idx = tracks.length;
      tracks.push([s]);
      s.trackIndex = idx; // 새 트랙 번호 "영구" 기록
    }
  });

  return { tracks, maxTrackCount: tracks.length };
}

export async function deleteSchedule(scheduleId) {
  try {
    const response = await fetch(`${BASE_API_URL}/api/schedules/${scheduleId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      // 실패 알림은 여기서!
      alert("삭제에 실패했습니다.");
      return false;
    }

    return true; // 성공
  } catch (error) {
    console.error("삭제 요청 오류:", error);
    alert("서버 오류가 발생했습니다.");
    return false;
  }
}






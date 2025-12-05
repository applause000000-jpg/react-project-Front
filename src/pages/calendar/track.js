// export default function assignTracks(schedules) {
//   const tracks = [];
//   schedules.forEach(s => {
//     let placed = false;
//     for (const track of tracks) {
//       // 이 트랙에 이미 있는 일정들과 겹치지 않으면 배치
//       if (track.every(t => new Date(s.startDate) > new Date(t.endDate) || new Date(s.endDate) < new Date(t.startDate))) {
//         track.push(s);
//         placed = true;
//         break;
//       }
//     }
//     if (!placed) {
//       tracks.push([s]); // 새로운 트랙 생성
//     }
//   });
//   return tracks;
// }


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
        const sStart = new Date(s.startDate);
        const sEnd = new Date(s.endDate);
        const tStart = new Date(t.startDate);
        const tEnd = new Date(t.endDate);
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




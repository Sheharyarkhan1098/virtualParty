export default {
  HOME: () => "/",
  EVENT_SESSION: (sessionId = ":sessionId") => `/v/${sessionId}`,
  EVENT_SESSION_LIVE_CODE: (sessionId = ":sessionId", code = ":code") =>
    `/v/${sessionId}/live/${code}`,
  EVENT_SESSION_LIVE: (sessionId = ":sessionId") => `/v/${sessionId}/live`,
  EDIT_EVENT_SESSION: (sessionId = ":sessionId") => `/v/${sessionId}/edit`,
  JOIN_ROOM_LIVE: (sessionId = ":sessionId", roomId = ":roomId") =>
    `/v/${sessionId}/joinroom/${roomId}`,
  JOIN_ROOM_URL: (sessionId = ":sessionId", roomId = ":roomId") =>
    `/v/${sessionId}/room/${roomId}`,
  CREATE_EVENT_SESSION: () => "/new-event",
  LOGIN: () => "/login",
  LOGIN_EMAIL: () => "/login/email",
  LOGIN_REGISTER: () => "/login/register",
  EDIT_PROFILE: () => "/profile/edit",
  PAGE_NOT_FOUND: () => "/404"
};
